<script setup lang="ts">
import type { HouseholdProfile } from '~/types/planner'
import { CUSTOM_HOUSEHOLD_DAILY_QUICK_VALUES, HOUSEHOLD_ANNUAL_KWH, HOUSEHOLD_PROFILE_LABELS } from '~/utils/planner/constants'

const { state } = useWallboxPlanner()

const profileItems = (Object.entries(HOUSEHOLD_PROFILE_LABELS) as [HouseholdProfile, string][])
  .map(([value, label]) => ({
    label: value === 'custom'
      ? label
      : `${label} – ${HOUSEHOLD_ANNUAL_KWH[value].toLocaleString('de-DE')} kWh/Jahr`,
    value
  }))
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        Haushalt
      </h2>
    </template>

    <div class="space-y-5">
      <UFormField label="Grundlast-Profil">
        <URadioGroup v-model="state.household.profile" :items="profileItems" />
      </UFormField>

      <UFormField v-if="state.household.profile === 'custom'" label="Täglicher Grundlast-Verbrauch (kWh/Tag)">
        <QuickSelectField
          v-model="state.household.customDailyKwh"
          :options="CUSTOM_HOUSEHOLD_DAILY_QUICK_VALUES"
          unit="kWh/Tag"
          :min="1"
          :max="60"
          :step="0.5"
        />
      </UFormField>
    </div>
  </UCard>
</template>
