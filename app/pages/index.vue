<script setup lang="ts">
import type { SeasonKey } from '~/types/planner'
import { SEASON_LABELS, SEASONS } from '~/utils/planner/constants'

const { state, seasonResults } = useWallboxPlanner()

const seasonTabItems = SEASONS.map(season => ({
  label: SEASON_LABELS[season],
  value: season,
  icon: season === 'summer' ? 'i-lucide-sun' : season === 'winter' ? 'i-lucide-snowflake' : 'i-lucide-leaf'
}))

const activeSeason = ref<SeasonKey>('summer')
const activeSeasonResult = computed(() => seasonResults.value.find(r => r.season === activeSeason.value)!)

const vehiclesSectionEl = useTemplateRef('vehiclesSection')

function scrollToVehicles() {
  vehiclesSectionEl.value?.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const ergebnisSectionEl = useTemplateRef('ergebnisSection')
const isErgebnisSectionVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    isErgebnisSectionVisible.value = entry?.isIntersecting ?? false
  })
  if (ergebnisSectionEl.value) observer.observe(ergebnisSectionEl.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <UContainer class="space-y-10 py-8" :class="{ 'pb-24': !isErgebnisSectionVisible }">
    <div>
      <h1 class="text-4xl font-bold text-highlighted sm:text-3xl mb-5">
        Wallbox-Planer
      </h1>
      <p class="mt-1 max-w-2xl text-muted">
        Finde heraus, welche Ladeleistung (2,3 / 3,7 / 11 / 22 kW) du wirklich brauchst – abhängig von
        Fahrverhalten, Fahrzeugen und PV-Anlage, getrennt nach Sommer, Übergangszeit und Winter.
        Zusätzlich wird geprüft, ob eine Kopplung mit der PV-Anlage (Smart Charging) sinnvoll ist.
      </p>
    </div>

    <ConnectionTypesInfo />

    <PresetPicker @select="scrollToVehicles" />

    <VehiclesSection ref="vehiclesSection" />

    <div class="grid gap-6" :class="state.pv.enabled ? 'lg:grid-cols-2' : ''">
      <PvSection />
      <HouseholdSection v-if="state.pv.enabled" />
    </div>



    <section ref="ergebnisSection" class="space-y-4">
      <USeparator />
      <h2 class="text-3xl font-semibold text-highlighted">
        Ergebnis
      </h2>
      <UTabs v-model="activeSeason" :items="seasonTabItems" variant="pill">
        <template #content="{ item }">
          <SeasonResultCard
            :result="seasonResults.find(r => r.season === item.value)!"
            class="pt-4"
          />
        </template>
      </UTabs>
    </section>

    <ComparisonSection v-if="state.pv.enabled" />

    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      leave-active-class="transition-transform duration-150 ease-in"
      enter-from-class="translate-y-full"
      leave-to-class="translate-y-full"
    >
      <SummaryBar v-if="!isErgebnisSectionVisible" :result="activeSeasonResult" />
    </Transition>
  </UContainer>
</template>
