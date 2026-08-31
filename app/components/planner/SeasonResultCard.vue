<script setup lang="ts">
import type { SeasonResult } from '~/types/planner'
import { paragraph14aHint } from '~/utils/planner/calculations'
import { CONNECTION_CLASS_LABELS, CONNECTION_CLASSES, SCHUKO_HINT } from '~/utils/planner/constants'

const props = defineProps<{
  result: SeasonResult
}>()

const legalHint = computed(() => paragraph14aHint(props.result.recommendedClassKw))
const pvCoveragePercent = computed(() => Math.round(props.result.pvCoverage * 100))
const windowHours = computed(() => props.result.vehicleResults[0]?.windowHours ?? 0)

const durationRows = computed(() => CONNECTION_CLASSES.map(kw => ({
  kw,
  label: CONNECTION_CLASS_LABELS[kw],
  hours: props.result.totalDailyEnergyKwh / kw
})))
</script>

<template>
  <div class="space-y-5">
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p class="flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
          Energiebedarf
          <FormulaInfo title="Energiebedarf (kWh/Tag)">
            <p>Je Fahrzeug: <code>Tagesfahrleistung × Verbrauch/100&nbsp;km × Saisonfaktor ÷ 100</code>, geteilt durch <code>(1 − Ladeverlust)</code> für den Bedarf an der Steckdose.</p>
            <p><strong>Saisonfaktor:</strong> Sommer 1,075 · Übergang 1,0 · Winter 1,25 (Mehrverbrauch durch Heizung/Klima). <strong>Ladeverlust:</strong> 10&nbsp;%.</p>
            <p>Summiert über alle Fahrzeuge der (ggf. geteilten) Anschlussgruppe.</p>
            <p>Das <strong>Ladezeitfenster</strong> ist die Komplementärmenge der Abwesenheits-Slots über 24&nbsp;h; bei geteiltem Anschluss die Zeit, in der mindestens ein Fahrzeug zuhause ist.</p>
          </FormulaInfo>
        </p>
        <p class="text-xl font-semibold text-highlighted">
          {{ result.totalDailyEnergyKwh.toFixed(1) }} kWh/Tag
        </p>
        <p class="text-xs text-muted">
          bei {{ windowHours.toFixed(1) }} h Ladezeitfenster
        </p>
      </div>
      <div>
        <p class="flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
          Nötige Mindestleistung
          <FormulaInfo title="Nötige Mindestleistung (kW)">
            <p><code>Energiebedarf (kWh/Tag) ÷ Ladezeitfenster (h)</code> – die Leistung, die nötig wäre, um den Tagesbedarf im verfügbaren Zeitfenster vollständig zu laden.</p>
            <p>Wird auf die maximale AC-Ladeleistung der Fahrzeuge gedeckelt; reicht das Zeitfenster selbst mit maximaler Fahrzeugleistung nicht aus, wird das als „Engpass" markiert.</p>
          </FormulaInfo>
        </p>
        <p class="text-xl font-semibold text-highlighted">
          {{ result.requiredPowerKw.toFixed(1) }} kW
        </p>
      </div>
      <div>
        <p class="flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
          Empfohlene Klasse
          <FormulaInfo title="Empfohlene Anschlussklasse">
            <p>Die kleinste Standardklasse aus <code>2,3 / 3,7 / 11 / 22 kW</code>, die mindestens der „Nötigen Mindestleistung" entspricht.</p>
            <p>Ab 4,2&nbsp;kW gilt beim Netzbetreiber eine Anmeldepflicht, ab 11&nbsp;kW zusätzlich eine Genehmigungspflicht (§14a EnWG).</p>
          </FormulaInfo>
        </p>
        <UBadge
          :label="CONNECTION_CLASS_LABELS[result.recommendedClassKw]"
          color="primary"
          variant="subtle"
          size="lg"
          class="mt-1"
        />
      </div>
      <div>
        <p class="flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
          PV-Deckungsgrad
          <FormulaInfo title="PV-Deckungsgrad (%)">
            <p><code>max(0, PV-Ertrag/Tag − Haushaltsverbrauch/Tag) ÷ Energiebedarf</code>, gedeckelt auf 100&nbsp;%.</p>
            <p>Reine <strong>Tagesenergie-Bilanz</strong>: Es wird nicht geprüft, ob der PV-Überschuss zeitlich mit dem Ladezeitfenster zusammenfällt oder ob die Ladeleistung ausreicht, um ihn abzunehmen. Der tatsächlich nutzbare Anteil kann dadurch deutlich niedriger liegen – siehe „Naiv- vs. Smart-PV-Überschussladen" weiter unten für die stundenscharfe Betrachtung.</p>
          </FormulaInfo>
        </p>
        <p class="text-xl font-semibold text-highlighted">
          {{ pvCoveragePercent }} %
        </p>
      </div>
    </div>

    <UProgress :model-value="pvCoveragePercent" :max="100" size="sm" />

    <div>
      <p class="flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
        Ladedauer je Anschlussart (bei {{ result.totalDailyEnergyKwh.toFixed(1) }} kWh/Tag)
        <FormulaInfo title="Ladedauer je Anschlussart">
          <p><code>Energiebedarf (kWh/Tag) ÷ Anschlussleistung (kW)</code> – rein rechnerische Dauer bei durchgehend voller Leistung, unabhängig vom tatsächlichen Ladezeitfenster.</p>
        </FormulaInfo>
      </p>
      <ul class="mt-2 space-y-1">
        <li
          v-for="row in durationRows"
          :key="row.kw"
          class="flex items-center justify-between rounded-md px-2 py-1 text-sm"
          :class="row.kw === result.recommendedClassKw ? 'bg-primary/10 text-highlighted font-medium' : 'text-muted'"
        >
          <span>{{ row.label }}</span>
          <span>{{ row.hours.toFixed(1) }} h</span>
        </li>
      </ul>
    </div>

    <div v-if="result.isBottleneck || legalHint || result.recommendedClassKw === 2.3" class="space-y-2">
      <UAlert
        v-if="result.isBottleneck"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="subtle"
        title="Engpass"
        description="Der Energiebedarf übersteigt in dieser Saison knapp das, was der geteilte Anschluss im verfügbaren Zeitfenster sequenziell liefern kann. 22 kW (falls von den Fahrzeugen unterstützt) oder ein zweiter Anschluss sollten geprüft werden."
      />
      <UAlert
        v-if="legalHint"
        icon="i-lucide-info"
        color="neutral"
        variant="subtle"
        :description="legalHint"
      />
      <UAlert
        v-if="result.recommendedClassKw === 2.3"
        icon="i-lucide-info"
        color="neutral"
        variant="subtle"
        :description="SCHUKO_HINT"
      />
    </div>
  </div>
</template>
