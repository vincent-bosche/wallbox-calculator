<script setup lang="ts">
import { COMBUSTION_TAX_QUICK_VALUES, FUEL_PRICE_QUICK_VALUES } from '~/utils/kostenvergleich/constants'

const { state } = useKostenvergleich()
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        {{ state.combustion.vehicleName }}
      </h2>
    </template>

    <div class="space-y-5">
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
      </UFormField>

      <UFormField label="Kraftstoffpreis (€/l)">
        <QuickSelectField
          v-model="state.combustion.fuelPriceEurL"
          :options="FUEL_PRICE_QUICK_VALUES"
          unit="€"
          :min="1"
          :max="3"
          :step="0.01"
        />
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
  </UCard>
</template>
