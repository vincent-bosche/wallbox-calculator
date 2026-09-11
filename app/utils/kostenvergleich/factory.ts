import type { KostenvergleichState } from '~/types/kostenvergleich'

export function createDefaultState(): KostenvergleichState {
  return {
    annualDistanceKm: 15000,
    ev: {
      vehicleName: 'VW ID.3',
      purchasePriceEur: 33995,
      consumptionKwh100km: 18,
      homePriceCtKwh: 28,
      publicPriceCtKwh: 49,
      homeShare: 0.8,
      annualTaxEur: 0,
      thgPremiumEur: 300
    },
    combustion: {
      vehicleName: 'VW Golf',
      purchasePriceEur: 32080,
      consumptionL100km: 6.2,
      fuelPriceEurL: 2.2,
      annualTaxEur: 120
    }
  }
}
