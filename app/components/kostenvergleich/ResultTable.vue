<script setup lang="ts">
import { HIGHLIGHT_YEARS } from '~/utils/kostenvergleich/constants'

const { state, result } = useKostenvergleich()

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

function formatEur(value: number) {
  return eur.format(value)
}

// Prozentualer Unterschied E-Auto ggü. Verbrenner (negativ = E-Auto günstiger).
function percentDiff(ev: number, combustion: number): string {
  if (combustion === 0) return '–'
  const pct = (ev - combustion) / Math.abs(combustion) * 100
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(0)} %`
}

function percentDiffClass(ev: number, combustion: number): string {
  if (combustion === 0) return 'text-muted'
  return ev <= combustion ? 'text-primary' : 'text-highlighted'
}

const highlightPoints = computed(() =>
  HIGHLIGHT_YEARS.map(year => result.value.cumulative.find(p => p.year === year)!))

const runningCostRows = computed(() => [
  { label: 'Energiekosten', ev: result.value.ev.energyCostEur, combustion: result.value.combustion.energyCostEur },
  { label: 'KFZ-Steuer', ev: result.value.ev.taxEur, combustion: result.value.combustion.taxEur },
  { label: 'THG-Prämie', ev: -result.value.ev.thgCreditEur, combustion: 0 },
  { label: 'Laufende Kosten', ev: result.value.ev.totalEur, combustion: result.value.combustion.totalEur, emphasize: true },
  { label: 'Pro Monat', ev: result.value.ev.totalEur / 12, combustion: result.value.combustion.totalEur / 12, emphasize: true }
])

const purchaseRows = computed(() => [
  { label: 'Kaufpreis (UVP)', ev: state.value.ev.purchasePriceEur, combustion: state.value.combustion.purchasePriceEur },
  ...highlightPoints.value.map(point => ({
    label: `Gesamtkosten nach ${point.year} Jahren (inkl. Kaufpreis)`,
    ev: point.evCumulativeEur,
    combustion: point.combustionCumulativeEur,
    emphasize: true
  }))
])

const breakEvenLabel = computed(() => {
  const year = result.value.breakEvenYear
  if (year === null) return 'Kein Break-even – E-Auto holt den höheren Kaufpreis nicht auf.'
  if (year < 0.05) return 'Sofort – E-Auto ist von Anfang an günstiger.'
  return `Nach ${year.toFixed(1)} Jahren gleicht das E-Auto den Kaufpreis-Unterschied aus.`
})

// Für Horizonte (5/7 Jahre), die nach dem Break-even liegen: zusätzliche Ersparnis in den
// verbleibenden Jahren bis zu diesem Horizont (rein aus den laufenden Kosten, ohne Kaufpreis).
const breakEvenExtras = computed(() => {
  const year = result.value.breakEvenYear
  if (year === null) return []
  return HIGHLIGHT_YEARS
    .filter(horizon => year < horizon)
    .map(horizon => ({
      horizon,
      savedEur: (horizon - year) * result.value.annualSavingEur
    }))
})
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        Ergebnis
      </h2>
    </template>

    <div class="space-y-6">
      <div>
        <h3 class="mb-2 text-sm font-semibold text-highlighted">
          Laufende Kosten (pro Jahr)
        </h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-muted">
              <th class="py-2 text-left font-normal"><span class="hidden">Posten</span></th>
              <th class="max-w-[8rem] truncate py-2 text-right font-normal" :title="state.ev.vehicleName">
                {{ state.ev.vehicleName }}
                <span v-if="state.ev.powerPs" class="block normal-case text-[10px] text-muted">{{ state.ev.powerPs }} PS</span>
              </th>
              <th class="max-w-[8rem] truncate py-2 text-right font-normal" :title="state.combustion.vehicleName">
                {{ state.combustion.vehicleName }}
                <span v-if="state.combustion.powerPs" class="block normal-case text-[10px] text-muted">{{ state.combustion.powerPs }} PS</span>
              </th>
              <th class="py-2 text-right font-normal">
                Differenz
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in runningCostRows"
              :key="row.label"
              class="border-t border-default"
              :class="row.emphasize && 'font-semibold text-highlighted'"
            >
              <td class="py-2">
                {{ row.label }}
              </td>
              <td class="py-2 text-right">
                {{ formatEur(row.ev) }}
              </td>
              <td class="py-2 text-right">
                {{ formatEur(row.combustion) }}
              </td>
              <td class="py-2 text-right" :class="percentDiffClass(row.ev, row.combustion)">
                {{ percentDiff(row.ev, row.combustion) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 class="mb-2 text-sm font-semibold text-highlighted">
          Kaufpreis &amp; Gesamtkosten
        </h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-muted">
              <th class="py-2 text-left font-normal"><span class="hidden">Posten</span></th>
              <th class="max-w-[8rem] truncate py-2 text-right font-normal" :title="state.ev.vehicleName">
                {{ state.ev.vehicleName }}
                <span v-if="state.ev.powerPs" class="block normal-case text-[10px] text-muted">{{ state.ev.powerPs }} PS</span>
              </th>
              <th class="max-w-[8rem] truncate py-2 text-right font-normal" :title="state.combustion.vehicleName">
                {{ state.combustion.vehicleName }}
                <span v-if="state.combustion.powerPs" class="block normal-case text-[10px] text-muted">{{ state.combustion.powerPs }} PS</span>
              </th>
              <th class="py-2 text-right font-normal">
                Differenz
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in purchaseRows"
              :key="row.label"
              class="border-t border-default"
              :class="row.emphasize && 'font-semibold text-highlighted'"
            >
              <td class="py-2">
                {{ row.label }}
              </td>
              <td class="py-2 text-right">
                {{ formatEur(row.ev) }}
              </td>
              <td class="py-2 text-right">
                {{ formatEur(row.combustion) }}
              </td>
              <td class="py-2 text-right" :class="percentDiffClass(row.ev, row.combustion)">
                {{ percentDiff(row.ev, row.combustion) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UAlert
        icon="i-lucide-scale"
        color="primary"
        variant="subtle"
        title="Break-even (Kaufpreis + laufende Kosten)"
      >
        <template #description>
          <p>{{ breakEvenLabel }}</p>
          <ul v-if="breakEvenExtras.length" class="mt-1 space-y-0.5">
            <li v-for="extra in breakEvenExtras" :key="extra.horizon">
              Bis Jahr {{ extra.horizon }}: zusätzlich <strong>{{ formatEur(extra.savedEur) }}</strong> gespart.
            </li>
          </ul>
        </template>
      </UAlert>
    </div>
  </UCard>
</template>
