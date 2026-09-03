import type { HouseholdProfile, Orientation, SeasonKey } from '~/types/planner'

export const SEASONS: SeasonKey[] = ['summer', 'transition', 'winter']

export const SEASON_LABELS: Record<SeasonKey, string> = {
  summer: 'Sommer',
  transition: 'Frühjahr/Herbst',
  winter: 'Winter'
}

// Vereinfachung fürs MVP: 3 gleich lange Jahresdrittel statt exakter Monatsgrenzen.
export const DAYS_PER_SEASON = 365 / 3

// Mehrverbrauch ggü. Basisverbrauch durch Heizung/Kälte bzw. Klimaanlage.
export const SEASON_CONSUMPTION_FACTOR: Record<SeasonKey, number> = {
  summer: 1.075,
  transition: 1,
  winter: 1.25
}

export const CHARGING_LOSS = 0.1

// Anteil des PV-Jahresertrags, der auf die jeweilige Saison entfällt (Faustwerte Deutschland,
// abgeglichen mit realen Ertragsdaten sowie PV-Forum-Vergleichswerten). Sommer/Winter sind
// über verschiedene Anlagen hinweg recht stabil, die Übergangsmonate (v. a. März) schwanken
// je nach Jahr stark - siehe wallbox-planer-konzept.md.
export const SEASON_PV_YIELD_SHARE: Record<SeasonKey, number> = {
  summer: 0.57,
  transition: 0.34,
  winter: 0.09
}

// Tageslichtstunden je Saison, für die normierte Erzeugungskurve in der Naiv/Smart-Simulation.
export const SEASON_DAYLIGHT_HOURS: Record<SeasonKey, number> = {
  summer: 15,
  transition: 12,
  winter: 9
}

export const PV_YIELD_PER_KWP_PER_YEAR = 950

export const ORIENTATION_FACTOR: Record<Orientation, number> = {
  south: 1,
  'east-west': 0.9,
  flat: 0.85,
  other: 0.85
}

export const ORIENTATION_LABELS: Record<Orientation, string> = {
  south: 'Süd',
  'east-west': 'Ost-West',
  flat: 'Flach',
  other: 'Sonstiges'
}

// Jahresverbrauch Haushalt ohne Auto, als Basis für Grundlast/Tag.
export const HOUSEHOLD_ANNUAL_KWH: Record<Exclude<HouseholdProfile, 'custom'>, number> = {
  small: 2500,
  medium: 3500,
  large: 6000
}

export const HOUSEHOLD_PROFILE_LABELS: Record<HouseholdProfile, string> = {
  small: 'Klein (2 Pers.)',
  medium: 'Mittel (3–4 Pers.)',
  large: 'Groß (5+ Pers., Wärmepumpe)',
  custom: 'Eigener Wert'
}

// Standard-Anschlussklassen, aus denen die Empfehlung gewählt wird. Einphasige Wallboxen
// sind in der Praxis auf 16 A / 3,7 kW ausgelegt - höhere einphasige Ladeleistungen
// (z. B. 7,4 kW/32 A) gibt es nur an öffentlichen Ladesäulen.
export const CONNECTION_CLASSES = [2.3, 3.7, 11, 22] as const

export const CONNECTION_CLASS_LABELS: Record<number, string> = {
  2.3: 'Schuko (10 A / 2,3 kW)',
  3.7: '1-phasige Wallbox (16 A / 3,7 kW)',
  11: '11-kW-Wallbox (3-phasig)',
  22: '22-kW-Wallbox (3-phasig)'
}

// Ab hier gilt der Bedarf bei geteiltem Anschluss als "knapp" i.S.v. Case 6 des Konzepts.
export const BOTTLENECK_WARNING_THRESHOLD_KW = 18

export const SCHUKO_HINT = 'Dauerhaftes Laden mit mehr als 10 A an einer normalen Schuko-Steckdose ist nur zulässig, wenn Steckdose und Zuleitung von einer Elektrofachkraft geprüft und dafür freigegeben wurden. Viele mobile Ladekabel (ICCB) begrenzen deshalb automatisch auf 10 A.'

export const PARAGRAPH_14A_ANMELDEPFLICHT_KW = 4.2
export const PARAGRAPH_14A_GENEHMIGUNGSPFLICHT_KW = 11

// Nutzbarer Batteriepuffer für die "Tage ohne Laden"-Anzeige: nur der Bereich zwischen
// 10 % und 80 % SoC wird als alltagstauglich angenommen (Schonung der Batterie).
export const BUFFER_SOC_MIN = 0.1
export const BUFFER_SOC_MAX = 0.8

export const CONSUMPTION_QUICK_VALUES = [15, 18, 22, 28]
export const DAILY_DISTANCE_QUICK_VALUES = [20, 40, 80, 150]
// Herstellerangabe des Fahrzeugs (nicht die Anschlussklasse, siehe CONNECTION_CLASSES):
// 7,4 kW (32 A einphasig) ist ein reales Fahrzeug-Ladegerät, an einem privaten 1-phasigen
// Hausanschluss aber nur bis 3,7 kW/16 A nutzbar - siehe Hinweis im Formularfeld.
export const MAX_AC_POWER_QUICK_VALUES = [3.7, 7.4, 11, 22]
export const BATTERY_CAPACITY_QUICK_VALUES = [40, 60, 77, 100]
export const PV_KWP_QUICK_VALUES = [4, 6, 9, 12]
export const PV_BATTERY_QUICK_VALUES = [0, 5, 10, 15]
export const ELECTRICITY_PRICE_QUICK_VALUES = [28, 32, 36, 40]
export const CUSTOM_HOUSEHOLD_DAILY_QUICK_VALUES = [7, 10, 16, 20]
