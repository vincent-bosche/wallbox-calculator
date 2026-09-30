import type { ComparisonResult, ConnectionClassComparison, HourlySeriesResult, PlannerState, PvConfig, SeasonComparisonResult, SeasonKey, Vehicle } from '~/types/planner'
import { buildConnectionGroups, householdDailyKwh, pvSeasonalDailyYieldKwh, vehicleDailyEnergyKwh } from './calculations'
import { CONNECTION_CLASSES, DAYS_PER_SEASON, SEASON_DAYLIGHT_HOURS, SEASONS } from './constants'
import { hourlyHomeMask } from './time'

const HOURS_PER_DAY = 24

// Normierte, glockenförmige Tagesverlaufskurve (Peak mittags), auf den saisonalen
// Tagesertrag skaliert. Reine Rechenkomponente ohne Live-/Wetterdaten (Konzept Abschnitt 6).
export function pvGenerationCurve(pv: PvConfig, season: SeasonKey): number[] {
  const dailyYieldKwh = pvSeasonalDailyYieldKwh(pv, season)
  const curve = new Array(HOURS_PER_DAY).fill(0)
  if (dailyYieldKwh <= 0) return curve

  const daylightHours = SEASON_DAYLIGHT_HOURS[season]
  const start = 12 - daylightHours / 2
  const end = 12 + daylightHours / 2

  for (let h = 0; h < HOURS_PER_DAY; h++) {
    const hourCenter = h + 0.5
    if (hourCenter <= start || hourCenter >= end) continue
    const phase = (Math.PI * (hourCenter - start)) / daylightHours
    curve[h] = Math.sin(phase) ** 2
  }

  const total = curve.reduce((sum, v) => sum + v, 0)
  return total > 0 ? curve.map(v => (v / total) * dailyYieldKwh) : curve
}

function householdHourlyLoadKwh(state: PlannerState): number {
  return householdDailyKwh(state.household) / HOURS_PER_DAY
}

// Der Hausakku ist in erster Linie für den Haushalt da: er muss die Nacht (alle Stunden ohne
// PV-Erzeugung) überbrücken können, bevor irgendetwas davon dem Auto zugutekommt. Deshalb wird
// dieser Anteil der Kapazität für das Auto gesperrt - im Winter (lange Nächte, wenig Ertrag)
// bleibt dadurch oft gar nichts für das Auto übrig, selbst wenn der Speicher randvoll wäre.
function batteryReserveForHouseholdKwh(state: PlannerState, season: SeasonKey): number {
  if (!state.pv.enabled) return 0
  const nightHours = HOURS_PER_DAY - SEASON_DAYLIGHT_HOURS[season]
  return Math.min(state.pv.batteryKwh, householdHourlyLoadKwh(state) * nightHours)
}

// Sonnenstunden: Zuhause-Stunden, in denen die PV-Erzeugung den Hausverbrauch übersteigt (also
// ein direkt nutzbarer Überschuss für das Auto entsteht) - unabhängig von Ladeleistung/Strategie.
function countSunHours(state: PlannerState, season: SeasonKey): number {
  const pvGen = pvGenerationCurve(state.pv, season)
  const householdLoad = householdHourlyLoadKwh(state)
  const homeMasks = state.vehicles.map(v => hourlyHomeMask(v.absenceSlots))

  let count = 0
  for (let h = 0; h < HOURS_PER_DAY; h++) {
    const anyoneHome = homeMasks.some(mask => mask[h])
    if (anyoneHome && pvGen[h]! - householdLoad > 0.0001) count++
  }
  return count
}

// Stunde, ab der die 24 Tagesstunden "in Ankunftsreihenfolge" durchlaufen werden sollen:
// die erste Zuhause-Stunde nach dem längsten Abwesenheits-Block. Ohne diese Rotation würde
// ein über Mitternacht laufendes Zuhause-Fenster (z. B. 17:00-08:00) künstlich an Stunde 0
// zerschnitten und naives Laden fälschlich in die stromlosen frühen Morgenstunden verlegt,
// statt direkt bei der echten Ankunft (z. B. 17:00) zu beginnen.
function arrivalRotationStart(homeMask: boolean[]): number {
  const n = homeMask.length
  if (homeMask.every(Boolean)) return 0

  let bestStart = 0
  let bestLength = -1
  for (let start = 0; start < n; start++) {
    const prev = (start - 1 + n) % n
    const isAwayRunStart = !homeMask[start] && homeMask[prev]
    if (!isAwayRunStart) continue

    let length = 0
    while (!homeMask[(start + length) % n] && length < n) length++
    if (length > bestLength) {
      bestLength = length
      bestStart = (start + length) % n
    }
  }
  return bestStart
}

// Tatsächlich nutzbare Ladeleistung eines Fahrzeugs an einer angenommenen Anschlussklasse:
// gedeckelt sowohl durch die Fahrzeug-Hardware als auch durch den (hypothetischen) Anschluss.
function effectivePowerKw(vehicle: Vehicle, connectionPowerKw: number): number {
  return Math.min(vehicle.maxAcPowerKw, connectionPowerKw)
}

// Naiv-Ladeplan einer Anschluss-Gruppe: simuliert nur, WANN welches Fahrzeug lädt (unabhängig
// von PV), beginnend bei der tatsächlichen Ankunft (nicht bei Stunde 0) und mit voller
// (gedeckelter) Leistung, bis der Tagesbedarf gedeckt ist. Bei geteiltem Anschluss lädt pro
// Stunde nur ein Fahrzeug (Host zuerst) - siehe buildConnectionGroups.
function buildGroupNaiveSchedule(members: Vehicle[], season: SeasonKey, connectionPowerKw: number): {
  drawByVehicle: Map<string, number[]>
  unmetByVehicle: Map<string, number>
} {
  const memberMasks = new Map(members.map(v => [v.id, hourlyHomeMask(v.absenceSlots)]))
  const groupMask = Array.from({ length: HOURS_PER_DAY }, (_, h) =>
    members.some(v => memberMasks.get(v.id)![h]))
  const startHour = arrivalRotationStart(groupMask)

  const remaining = new Map(members.map(v => [v.id, vehicleDailyEnergyKwh(v, season)]))
  const drawByVehicle = new Map(members.map(v => [v.id, new Array(HOURS_PER_DAY).fill(0)]))

  for (let i = 0; i < HOURS_PER_DAY; i++) {
    const h = (startHour + i) % HOURS_PER_DAY
    const vehicle = members.find(v => memberMasks.get(v.id)![h] && remaining.get(v.id)! > 0.0001)
    if (!vehicle) continue

    const need = remaining.get(vehicle.id)!
    const draw = Math.min(effectivePowerKw(vehicle, connectionPowerKw), need)
    drawByVehicle.get(vehicle.id)![h] = draw
    remaining.set(vehicle.id, need - draw)
  }

  return { drawByVehicle, unmetByVehicle: remaining }
}

interface DaySimulationResult {
  gridKwh: number
  pvDirectKwh: number
  batteryKwh: number
  pvToCarByHour: number[]
  batteryToCarByHour: number[]
  carTotalByHour: number[]
}

type SimulationMode = 'naive' | 'smart' | 'potential'

// Simuliert einen Tag stundenweise in echter Chronologie (für PV/Batterie-Physik nötig) bei
// einer angenommenen Anschlussleistung (Schuko/1-phasig/11 kW/22 kW): Haushalt hat Vorrang vor
// PV-Erzeugung, überschüssige Energie lädt zuerst das Auto (naiv: nach festem, ankunftsbasiertem
// Plan / smart: nur der aktuelle Überschuss / potential: wie smart, aber ohne Tagesbedarf-Deckel
// - reine Obergrenze dessen, was PV am Anschluss während der Zuhause-Zeit überhaupt liefern
// könnte), danach - oberhalb der Haushaltsreserve, siehe batteryReserveForHouseholdKwh - die
// Batterie. Reicht PV+Batterie nicht, deckt das Netz den Rest. Bei naiv/smart wird nicht
// gedeckter Restbedarf am Ende zwingend aus dem Netz nachgeladen (das Auto muss vollwerden) -
// bei potential gibt es keinen Netzbezug, da dort keine feste Bedarfsgrenze simuliert wird.
function runDaySimulation(state: PlannerState, season: SeasonKey, mode: SimulationMode, connectionPowerKw: number): DaySimulationResult {
  const pvGen = pvGenerationCurve(state.pv, season)
  const householdLoad = householdHourlyLoadKwh(state)
  const batteryCapacityKwh = state.pv.enabled ? state.pv.batteryKwh : 0
  const batteryReserveKwh = batteryReserveForHouseholdKwh(state, season)
  let batterySoc = 0

  const groups = buildConnectionGroups(state.vehicles)
  const vehicleById = new Map(state.vehicles.map(v => [v.id, v]))
  const homeMasks = new Map(state.vehicles.map(v => [v.id, hourlyHomeMask(v.absenceSlots)]))
  const remaining = new Map(state.vehicles.map(v => [v.id, vehicleDailyEnergyKwh(v, season)]))

  let gridKwh = 0
  let pvDirectKwh = 0
  let batteryKwh = 0
  const pvToCarByHour = new Array(HOURS_PER_DAY).fill(0)
  const batteryToCarByHour = new Array(HOURS_PER_DAY).fill(0)
  const carTotalByHour = new Array(HOURS_PER_DAY).fill(0)

  const naiveSchedules = mode === 'naive'
    ? new Map(groups.map(group => [
        group.hostId,
        buildGroupNaiveSchedule(group.memberIds.map(id => vehicleById.get(id)!), season, connectionPowerKw)
      ]))
    : null

  for (let h = 0; h < HOURS_PER_DAY; h++) {
    let pvAfterHousehold = Math.max(0, pvGen[h]! - householdLoad)
    const batteryAvailableForCar = Math.max(0, batterySoc - batteryReserveKwh)

    for (const group of groups) {
      // Geteilter Anschluss: pro Stunde lädt nur ein Fahrzeug der Gruppe (sequenziell).
      let vehicle: Vehicle | undefined
      let carDraw = 0

      if (mode === 'naive') {
        const schedule = naiveSchedules!.get(group.hostId)!
        vehicle = group.memberIds
          .map(id => vehicleById.get(id)!)
          .find(v => schedule.drawByVehicle.get(v.id)![h]! > 0)
        if (vehicle) carDraw = schedule.drawByVehicle.get(vehicle.id)![h]!
      } else if (mode === 'smart') {
        // Smart nutzt sowohl den aktuellen PV-Überschuss als auch die Batterie (oberhalb der
        // Haushaltsreserve) - eine "smarte" Steuerung würde beides kombinieren, statt bei
        // fehlendem Sonnenüberschuss sofort ins Netz zu wechseln.
        vehicle = group.memberIds
          .map(id => vehicleById.get(id)!)
          .find(v => homeMasks.get(v.id)![h] && remaining.get(v.id)! > 0.0001)
        if (vehicle) {
          const need = remaining.get(vehicle.id)!
          carDraw = Math.min(effectivePowerKw(vehicle, connectionPowerKw), need, pvAfterHousehold + batteryAvailableForCar)
        }
      } else {
        vehicle = group.memberIds
          .map(id => vehicleById.get(id)!)
          .find(v => homeMasks.get(v.id)![h])
        if (vehicle) carDraw = Math.min(effectivePowerKw(vehicle, connectionPowerKw), pvAfterHousehold + batteryAvailableForCar)
      }

      if (!vehicle || carDraw <= 0) continue

      const pvToCar = Math.min(pvAfterHousehold, carDraw)
      pvAfterHousehold -= pvToCar

      const stillNeeded = carDraw - pvToCar
      const batteryToCar = Math.min(stillNeeded, batteryAvailableForCar)
      batterySoc -= batteryToCar

      pvDirectKwh += pvToCar
      batteryKwh += batteryToCar
      gridKwh += stillNeeded - batteryToCar
      pvToCarByHour[h]! += pvToCar
      batteryToCarByHour[h]! += batteryToCar
      carTotalByHour[h]! += carDraw
      if (mode === 'smart') remaining.set(vehicle.id, remaining.get(vehicle.id)! - carDraw)
    }

    batterySoc += Math.min(pvAfterHousehold, batteryCapacityKwh - batterySoc)
  }

  if (mode !== 'potential') {
    const unmetPools = mode === 'naive'
      ? [...naiveSchedules!.values()].flatMap(s => [...s.unmetByVehicle.values()])
      : [...remaining.values()]

    for (const need of unmetPools) {
      if (need > 0.0001) gridKwh += need
    }
  }

  return { gridKwh, pvDirectKwh, batteryKwh, pvToCarByHour, batteryToCarByHour, carTotalByHour }
}

// Zuhause-Stunden über alle Fahrzeuge hinweg (mind. eines zuhause) - für die Hintergrund-Bänder
// im PV-Nutzungsdiagramm, unabhängig von der pro Gruppe geteilten Anschlusslogik.
function anyoneHomeHours(state: PlannerState): boolean[] {
  const homeMasks = state.vehicles.map(v => hourlyHomeMask(v.absenceSlots))
  return Array.from({ length: HOURS_PER_DAY }, (_, h) => homeMasks.some(mask => mask[h]))
}

function computeHourlySeries(state: PlannerState, season: SeasonKey, naive: DaySimulationResult, smart: DaySimulationResult): HourlySeriesResult {
  return {
    pvGenKwh: pvGenerationCurve(state.pv, season),
    householdLoadKwh: householdHourlyLoadKwh(state),
    homeHours: anyoneHomeHours(state),
    naiveCarKwh: naive.pvToCarByHour,
    naiveCarTotalKwh: naive.carTotalByHour,
    smartCarKwh: smart.pvToCarByHour,
    smartBatteryByHour: smart.batteryToCarByHour
  }
}

function computeSeasonComparison(state: PlannerState, season: SeasonKey, connectionPowerKw: number): SeasonComparisonResult {
  const naive = runDaySimulation(state, season, 'naive', connectionPowerKw)
  const smart = runDaySimulation(state, season, 'smart', connectionPowerKw)
  const potential = runDaySimulation(state, season, 'potential', connectionPowerKw)
  const dailyEnergyKwh = state.vehicles.reduce((sum, v) => sum + vehicleDailyEnergyKwh(v, season), 0)

  return {
    season,
    dailyEnergyKwh,
    sunHours: countSunHours(state, season),
    naiveGridKwh: naive.gridKwh,
    naivePvDirectKwh: naive.pvDirectKwh,
    naiveBatteryKwh: naive.batteryKwh,
    smartGridKwh: smart.gridKwh,
    smartPvDirectKwh: smart.pvDirectKwh,
    smartBatteryKwh: smart.batteryKwh,
    // Auf den tatsächlichen Tagesbedarf gedeckelt: mehr als 100 % des Bedarfs kann PV per
    // Definition nicht decken, auch wenn rein rechnerisch mehr Überschuss verfügbar wäre.
    potentialPvKwh: Math.min(potential.pvDirectKwh + potential.batteryKwh, dailyEnergyKwh),
    hourly: computeHourlySeries(state, season, naive, smart)
  }
}

function computeConnectionClassComparison(state: PlannerState, connectionPowerKw: number): ConnectionClassComparison {
  const seasons = SEASONS.map(season => computeSeasonComparison(state, season, connectionPowerKw))

  const totalNaivePv = seasons.reduce((sum, r) => sum + r.naivePvDirectKwh + r.naiveBatteryKwh, 0)
  const totalNaiveGrid = seasons.reduce((sum, r) => sum + r.naiveGridKwh, 0)
  const totalSmartPv = seasons.reduce((sum, r) => sum + r.smartPvDirectKwh + r.smartBatteryKwh, 0)
  const totalSmartGrid = seasons.reduce((sum, r) => sum + r.smartGridKwh, 0)
  const totalPotentialPv = seasons.reduce((sum, r) => sum + r.potentialPvKwh, 0)
  const totalDailyEnergy = seasons.reduce((sum, r) => sum + r.dailyEnergyKwh, 0)

  const naiveTotal = totalNaivePv + totalNaiveGrid
  const smartTotal = totalSmartPv + totalSmartGrid

  // Pro Saison auf >= 0 gedeckelt: Smart kann durch die Simulation nie schlechter als Naiv
  // sein, winzige negative Differenzen sind Rundungsrauschen - ungedeckelt könnte daraus sonst
  // eine leicht negative Summe (Anzeige "-0 €") werden.
  const annualGridSavingKwh = seasons.reduce(
    (sum, r) => sum + Math.max(0, r.naiveGridKwh - r.smartGridKwh) * DAYS_PER_SEASON,
    0
  )

  return {
    connectionKw: connectionPowerKw,
    seasons,
    naiveSelfConsumptionShare: naiveTotal > 0 ? totalNaivePv / naiveTotal : 0,
    smartSelfConsumptionShare: smartTotal > 0 ? totalSmartPv / smartTotal : 0,
    potentialSelfConsumptionShare: totalDailyEnergy > 0 ? totalPotentialPv / totalDailyEnergy : 0,
    annualGridSavingKwh,
    annualCostSavingEur: annualGridSavingKwh * (state.electricityPriceCtPerKwh / 100)
  }
}

// Naiv-vs-Smart-Vergleich für jede Standard-Anschlussklasse einzeln, da die tatsächlich
// nutzbare Ladeleistung (und damit der PV-Eigenverbrauch) je nach Anschluss stark variiert.
export function computeComparisonResult(state: PlannerState): ComparisonResult {
  return {
    byConnectionClass: CONNECTION_CLASSES.map(kw => computeConnectionClassComparison(state, kw))
  }
}
