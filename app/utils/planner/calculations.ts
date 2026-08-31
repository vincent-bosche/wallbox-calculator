import type { HouseholdConfig, PlannerState, PvConfig, SeasonKey, SeasonResult, Vehicle, VehicleSeasonResult } from '~/types/planner'
import {
  BOTTLENECK_WARNING_THRESHOLD_KW,
  BUFFER_SOC_MAX,
  BUFFER_SOC_MIN,
  CHARGING_LOSS,
  CONNECTION_CLASSES,
  DAYS_PER_SEASON,
  HOUSEHOLD_ANNUAL_KWH,
  ORIENTATION_FACTOR,
  PARAGRAPH_14A_ANMELDEPFLICHT_KW,
  PARAGRAPH_14A_GENEHMIGUNGSPFLICHT_KW,
  PV_YIELD_PER_KWP_PER_YEAR,
  SEASON_CONSUMPTION_FACTOR,
  SEASON_PV_YIELD_SHARE,
  SEASONS
} from './constants'
import { groupHomeWindowHours } from './time'

interface ConnectionGroup {
  hostId: string
  memberIds: string[]
}

// MVP-Vereinfachung: Fahrzeuge ohne eigenen Anschluss teilen sich immer den Anschluss
// des ersten Fahrzeugs mit eigenem Anschluss (Zielgruppe: "2 Autos, 1 Wallbox").
export function buildConnectionGroups(vehicles: Vehicle[]): ConnectionGroup[] {
  const hosts = vehicles.filter(v => v.hasOwnConnection)
  if (hosts.length === 0) {
    return vehicles.map(v => ({ hostId: v.id, memberIds: [v.id] }))
  }
  const groups: ConnectionGroup[] = hosts.map(v => ({ hostId: v.id, memberIds: [v.id] }))
  vehicles
    .filter(v => !v.hasOwnConnection)
    .forEach(v => groups[0]!.memberIds.push(v.id))
  return groups
}

// Tatsächlich aus der Batterie verbrauchte Energie (ohne Ladeverluste) - Basis für die
// "Tage ohne Laden"-Anzeige, die sich auf den Batteriefüllstand bezieht, nicht auf den
// Netzbezug beim Laden.
export function vehicleDailyDrivingConsumptionKwh(vehicle: Vehicle, season: SeasonKey): number {
  return vehicle.dailyDistanceKm * vehicle.consumptionKwh100km * SEASON_CONSUMPTION_FACTOR[season] / 100
}

// Energiebedarf an der Steckdose/Wallbox (inkl. Ladeverluste) - Basis für die Auslegung
// von Ladeleistung und Anschlussklasse.
export function vehicleDailyEnergyKwh(vehicle: Vehicle, season: SeasonKey): number {
  return vehicleDailyDrivingConsumptionKwh(vehicle, season) / (1 - CHARGING_LOSS)
}

// Wie viele Tage kann mit dem nutzbaren Batteriepuffer (10-80 % SoC) gefahren werden,
// ohne nachzuladen? Reine Plausibilitäts-/Komfortanzeige, siehe Konzept Abschnitt 4.
export function vehicleBufferDays(vehicle: Vehicle, season: SeasonKey): number {
  const drivingConsumption = vehicleDailyDrivingConsumptionKwh(vehicle, season)
  if (drivingConsumption <= 0) return Infinity
  const usableBufferKwh = vehicle.batteryCapacityKwh * (BUFFER_SOC_MAX - BUFFER_SOC_MIN)
  return usableBufferKwh / drivingConsumption
}

export function householdDailyKwh(household: HouseholdConfig): number {
  if (household.profile === 'custom') return household.customDailyKwh
  return HOUSEHOLD_ANNUAL_KWH[household.profile] / 365
}

export function pvSeasonalDailyYieldKwh(pv: PvConfig, season: SeasonKey): number {
  if (!pv.enabled) return 0
  const annualYieldKwh = pv.kwp * PV_YIELD_PER_KWP_PER_YEAR * ORIENTATION_FACTOR[pv.orientation]
  return (annualYieldKwh * SEASON_PV_YIELD_SHARE[season]) / DAYS_PER_SEASON
}

export function computePvCoverage(pv: PvConfig, household: HouseholdConfig, season: SeasonKey, totalVehicleEnergyKwh: number): number {
  if (totalVehicleEnergyKwh <= 0) return 0
  const rawSurplus = Math.max(0, pvSeasonalDailyYieldKwh(pv, season) - householdDailyKwh(household))
  return Math.min(1, rawSurplus / totalVehicleEnergyKwh)
}

export function recommendedConnectionClassKw(requiredPowerKw: number): number {
  return CONNECTION_CLASSES.find(c => c >= requiredPowerKw) ?? CONNECTION_CLASSES[CONNECTION_CLASSES.length - 1]
}

function isGroupBottleneck(requiredPowerKw: number, memberCount: number): boolean {
  if (requiredPowerKw > CONNECTION_CLASSES[CONNECTION_CLASSES.length - 1]) return true
  return memberCount > 1 && requiredPowerKw > BOTTLENECK_WARNING_THRESHOLD_KW
}

function buildSharedConnectionHint(vehicles: Vehicle[], group: ConnectionGroup): string {
  const host = vehicles.find(v => v.id === group.hostId)!
  const guests = group.memberIds
    .filter(id => id !== group.hostId)
    .map(id => vehicles.find(v => v.id === id)!.name)
  const verb = guests.length > 1 ? 'haben' : 'hat'
  return `${guests.join(', ')} ${verb} keinen eigenen Anschluss – Lastteilung mit ${host.name} wird angenommen.`
}

export function getSharedConnectionHint(vehicles: Vehicle[]): string | null {
  const sharedGroup = buildConnectionGroups(vehicles).find(g => g.memberIds.length > 1)
  return sharedGroup ? buildSharedConnectionHint(vehicles, sharedGroup) : null
}

export function paragraph14aHint(recommendedClassKw: number): string | null {
  if (recommendedClassKw <= PARAGRAPH_14A_ANMELDEPFLICHT_KW) return null
  if (recommendedClassKw >= PARAGRAPH_14A_GENEHMIGUNGSPFLICHT_KW) {
    return '§14a EnWG: Ab 11 kW ist die Wallbox beim Netzbetreiber anmelde- und genehmigungspflichtig. Als Gegenleistung für die Steuerbarkeit gibt es reduzierte Netzentgelte (bis ca. 190 €/Jahr).'
  }
  return '§14a EnWG: Wallboxen über 4,2 kW sind beim Netzbetreiber anmeldepflichtig.'
}

export function computeSeasonResult(state: PlannerState, season: SeasonKey): SeasonResult {
  const groups = buildConnectionGroups(state.vehicles)

  const vehicleResults: VehicleSeasonResult[] = groups.map((group) => {
    const members = group.memberIds.map(id => state.vehicles.find(v => v.id === id)!)
    const dailyEnergyKwh = members.reduce((sum, v) => sum + vehicleDailyEnergyKwh(v, season), 0)
    const windowHours = Math.max(groupHomeWindowHours(members.map(v => v.absenceSlots)), 0.25)
    const requiredPowerKw = dailyEnergyKwh / windowHours
    const maxDeliverableKw = Math.max(...members.map(v => v.maxAcPowerKw))
    const cappedPowerKw = Math.min(requiredPowerKw, maxDeliverableKw)

    return {
      vehicleId: group.hostId,
      dailyEnergyKwh,
      windowHours,
      requiredPowerKw,
      cappedPowerKw,
      isPowerConstrained: requiredPowerKw > cappedPowerKw + 0.01
    }
  })

  const totalDailyEnergyKwh = vehicleResults.reduce((sum, r) => sum + r.dailyEnergyKwh, 0)
  const peakPowerKw = vehicleResults.reduce((max, r) => Math.max(max, r.cappedPowerKw), 0)
  const isBottleneck = groups.some((group, i) => isGroupBottleneck(vehicleResults[i]!.requiredPowerKw, group.memberIds.length))

  return {
    season,
    totalDailyEnergyKwh,
    requiredPowerKw: peakPowerKw,
    recommendedClassKw: recommendedConnectionClassKw(peakPowerKw),
    isBottleneck,
    pvCoverage: computePvCoverage(state.pv, state.household, season, totalDailyEnergyKwh),
    vehicleResults,
    sharedConnectionHint: getSharedConnectionHint(state.vehicles)
  }
}

export function computeAllSeasonResults(state: PlannerState): SeasonResult[] {
  return SEASONS.map(season => computeSeasonResult(state, season))
}
