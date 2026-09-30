export type SeasonKey = 'summer' | 'transition' | 'winter'

export type Orientation = 'south' | 'east-west' | 'flat' | 'other'

export type HouseholdProfile = 'small' | 'medium' | 'large' | 'custom'

export interface AbsenceSlot {
  id: string
  start: string // HH:MM
  end: string // HH:MM
}

export interface Vehicle {
  id: string
  name: string
  consumptionKwh100km: number
  dailyDistanceKm: number
  hasOwnConnection: boolean
  maxAcPowerKw: number
  batteryCapacityKwh: number
  absenceSlots: AbsenceSlot[]
}

export interface PvConfig {
  enabled: boolean
  kwp: number
  orientation: Orientation
  batteryKwh: number
}

export interface HouseholdConfig {
  profile: HouseholdProfile
  customDailyKwh: number
}

export interface PlannerState {
  vehicles: Vehicle[]
  pv: PvConfig
  household: HouseholdConfig
  electricityPriceCtPerKwh: number
}

export interface VehicleSeasonResult {
  vehicleId: string
  dailyEnergyKwh: number
  windowHours: number
  requiredPowerKw: number
  cappedPowerKw: number
  isPowerConstrained: boolean
}

export interface SeasonResult {
  season: SeasonKey
  totalDailyEnergyKwh: number
  requiredPowerKw: number
  recommendedClassKw: number
  isBottleneck: boolean
  pvCoverage: number
  vehicleResults: VehicleSeasonResult[]
  sharedConnectionHint: string | null
}

export interface HourlySeriesResult {
  pvGenKwh: number[]
  householdLoadKwh: number
  homeHours: boolean[]
  naiveCarKwh: number[]
  naiveCarTotalKwh: number[]
  smartCarKwh: number[]
  smartBatteryByHour: number[]
}

export interface SeasonComparisonResult {
  season: SeasonKey
  dailyEnergyKwh: number
  sunHours: number
  naiveGridKwh: number
  naivePvDirectKwh: number
  naiveBatteryKwh: number
  smartGridKwh: number
  smartPvDirectKwh: number
  smartBatteryKwh: number
  potentialPvKwh: number
  hourly: HourlySeriesResult
}

export interface ConnectionClassComparison {
  connectionKw: number
  seasons: SeasonComparisonResult[]
  naiveSelfConsumptionShare: number
  smartSelfConsumptionShare: number
  potentialSelfConsumptionShare: number
  annualGridSavingKwh: number
  annualCostSavingEur: number
}

export interface ComparisonResult {
  byConnectionClass: ConnectionClassComparison[]
}
