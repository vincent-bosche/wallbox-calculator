import type { AbsenceSlot, PlannerState, Vehicle } from '~/types/planner'

export function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function createAbsenceSlot(start = '08:00', end = '17:00'): AbsenceSlot {
  return { id: createId(), start, end }
}

export function createVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: createId(),
    name: 'Fahrzeug 1',
    consumptionKwh100km: 18,
    dailyDistanceKm: 40,
    hasOwnConnection: true,
    maxAcPowerKw: 11,
    batteryCapacityKwh: 60,
    absenceSlots: [createAbsenceSlot()],
    ...overrides
  }
}

export function createDefaultState(): PlannerState {
  return {
    vehicles: [createVehicle()],
    pv: {
      enabled: false,
      kwp: 6,
      orientation: 'south',
      batteryKwh: 0
    },
    household: {
      profile: 'medium',
      customDailyKwh: 10
    },
    electricityPriceCtPerKwh: 32
  }
}
