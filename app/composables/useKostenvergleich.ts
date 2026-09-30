import type { KostenvergleichState } from '~/types/kostenvergleich'
import { computeKostenvergleichResult } from '~/utils/kostenvergleich/calculations'
import { createDefaultState } from '~/utils/kostenvergleich/factory'
import { VEHICLE_PAIR_PRESETS, type VehiclePairPreset } from '~/utils/kostenvergleich/presets'

export function useKostenvergleich() {
  const state = useState<KostenvergleichState>('kostenvergleich-state', () => createDefaultState())
  const selectedPairId = useState<string | undefined>('kostenvergleich-selected-pair-id', () => undefined)

  function selectVehiclePair(pair: VehiclePairPreset) {
    state.value.ev.vehicleName = pair.ev.model
    state.value.ev.consumptionKwh100km = pair.ev.consumptionKwh100km
    state.value.ev.purchasePriceEur = pair.ev.purchasePriceEur
    state.value.ev.powerPs = pair.ev.power
    state.value.ev.batteryCapacity = 'base'
    state.value.combustion.vehicleName = pair.combustion.model
    state.value.combustion.consumptionL100km = pair.combustion.consumptionL100km
    state.value.combustion.purchasePriceEur = pair.combustion.purchasePriceEur
    state.value.combustion.powerPs = pair.combustion.power
    state.value.combustion.annualTaxEur = pair.combustion.annualTaxEur
    selectedPairId.value = pair.id
  }

  function selectEvBatteryCapacity(capacity: 'base' | 'large') {
    const pair = VEHICLE_PAIR_PRESETS.find(p => p.id === selectedPairId.value)
    if (!pair) return
    const source = capacity === 'large' && pair.ev.largeBattery ? pair.ev.largeBattery : pair.ev
    state.value.ev.consumptionKwh100km = source.consumptionKwh100km
    state.value.ev.purchasePriceEur = source.purchasePriceEur
    state.value.ev.batteryCapacity = capacity
  }

  const result = computed(() => computeKostenvergleichResult(state.value))

  return {
    state,
    selectedPairId,
    selectVehiclePair,
    selectEvBatteryCapacity,
    result
  }
}
