import type { AnnualCostBreakdown, KostenvergleichResult, KostenvergleichState } from '~/types/kostenvergleich'
import { COMPARISON_YEARS } from './constants'

export function computeEvAnnualCost(state: KostenvergleichState): AnnualCostBreakdown {
  const totalKwh = state.annualDistanceKm / 100 * state.ev.consumptionKwh100km
  const homeKwh = totalKwh * state.ev.homeShare
  const publicKwh = totalKwh * (1 - state.ev.homeShare)
  const energyCostEur = (homeKwh * state.ev.homePriceCtKwh + publicKwh * state.ev.publicPriceCtKwh) / 100

  return {
    energyCostEur,
    taxEur: state.ev.annualTaxEur,
    thgCreditEur: state.ev.thgPremiumEur,
    totalEur: energyCostEur + state.ev.annualTaxEur - state.ev.thgPremiumEur
  }
}

export function computeCombustionAnnualCost(state: KostenvergleichState): AnnualCostBreakdown {
  const liters = state.annualDistanceKm / 100 * state.combustion.consumptionL100km
  const energyCostEur = liters * state.combustion.fuelPriceEurL

  return {
    energyCostEur,
    taxEur: state.combustion.annualTaxEur,
    thgCreditEur: 0,
    totalEur: energyCostEur + state.combustion.annualTaxEur
  }
}

// Jahr (ggf. gebrochen), ab dem die kumulierten E-Auto-Kosten (Kaufpreis + laufende Kosten × Jahre)
// die des Verbrenners dauerhaft unterschreiten. Beide Kostenverläufe sind linear in der Zeit, daher
// reicht der Schnittpunkt der beiden Geraden. null = kein Break-even (E-Auto ist nie günstiger).
export function computeBreakEvenYear(
  evPurchaseEur: number,
  evAnnualEur: number,
  combustionPurchaseEur: number,
  combustionAnnualEur: number
): number | null {
  const upfrontDiff = evPurchaseEur - combustionPurchaseEur
  const annualSaving = combustionAnnualEur - evAnnualEur

  if (upfrontDiff <= 0 && annualSaving >= 0) return 0
  if (annualSaving <= 0) return null
  return Math.max(0, upfrontDiff / annualSaving)
}

export function computeKostenvergleichResult(state: KostenvergleichState): KostenvergleichResult {
  const ev = computeEvAnnualCost(state)
  const combustion = computeCombustionAnnualCost(state)

  return {
    ev,
    combustion,
    annualSavingEur: combustion.totalEur - ev.totalEur,
    breakEvenYear: computeBreakEvenYear(
      state.ev.purchasePriceEur,
      ev.totalEur,
      state.combustion.purchasePriceEur,
      combustion.totalEur
    ),
    cumulative: [0, ...COMPARISON_YEARS].map(year => ({
      year,
      evCumulativeEur: state.ev.purchasePriceEur + ev.totalEur * year,
      combustionCumulativeEur: state.combustion.purchasePriceEur + combustion.totalEur * year
    }))
  }
}
