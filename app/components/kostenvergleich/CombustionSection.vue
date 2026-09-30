<script setup lang="ts">
import { COMBUSTION_TAX_QUICK_VALUES } from '~/utils/kostenvergleich/constants'
import { VEHICLE_PAIR_PRESETS } from '~/utils/kostenvergleich/presets'

const { state, selectedPairId } = useKostenvergleich()

const selectedCombustionPreset = computed(() => VEHICLE_PAIR_PRESETS.find(p => p.id === selectedPairId.value)?.combustion)

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
          <UIcon name="i-lucide-fuel" class="size-5 shrink-0" />
          {{ state.combustion.vehicleName }}
        </h2>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>{{ eur.format(state.combustion.purchasePriceEur) }}</span>
          <span>{{ state.combustion.consumptionL100km }} l/100 km</span>
          <span>{{ eur.format(state.combustion.annualTaxEur) }}/Jahr Steuer</span>
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
          <UFormField label="Kaufpreis / UVP (€)">
            <UInputNumber
              v-model="state.combustion.purchasePriceEur"
              :min="0"
              :max="200000"
              :step="500"
              locale="de-DE"
              size="sm"
              class="w-40"
            />
          </UFormField>

          <UFormField label="Verbrauch (l/100 km)">
            <UInputNumber
              v-model="state.combustion.consumptionL100km"
              :min="2"
              :max="20"
              :step="0.1"
              locale="de-DE"
              size="sm"
              class="w-40"
            />
            <p v-if="selectedCombustionPreset" class="mt-1 text-xs text-muted">
              Testverbrauch:
              <a
                v-if="selectedCombustionPreset.consumptionUrl"
                :href="selectedCombustionPreset.consumptionUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:text-highlighted"
              >{{ selectedCombustionPreset.consumptionL100km }} l/100 km</a>
              <span v-else>{{ selectedCombustionPreset.consumptionL100km }} l/100 km</span>
              · WLTP: {{ selectedCombustionPreset.consumptionWltpL100km }} l/100 km
            </p>
          </UFormField>

          <UFormField label="KFZ-Steuer (€/Jahr)">
            <QuickSelectField
              v-model="state.combustion.annualTaxEur"
              :options="COMBUSTION_TAX_QUICK_VALUES"
              unit="€"
              :min="0"
              :max="600"
              :step="10"
            />
          </UFormField>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>
