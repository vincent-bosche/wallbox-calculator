<script setup lang="ts">
import { THG_PREMIUM_QUICK_VALUES } from '~/utils/kostenvergleich/constants'
import { VEHICLE_PAIR_PRESETS } from '~/utils/kostenvergleich/presets'

const { state, selectedPairId, selectEvBatteryCapacity } = useKostenvergleich()

const selectedEvPreset = computed(() => VEHICLE_PAIR_PRESETS.find(p => p.id === selectedPairId.value)?.ev)

const activeEvVariant = computed(() => {
  if (state.value.ev.batteryCapacity === 'large' && selectedEvPreset.value?.largeBattery) {
    return selectedEvPreset.value.largeBattery
  }
  return selectedEvPreset.value
})

const batteryCapacityOptions = computed(() => {
  const preset = selectedEvPreset.value
  if (!preset?.largeBattery) return []
  return [
    { label: preset.variant || 'Standard', value: 'base' as const },
    { label: preset.largeBattery.variant, value: 'large' as const }
  ]
})

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
          <UIcon name="i-lucide-zap" class="size-5 shrink-0" />
          {{ state.ev.vehicleName }}
        </h2>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>{{ eur.format(state.ev.purchasePriceEur) }}</span>
          <span>{{ state.ev.consumptionKwh100km }} kWh/100 km</span>
          <span>{{ eur.format(state.ev.annualTaxEur) }}/Jahr Steuer</span>
        </div>
      </div>
    </template>

    <UCollapsible>
      <UButton
        label="Werte anpassen"
        icon="i-lucide-settings-2"
        trailing-icon="i-lucide-chevron-down"
        color="neutral"
        variant="ghost"
        size="sm"
        block
      />

      <template #content>
        <div class="space-y-5 pt-4">
          <UFormField v-if="batteryCapacityOptions.length" label="Batteriekapazität">
            <URadioGroup
              :model-value="state.ev.batteryCapacity"
              orientation="horizontal"
              :items="batteryCapacityOptions"
              @update:model-value="selectEvBatteryCapacity"
            />
          </UFormField>

          <UFormField label="Kaufpreis / UVP (€)">
            <UInputNumber
              v-model="state.ev.purchasePriceEur"
              :min="0"
              :max="200000"
              :step="500"
              locale="de-DE"
              size="sm"
              class="w-40"
            />
          </UFormField>

          <UFormField label="Verbrauch (kWh/100 km)">
            <UInputNumber
              v-model="state.ev.consumptionKwh100km"
              :min="8"
              :max="35"
              :step="0.5"
              locale="de-DE"
              size="sm"
              class="w-40"
            />
            <p v-if="activeEvVariant" class="mt-1 text-xs text-muted">
              Testverbrauch:
              <a
                v-if="activeEvVariant.consumptionUrl"
                :href="activeEvVariant.consumptionUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:text-highlighted"
              >{{ activeEvVariant.consumptionKwh100km }} kWh/100 km</a>
              <span v-else>{{ activeEvVariant.consumptionKwh100km }} kWh/100 km</span>
              · WLTP: {{ activeEvVariant.consumptionWltpKwh100km }} kWh/100 km
            </p>
          </UFormField>

          <UFormField label="KFZ-Steuer (€/Jahr)" description="E-Autos aktuell i. d. R. steuerbefreit.">
            <UInputNumber
              v-model="state.ev.annualTaxEur"
              :min="0"
              :max="500"
              :step="10"
              locale="de-DE"
              size="sm"
              class="w-40"
            />
          </UFormField>

          <UFormField label="THG-Prämie (€/Jahr)" description="Erlös aus dem Verkauf der THG-Quote.">
            <QuickSelectField
              v-model="state.ev.thgPremiumEur"
              :options="THG_PREMIUM_QUICK_VALUES"
              unit="€"
              :min="0"
              :max="1000"
              :step="10"
            />
          </UFormField>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>
