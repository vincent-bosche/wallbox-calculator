<script setup lang="ts">
import {
  ANNUAL_DISTANCE_QUICK_VALUES,
  FUEL_PRICE_QUICK_VALUES,
  HOME_PRICE_QUICK_VALUES,
  PUBLIC_PRICE_QUICK_VALUES
} from '~/utils/kostenvergleich/constants'

useSeoMeta({
  title: 'Auto Kostenvergleich – Wallbox-Planer',
  description: 'Vergleiche die Gesamtkosten von Elektroauto und Verbrenner: Kaufpreis, Energiekosten, KFZ-Steuer und THG-Prämie – inkl. Break-even-Berechnung, hochgerechnet auf 5 und 7 Jahre.'
})

const { state } = useKostenvergleich()

const homeSharePercent = computed(() => Math.round(state.value.ev.homeShare * 100))

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
      <div class="space-y-5">
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

        <UFormField label="Kraftstoffpreis (€/l)">
          <QuickSelectField
            v-model="state.combustion.fuelPriceEurL"
            :options="FUEL_PRICE_QUICK_VALUES"
            unit="€"
            :min="1"
            :max="3"
            :step="0.01"
            :decimals="2"
          />
        </UFormField>

        <UFormField :label="`Anteil zuhause geladen: ${homeSharePercent} %`">
          <USlider v-model="state.ev.homeShare" :min="0" :max="1" :step="0.05" />
        </UFormField>
      </div>
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
