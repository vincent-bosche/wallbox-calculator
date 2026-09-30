import type { HouseholdProfile, Orientation, PlannerState } from '~/types/planner'

const HOUSEHOLD_PROFILES: HouseholdProfile[] = ['small', 'medium', 'large', 'custom']
const ORIENTATIONS: Orientation[] = ['south', 'east-west', 'flat', 'other']

// Grenzen entsprechen den min/max der jeweiligen Eingabefelder (siehe VehicleCard.vue/PvSection.vue/
// HouseholdSection.vue) - Werte aus einem geteilten Link, die außerhalb liegen, sind kein gültiger Zustand.
const MAX_VEHICLES = 10
const MAX_ABSENCE_SLOTS = 20
const MAX_NAME_LENGTH = 60
// Format der von createId() erzeugten IDs (siehe factory.ts): Math.random().toString(36).slice(2, 10).
const ID_PATTERN = /^[a-z0-9]{1,20}$/
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export function serializePlannerState(state: PlannerState): string {
  return JSON.stringify(state)
}

export function deserializePlannerState(raw: string): PlannerState | null {
  try {
    const parsed = JSON.parse(raw)
    return isPlannerState(parsed) ? parsed : null
  } catch {
    return null
  }
}

function isFiniteNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
}

function isPlannerState(value: unknown): value is PlannerState {
  if (!value || typeof value !== 'object') return false
  const state = value as Record<string, unknown>
  return (
    Array.isArray(state.vehicles)
    && state.vehicles.length > 0
    && state.vehicles.length <= MAX_VEHICLES
    && state.vehicles.every(isVehicle)
    && isPvConfig(state.pv)
    && isHouseholdConfig(state.household)
    && isFiniteNumberInRange(state.electricityPriceCtPerKwh, 0, 200)
  )
}

function isVehicle(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string'
    && ID_PATTERN.test(v.id)
    && typeof v.name === 'string'
    && v.name.length > 0
    && v.name.length <= MAX_NAME_LENGTH
    && isFiniteNumberInRange(v.consumptionKwh100km, 0, 100)
    && isFiniteNumberInRange(v.dailyDistanceKm, 0, 1000)
    && typeof v.hasOwnConnection === 'boolean'
    && isFiniteNumberInRange(v.maxAcPowerKw, 0, 100)
    && isFiniteNumberInRange(v.batteryCapacityKwh, 0, 300)
    && Array.isArray(v.absenceSlots)
    && v.absenceSlots.length <= MAX_ABSENCE_SLOTS
    && v.absenceSlots.every(isAbsenceSlot)
  )
}

function isAbsenceSlot(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const slot = value as Record<string, unknown>
  return (
    typeof slot.id === 'string'
    && ID_PATTERN.test(slot.id)
    && typeof slot.start === 'string'
    && TIME_PATTERN.test(slot.start)
    && typeof slot.end === 'string'
    && TIME_PATTERN.test(slot.end)
  )
}

function isPvConfig(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const pv = value as Record<string, unknown>
  return (
    typeof pv.enabled === 'boolean'
    && isFiniteNumberInRange(pv.kwp, 0, 100)
    && ORIENTATIONS.includes(pv.orientation as Orientation)
    && isFiniteNumberInRange(pv.batteryKwh, 0, 200)
  )
}

function isHouseholdConfig(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const household = value as Record<string, unknown>
  return (
    HOUSEHOLD_PROFILES.includes(household.profile as HouseholdProfile)
    && isFiniteNumberInRange(household.customDailyKwh, 0, 200)
  )
}
