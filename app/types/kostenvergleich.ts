export interface EvInput {
  vehicleName: string
  purchasePriceEur: number
  consumptionKwh100km: number
  homePriceCtKwh: number
  publicPriceCtKwh: number
  // Anteil der geladenen kWh, der zuhause (günstiger) statt unterwegs geladen wird.
  homeShare: number
  annualTaxEur: number
  thgPremiumEur: number
}

export interface CombustionInput {
  vehicleName: string
  purchasePriceEur: number
  consumptionL100km: number
  fuelPriceEurL: number
  annualTaxEur: number
}

export interface KostenvergleichState {
  annualDistanceKm: number
  ev: EvInput
  combustion: CombustionInput
}

export interface AnnualCostBreakdown {
  energyCostEur: number
  taxEur: number
  thgCreditEur: number
  totalEur: number
}

export interface YearlyCostPoint {
  year: number
  evCumulativeEur: number
  combustionCumulativeEur: number
}

export interface KostenvergleichResult {
  ev: AnnualCostBreakdown
  combustion: AnnualCostBreakdown
  annualSavingEur: number
  // Jahr (auch gebrochen), ab dem die kumulierten E-Auto-Kosten (inkl. Kaufpreis) die des
  // Verbrenners unterschreiten. null = kein Break-even (E-Auto holt Mehrpreis nie auf).
  breakEvenYear: number | null
  cumulative: YearlyCostPoint[]
}
