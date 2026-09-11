<script setup lang="ts">
const { state, result } = useKostenvergleich()

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

function formatEur(value: number) {
  return eur.format(value)
}

const cheaper = computed(() => result.value.annualSavingEur >= 0 ? 'ev' : 'combustion')
const cheaperName = computed(() => cheaper.value === 'ev' ? state.value.ev.vehicleName : state.value.combustion.vehicleName)
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 border-t border-default bg-default/95 backdrop-blur supports-[backdrop-filter]:bg-default/75">
    <UContainer class="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-3 text-sm sm:justify-center">
      <div class="flex items-center gap-2">
        <span class="text-muted">{{ cheaperName }} günstiger (laufende Kosten)</span>
        <span class="font-semibold" :class="cheaper === 'ev' ? 'text-primary' : 'text-highlighted'">{{ formatEur(Math.abs(result.annualSavingEur)) }}/Jahr</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-muted">pro Monat</span>
        <span class="font-semibold text-highlighted">{{ formatEur(Math.abs(result.annualSavingEur) / 12) }}</span>
      </div>
    </UContainer>
  </div>
</template>
