<script setup lang="ts">
import { SEASON_LABELS, SEASONS } from '~/utils/planner/constants'

const { state, seasonResults } = useWallboxPlanner()

const seasonTabItems = SEASONS.map(season => ({
  label: SEASON_LABELS[season],
  value: season,
  icon: season === 'summer' ? 'i-lucide-sun' : season === 'winter' ? 'i-lucide-snowflake' : 'i-lucide-leaf'
}))
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <div>
      <h1 class="text-2xl font-bold text-highlighted sm:text-3xl">
        Wallbox-Planer
      </h1>
      <p class="mt-1 max-w-2xl text-muted">
        Finde heraus, welche Ladeleistung (2,3 / 11 / 22 kW) du wirklich brauchst – abhängig von
        Fahrverhalten, Fahrzeugen und PV-Anlage, getrennt nach Sommer, Übergangszeit und Winter.
      </p>
    </div>

    <PresetPicker />

    <div class="grid gap-6" :class="state.pv.enabled ? 'lg:grid-cols-2' : ''">
      <PvSection />
      <HouseholdSection v-if="state.pv.enabled" />
    </div>

    <VehiclesSection />

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-highlighted">
        Ergebnis
      </h2>
      <UTabs :items="seasonTabItems" default-value="summer" variant="pill">
        <template #content="{ item }">
          <SeasonResultCard
            :result="seasonResults.find(r => r.season === item.value)!"
            class="pt-4"
          />
        </template>
      </UTabs>
    </section>

    <ComparisonSection v-if="state.pv.enabled" />
  </UContainer>
</template>
