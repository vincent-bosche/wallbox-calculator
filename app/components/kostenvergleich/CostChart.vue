<script setup lang="ts">
import { HIGHLIGHT_YEARS } from '~/utils/kostenvergleich/constants'

const { state, result } = useKostenvergleich()

const WIDTH = 480
const HEIGHT = 200

const points = computed(() => result.value.cumulative)

const maxYear = computed(() => Math.max(...points.value.map(p => p.year)))

const breakEvenX = computed(() => {
  const year = result.value.breakEvenYear
  if (year === null || year > maxYear.value) return null
  return x(year)
})
const maxCost = computed(() => Math.max(
  ...points.value.map(p => Math.max(p.evCumulativeEur, p.combustionCumulativeEur)),
  1
) * 1.1)

function x(year: number) {
  return year / maxYear.value * WIDTH
}

function y(value: number) {
  return HEIGHT - value / maxCost.value * HEIGHT
}

function linePath(key: 'evCumulativeEur' | 'combustionCumulativeEur') {
  return `M${points.value.map(p => `${x(p.year)},${y(p[key])}`).join(' L')}`
}

const evLinePath = computed(() => linePath('evCumulativeEur'))
const combustionLinePath = computed(() => linePath('combustionCumulativeEur'))

const highlightPoints = computed(() =>
  HIGHLIGHT_YEARS.map(year => points.value.find(p => p.year === year)!))

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
function formatEur(value: number) {
  return eur.format(value)
}

const YEAR_TICKS = computed(() => points.value.map(p => p.year))
</script>

<template>
  <div>
    <p class="text-xs uppercase tracking-wide text-muted">
      Kumulierte Kosten über die Zeit
    </p>
    <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT + 24}`" class="mt-2 w-full" role="img" :aria-label="`Kumulierte Kosten ${state.ev.vehicleName} vs. ${state.combustion.vehicleName} über 7 Jahre`">
      <line
        v-for="year in YEAR_TICKS"
        :key="year"
        :x1="x(year)"
        y1="0"
        :x2="x(year)"
        :y2="HEIGHT"
        class="stroke-muted"
        stroke-width="1"
        opacity="0.3"
      />

      <line
        v-if="breakEvenX !== null"
        :x1="breakEvenX"
        y1="0"
        :x2="breakEvenX"
        :y2="HEIGHT"
        class="stroke-warning"
        stroke-width="1.5"
        stroke-dasharray="4 3"
      />

      <path :d="combustionLinePath" fill="none" class="stroke-error" stroke-width="2" />
      <path :d="evLinePath" fill="none" class="stroke-primary" stroke-width="2.5" />

      <g v-for="point in highlightPoints" :key="point.year">
        <circle :cx="x(point.year)" :cy="y(point.evCumulativeEur)" r="3.5" class="fill-primary" />
        <circle :cx="x(point.year)" :cy="y(point.combustionCumulativeEur)" r="3.5" class="fill-error" />
      </g>

      <g class="text-[9px] fill-muted fill-current">
        <text
          v-for="year in YEAR_TICKS"
          :key="year"
          :x="Math.min(Math.max(x(year), 10), WIDTH - 10)"
          :y="HEIGHT + 14"
          text-anchor="middle"
        >{{ year }}J</text>
      </g>
    </svg>

    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
      <div class="flex items-center gap-1.5">
        <span class="h-0 w-3 border-t-2 border-primary" />
        {{ state.ev.vehicleName }}
      </div>
      <div class="flex items-center gap-1.5">
        <span class="h-0 w-3 border-t-2 border-error" />
        {{ state.combustion.vehicleName }}
      </div>
      <div v-if="breakEvenX !== null" class="flex items-center gap-1.5">
        <span class="h-0 w-3 border-t-2 border-dashed border-warning" />
        Break-even
      </div>
    </div>

    <div class="mt-3 grid gap-2 sm:grid-cols-2">
      <div
        v-for="point in highlightPoints"
        :key="point.year"
        class="rounded-md bg-elevated px-3 py-2 text-sm"
      >
        <p class="text-xs uppercase tracking-wide text-muted">
          Nach {{ point.year }} Jahren
        </p>
        <p class="text-highlighted">
          {{ state.ev.vehicleName }} {{ formatEur(point.evCumulativeEur) }} <br> {{ state.combustion.vehicleName }} {{ formatEur(point.combustionCumulativeEur) }}
        </p>
      </div>
    </div>
  </div>
</template>
