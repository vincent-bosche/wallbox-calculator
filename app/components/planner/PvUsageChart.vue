<script setup lang="ts">
import type { HourlySeriesResult } from '~/types/planner'
import type { DaylightRange } from '~/utils/planner/daylight'
import { computeDaylightRange } from '~/utils/planner/daylight'

const props = defineProps<{
  hourly: HourlySeriesResult
  // Fester Anzeigebereich (z. B. der Sommer-Tag), damit Sommer/Übergang/Winter-Diagramme
  // denselben Ausschnitt zeigen und vergleichbar bleiben. Ohne Angabe: eigener Tag-Bereich.
  range?: DaylightRange
}>()

const WIDTH = 480
const HEIGHT = 140

const visibleRange = computed(() => props.range ?? computeDaylightRange(props.hourly.pvGenKwh))

const rangeHours = computed(() => visibleRange.value.end - visibleRange.value.start + 1)
const stepX = computed(() => WIDTH / rangeHours.value)

const maxY = computed(() => Math.max(...props.hourly.pvGenKwh, props.hourly.householdLoadKwh, 0.1) * 1.15)

function y(value: number) {
  return HEIGHT - (value / maxY.value) * HEIGHT
}

// x-Position innerhalb des sichtbaren Bereichs für die absolute Stunde h (Balkenmitte).
function x(h: number) {
  return (h - visibleRange.value.start) * stepX.value + stepX.value / 2
}

function areaPath(values: number[]) {
  const { start, end } = visibleRange.value
  const visible = values.slice(start, end + 1)
  if (visible.length === 0) return ''
  const points = visible.map((v, i) => `${x(start + i)},${y(v)}`)
  return `M${x(start)},${HEIGHT} L${points.join(' L')} L${x(end)},${HEIGHT} Z`
}

function linePath(values: number[]) {
  const { start, end } = visibleRange.value
  const visible = values.slice(start, end + 1)
  if (visible.length === 0) return ''
  return `M${visible.map((v, i) => `${x(start + i)},${y(v)}`).join(' L')}`
}

// Band zwischen zwei Kurven (z. B. Akku-Anteil oberhalb des PV-Anteils, smart) statt Fläche
// ab der Nulllinie - für gestapelte Bereiche.
function bandPath(bottomValues: number[], topValues: number[]) {
  const { start, end } = visibleRange.value
  const top = topValues.slice(start, end + 1)
  const bottom = bottomValues.slice(start, end + 1)
  if (top.length === 0) return ''
  const topPoints = top.map((v, i) => `${x(start + i)},${y(v)}`)
  const bottomPoints = bottom.map((v, i) => `${x(start + i)},${y(v)}`).reverse()
  return `M${topPoints.join(' L')} L${bottomPoints.join(' L')} Z`
}

const pvAreaPath = computed(() => areaPath(props.hourly.pvGenKwh))
const pvLinePath = computed(() => linePath(props.hourly.pvGenKwh))
const smartUsedAreaPath = computed(() => areaPath(props.hourly.smartCarKwh))
const naiveUsedAreaPath = computed(() => areaPath(props.hourly.naiveCarKwh))
const householdY = computed(() => y(props.hourly.householdLoadKwh))

// Akku-Anteil (smart) wird oben auf den PV-Anteil (smart) gestapelt dargestellt - konsistent
// mit der kumulativen Zusammensetzungs-Leiste darüber (direkt → smart → Akku → Netz).
const hasBatteryUsage = computed(() => props.hourly.smartBatteryByHour.some(v => v > 0.0001))
const smartWithBatteryKwh = computed(() =>
  props.hourly.smartCarKwh.map((v, h) => v + (props.hourly.smartBatteryByHour[h] ?? 0)))
const smartBatteryBandPath = computed(() => bandPath(props.hourly.smartCarKwh, smartWithBatteryKwh.value))

const homeBands = computed(() => {
  const { start, end } = visibleRange.value
  const bands: { start: number, length: number }[] = []
  for (let h = start; h <= end; h++) {
    if (!props.hourly.homeHours[h]) continue
    const last = bands.at(-1)
    if (last && last.start + last.length === h) {
      last.length++
    } else {
      bands.push({ start: h, length: 1 })
    }
  }
  return bands
})

const HOUR_TICKS = computed(() => {
  const { start, end } = visibleRange.value
  const mid = start + Math.round((end - start) / 2)
  return [...new Set([start, mid, end + 1])]
})

// Achsenbeschriftung an der Kachelgrenze (nicht Balkenmitte) - Sonnenaufgang links, Sonnenuntergang rechts.
function tickX(h: number) {
  return (h - visibleRange.value.start) * stepX.value
}
</script>

<template>
  <div>
    <p class="flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
      Tagesverlauf
      <FormulaInfo title="PV-Tagesverlauf">
        <p>Normierte, glockenförmige Erzeugungskurve (<code>sin²</code>) mit Peak um 12:00, zentriert auf die saisonalen Tageslichtstunden (Sommer 15&nbsp;h · Übergang 12&nbsp;h · Winter 9&nbsp;h) und auf den saisonalen Tagesertrag skaliert. Reine Rechenkurve ohne Live-/Wetterdaten.</p>
        <p>Dargestellt wird nur der Tag-Bereich zwischen Sonnenaufgang und -untergang (erste/letzte Stunde mit Erzeugung &gt; 0 im Sommer) - Nachtstunden ohne Erzeugung sind ausgeblendet. Übergangszeit und Winter nutzen denselben Zeitausschnitt wie der Sommer, damit die drei Diagramme vergleichbar bleiben (dort bleibt es an den Rändern entsprechend dunkler).</p>
        <p>„Genutzt" zeigt den Anteil davon, der laut Naiv- bzw. Smart-Simulation tatsächlich ans Auto ging – nicht die reine Überschussfläche über der Haushaltslast. Bei vorhandenem Hausakku kommt bei „Smart" oben ein Akku-Band dazu (Ladung aus dem Speicher oberhalb der Haushalts-Nachtreserve) - Naiv nutzt den Akku ebenfalls, wird hier aber nicht separat ausgewiesen (siehe Zusammensetzungs-Leiste oben für den Naiv-Wert).</p>
        <p>Die grauen Bänder markieren Stunden, in denen mindestens ein Fahrzeug zuhause ist (weniger als 30&nbsp;Minuten Abwesenheit in dieser Stunde).</p>
      </FormulaInfo>
    </p>
    <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT + 24}`" class="w-full" role="img" aria-label="PV-Erzeugung und genutzter Anteil zwischen Sonnenaufgang und -untergang">
      <rect
        v-for="band in homeBands"
        :key="band.start"
        :x="tickX(band.start)"
        y="0"
        :width="band.length * stepX"
        :height="HEIGHT"
        class="fill-muted"
      />

      <path :d="pvAreaPath" class="fill-primary/10" />
      <path :d="pvLinePath" fill="none" class="stroke-primary/60" stroke-width="1.5" />

      <path :d="smartUsedAreaPath" class="fill-primary/35" />
      <path v-if="hasBatteryUsage" :d="smartBatteryBandPath" class="fill-warning/50" />
      <path :d="naiveUsedAreaPath" class="fill-primary/80" />

      <line
        x1="0"
        :y1="householdY"
        :x2="WIDTH"
        :y2="householdY"
        class="stroke-muted"
        stroke-width="1"
        stroke-dasharray="4 3"
      />

      <g class="text-[9px] fill-muted">
        <text
          v-for="h in HOUR_TICKS"
          :key="h"
          :x="Math.min(Math.max(tickX(h), 8), WIDTH - 8)"
          :y="HEIGHT + 14"
          text-anchor="middle"
        >{{ h }}:00</text>
      </g>
    </svg>

    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-primary/10 ring-1 ring-primary/60" />
        PV-Erzeugung
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-primary/35" />
        Genutzt (smart)
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-primary/80" />
        Genutzt (naiv)
      </div>
      <div v-if="hasBatteryUsage" class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-warning/50" />
        Hausakku (smart, zusätzlich)
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-muted" />
        Fahrzeug zuhause
      </div>
      <div class="flex items-center gap-1.5">
        <span class="h-0 w-3 border-t border-dashed border-muted" />
        Haushaltslast
      </div>
    </div>
  </div>
</template>
