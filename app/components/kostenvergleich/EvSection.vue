<script setup lang="ts">
import { HOME_PRICE_QUICK_VALUES, PUBLIC_PRICE_QUICK_VALUES, THG_PREMIUM_QUICK_VALUES } from '~/utils/kostenvergleich/constants'

const { state } = useKostenvergleich()

const homeSharePercent = computed(() => Math.round(state.value.ev.homeShare * 100))
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        {{ state.ev.vehicleName }}
      </h2>
    </template>

    <div class="space-y-5">
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

      <UFormField label="Strompreis zuhause (ct/kWh)">
        <QuickSelectField
          v-model="state.ev.homePriceCtKwh"
          :options="HOME_PRICE_QUICK_VALUES"
          unit="ct/kWh"
          :min="10"
          :max="80"
          :step="1"
        />
      </UFormField>

      <UFormField label="Strompreis unterwegs (ct/kWh)" description="Öffentliche Ladesäule/Schnelllader.">
        <QuickSelectField
          v-model="state.ev.publicPriceCtKwh"
          :options="PUBLIC_PRICE_QUICK_VALUES"
          unit="ct/kWh"
          :min="10"
          :max="100"
          :step="1"
        />
      </UFormField>

      <UFormField :label="`Anteil zuhause geladen: ${homeSharePercent} %`">
        <USlider v-model="state.ev.homeShare" :min="0" :max="1" :step="0.05" />
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
  </UCard>
</template>
