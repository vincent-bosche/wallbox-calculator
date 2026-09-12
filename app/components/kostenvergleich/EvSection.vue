<script setup lang="ts">
import { THG_PREMIUM_QUICK_VALUES } from '~/utils/kostenvergleich/constants'

const { state } = useKostenvergleich()

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 class="text-lg font-semibold text-highlighted">
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
