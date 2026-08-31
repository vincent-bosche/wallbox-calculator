import type { SeasonComparisonResult } from '~/types/planner'

export interface BottleneckDiagnosis {
  key: 'covered' | 'pv' | 'timing' | 'power' | 'battery'
  label: string
  detail: string
}

// Ab welchem Anteil ungedeckten Tagesbedarfs (smart) wird überhaupt nach einem
// dominanten Blocker gesucht - darunter gilt PV als "im Wesentlichen ausreichend".
const SHORTFALL_THRESHOLD_SHARE = 0.1

// Kurzdiagnose, WARUM der PV-Überschuss (smart-Modus) den Tagesbedarf nicht deckt -
// in Prioritätsreihenfolge des jeweils dominanten Faktors: zu wenig Überschuss insgesamt
// (Anlage/Jahreszeit) vor Zeitfenster-Mismatch (Abwesenheit während der Sonnenstunden) vor
// Leistungsdeckel (Anschluss/Fahrzeug) vor fehlendem Pufferspeicher.
export function diagnoseBottleneck(s: SeasonComparisonResult, hasBattery: boolean): BottleneckDiagnosis {
  const { pvGenKwh, householdLoadKwh, homeHours } = s.hourly

  const totalSurplusKwh = pvGenKwh.reduce((sum, gen) => sum + Math.max(0, gen - householdLoadKwh), 0)
  const surplusDuringHomeKwh = pvGenKwh.reduce(
    (sum, gen, h) => sum + (homeHours[h] ? Math.max(0, gen - householdLoadKwh) : 0),
    0
  )
  const coveredBySmart = s.smartPvDirectKwh + s.smartBatteryKwh
  const shortfallKwh = s.dailyEnergyKwh - coveredBySmart

  if (s.dailyEnergyKwh <= 0 || shortfallKwh <= s.dailyEnergyKwh * SHORTFALL_THRESHOLD_SHARE) {
    return {
      key: 'covered',
      label: 'PV deckt den Bedarf weitgehend',
      detail: 'Der Netzbezug liegt (smart) unter 10 % des Tagesbedarfs.'
    }
  }

  if (totalSurplusKwh < s.dailyEnergyKwh) {
    return {
      key: 'pv',
      label: 'PV-Ertrag zu niedrig',
      detail: `Selbst bei unbegrenzter Anwesenheit und Ladeleistung liefert die PV-Anlage in dieser Saison nur ${totalSurplusKwh.toFixed(1)} kWh Überschuss - weniger als der Tagesbedarf von ${s.dailyEnergyKwh.toFixed(1)} kWh.`
    }
  }

  const missedToAbsenceKwh = totalSurplusKwh - surplusDuringHomeKwh
  if (missedToAbsenceKwh > shortfallKwh * 0.5) {
    return {
      key: 'timing',
      label: 'Zeitfenster passt nicht zur Sonne',
      detail: `${missedToAbsenceKwh.toFixed(1)} kWh PV-Überschuss entstehen, während das Fahrzeug nicht zuhause ist, und verpuffen ungenutzt.`
    }
  }

  if (coveredBySmart < surplusDuringHomeKwh - 0.05) {
    return {
      key: 'power',
      label: 'Ladeleistung/Anschluss zu niedrig',
      detail: `${(surplusDuringHomeKwh - coveredBySmart).toFixed(1)} kWh Überschuss stehen während der Zuhause-Zeit bereit, können aber mit der gewählten Anschluss-/Fahrzeugleistung nicht abgenommen werden.`
    }
  }

  if (!hasBattery) {
    return {
      key: 'battery',
      label: 'Kein Pufferspeicher',
      detail: 'Zeitlich und leistungsmäßig würde der Überschuss reichen, entsteht aber teils bevor das Fahrzeug lädt - ein Hausakku könnte ihn zwischenspeichern.'
    }
  }

  return {
    key: 'battery',
    label: 'Restlücke',
    detail: 'Verbleibende Lücke lässt sich keinem einzelnen Faktor eindeutig zuordnen - vermutlich eine Kombination aus mehreren knappen Ressourcen.'
  }
}
