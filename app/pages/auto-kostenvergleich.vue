<script setup lang="ts">
import { ANNUAL_DISTANCE_QUICK_VALUES } from '~/utils/kostenvergleich/constants'

useSeoMeta({
  title: 'Auto Kostenvergleich – Wallbox-Planer',
  description: 'Vergleiche die Gesamtkosten von Elektroauto und Verbrenner: Kaufpreis, Energiekosten, KFZ-Steuer und THG-Prämie – inkl. Break-even-Berechnung, hochgerechnet auf 5 und 7 Jahre.'
})

const { state } = useKostenvergleich()

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
        Auto Kostenvergleich
      </h1>
      <p class="mt-1 max-w-2xl text-muted">
        Vergleiche Kaufpreis und laufende Kosten von Elektroauto und Verbrenner – Energiekosten, KFZ-Steuer
        und THG-Prämie, hochgerechnet auf 5 und 7 Jahre, inkl. Break-even-Berechnung.
      </p>
    </div>

    <VehiclePicker />

    <div class="grid gap-6 lg:grid-cols-2">
      <EvSection />
      <CombustionSection />
    </div>

    <UCard>
      <UFormField label="Jahresfahrleistung (km)">
        <QuickSelectField
          v-model="state.annualDistanceKm"
          :options="ANNUAL_DISTANCE_QUICK_VALUES"
          unit="km"
          :min="1000"
          :max="100000"
          :step="500"
        />
      </UFormField>
    </UCard>

    <section ref="ergebnisSection" class="space-y-4">
      <USeparator />
      <h2 class="text-3xl font-semibold text-highlighted">
        Ergebnis
      </h2>
      <ResultTable />
      <UCard>
        <CostChart />
      </UCard>
    </section>

    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      leave-active-class="transition-transform duration-150 ease-in"
      enter-from-class="translate-y-full"
      leave-to-class="translate-y-full"
    >
      <SavingsBar v-if="!isErgebnisSectionVisible" />
    </Transition>
  </UContainer>
</template>
