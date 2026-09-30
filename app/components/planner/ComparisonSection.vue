<script setup lang="ts">
import type { HourlySeriesResult, SeasonComparisonResult } from '~/types/planner'
import { computeDaylightRange } from '~/utils/planner/daylight'
import { diagnoseBottleneck } from '~/utils/planner/diagnostics'
import { CONNECTION_CLASSES, CONNECTION_CLASS_LABELS, SEASON_LABELS } from '~/utils/planner/constants'

const { comparisonResult, seasonResults, state } = useWallboxPlanner()

const BOTTLENECK_COLOR = {
  covered: 'success',
  pv: 'error',
  timing: 'warning',
  power: 'warning',
  battery: 'neutral'
} as const

function bottleneck(s: SeasonComparisonResult) {
  return diagnoseBottleneck(s, state.value.pv.batteryKwh > 0)
}

const classTabItems = CONNECTION_CLASSES.map(kw => ({
  label: CONNECTION_CLASS_LABELS[kw],
  value: kw
}))

// Beim Öffnen immer auf der Anschlussklasse starten, die im Ergebnis (Standard-Saison
// Sommer) empfohlen wird - der Rest bleibt zum Vergleich einen Klick entfernt.
const defaultConnectionKw = computed(() =>
  seasonResults.value.find(r => r.season === 'summer')?.recommendedClassKw ?? CONNECTION_CLASSES[0])

function classResult(connectionKw: number) {
  return comparisonResult.value.byConnectionClass.find(c => c.connectionKw === connectionKw)!
}

// Durchschnittliche Ladeleistung während der tatsächlichen Ladephasen unter "Smart" - zur
// Einordnung, wie stark "Smart" die Anschlussleistung ggü. der vollen Anschlussklasse tatsächlich
// drosselt. Kein fester Deckel: pro Stunde richtet sich die Leistung nach dem jeweils aktuellen
// PV-Überschuss (+ Akku), siehe simulation.ts.
function averageSmartPowerKwFromHourly(hourly: HourlySeriesResult): { energyKwh: number, hours: number } {
  let energyKwh = 0
  let hours = 0
  const { smartCarKwh, smartBatteryByHour } = hourly
  for (let h = 0; h < smartCarKwh.length; h++) {
    const draw = smartCarKwh[h]! + smartBatteryByHour[h]!
    if (draw > 0.0001) {
      energyKwh += draw
      hours++
    }
  }
  return { energyKwh, hours }
}

// Über alle drei Saisons gemittelt - für den Hinweis in der "Kostenersparnis durch Smart"-Info.
function averageSmartPowerKw(connectionKw: number): number {
  let energyKwh = 0
  let hours = 0
  for (const s of classResult(connectionKw).seasons) {
    const r = averageSmartPowerKwFromHourly(s.hourly)
    energyKwh += r.energyKwh
    hours += r.hours
  }
  return hours > 0 ? energyKwh / hours : 0
}

// Nur für eine einzelne Saison - für die Legende des jeweiligen Tagesverlauf-Diagramms.
function seasonAverageSmartPowerKw(s: SeasonComparisonResult): number {
  const { energyKwh, hours } = averageSmartPowerKwFromHourly(s.hourly)
  return hours > 0 ? energyKwh / hours : 0
}

// Fester Anzeigebereich für alle drei Saison-Diagramme einer Anschlussklasse (Sommer-Tag, da
// dort am längsten hell ist) - macht Sommer/Übergang/Winter direkt vergleichbar, statt dass
// jedes Diagramm auf seinen eigenen, unterschiedlich breiten Tag-Bereich zoomt.
function summerRange(connectionKw: number) {
  const summer = classResult(connectionKw).seasons.find(s => s.season === 'summer')!
  return computeDaylightRange(summer.hourly.pvGenKwh)
}

function toPercent(share: number) {
  return Math.round(share * 100)
}

// Referenzklassen für den "Zum Vergleich"-Hinweis bei 11/22 kW: eine höhere Anschlussklasse
// hilft nur, wenn auch mehr stündlicher PV-Überschuss abgerufen wird - reicht der Überschuss
// pro Stunde ohnehin nicht aus, schneiden Schuko/1-phasig oft gleich gut oder besser ab.
const REFERENCE_CLASSES = [2.3, 3.7] as const
const SHORT_CLASS_LABEL: Record<number, string> = { 2.3: 'Schuko', 3.7: '1-phasig' }

const SEGMENT_LEGEND = [
  { key: 'direct', label: 'Direkter Solarstrom (naiv)', swatch: 'bg-primary' },
  { key: 'smart', label: 'Zusatz durch Smart', swatch: 'bg-primary/40' },
  { key: 'battery', label: 'Hausakku (über Haushalts-Reserve hinaus)', swatch: 'bg-warning' },
  { key: 'grid', label: 'Netz', swatch: 'bg-accented' }
] as const

// Kumulativer Aufbau: Was gibt es geschenkt (Direktsolar beim naiven Laden), was bringt
// smartes Timing zusätzlich, was kann der Hausakku obendrauf beisteuern (nur der Anteil über
// der Haushaltsreserve, siehe simulation.ts), und was bleibt am Ende für das Netz übrig.
function segments(s: SeasonComparisonResult) {
  const total = s.dailyEnergyKwh
  const direct = s.naivePvDirectKwh
  const smart = Math.max(0, s.smartPvDirectKwh - s.naivePvDirectKwh)
  const battery = s.smartBatteryKwh
  const grid = Math.max(0, s.smartGridKwh)

  return [
    { key: 'direct', kwh: direct },
    { key: 'smart', kwh: smart },
    { key: 'battery', kwh: battery },
    { key: 'grid', kwh: grid }
  ].map(seg => ({
    ...seg,
    label: SEGMENT_LEGEND.find(l => l.key === seg.key)!.label,
    swatch: SEGMENT_LEGEND.find(l => l.key === seg.key)!.swatch,
    percent: total > 0 ? (seg.kwh / total) * 100 : 0
  }))
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
        <UIcon name="i-lucide-line-chart" class="size-5" />
        Naiv- vs. Smart-PV-Überschussladen
      </h2>
    </template>

    <div class="space-y-1 text-sm text-muted">
      <p>
        <span class="font-medium text-highlighted">Naiv (sofort anstecken):</span>
        Das Auto lädt ab dem Moment der Ankunft sofort mit voller Leistung. "Direkter
        Solarstrom" ist, was davon zufällig in PV-Überschuss-Stunden fällt. Bei abendlicher
        Ankunft heißt das meist: Naiv lädt abends/über Nacht komplett durch, obwohl da gar kein
        Solarstrom mehr da ist.
      </p>
      <p>
        <span class="font-medium text-highlighted">Zusatz durch Smart:</span>
        Zusätzlicher Solarstrom, der durch gezieltes Timing (nur laden, wenn Überschuss da
        ist) ggü. naiv erschlossen wird. Bleibt das Auto z. B. über Nacht bis zum nächsten
        Vormittag zuhause, wartet Smart einen Teil der Ladung ab und nutzt stattdessen den
        PV-Überschuss der frühen Morgenstunden - Naiv hat den Bedarf da schon nachts komplett
        aus dem Netz gedeckt und "verpasst" diesen Morgen-Solarstrom.
      </p>
      <p>
        <span class="font-medium text-highlighted">Hausakku:</span>
        Der Speicher ist primär für den Haushalt da und muss zuerst die Nacht überbrücken
        können - nur die Kapazität darüber hinaus steht dem Auto zur Verfügung. Im Winter
        (lange Nächte, wenig Ertrag) bleibt dadurch oft nichts fürs Auto übrig, selbst wenn
        der Speicher voll ist.
      </p>
      <p>
        Alles hängt von der Ladeleistung ab - deshalb unten je Anschlussklasse einzeln
        aufgeschlüsselt. Ist die Ladeleistung des Fahrzeugs geringer als die Anschlussklasse,
        wird die Fahrzeuggrenze verwendet (siehe "Max. AC-Ladeleistung Fahrzeug" bei den
        Fahrzeug-Angaben).
      </p>
    </div>

    <UTabs :items="classTabItems" :default-value="defaultConnectionKw" variant="pill" size="sm" class="mt-4">
      <template #content="{ item }">
        <div class="space-y-5 pt-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-default p-4">
              <p class="flex items-center gap-1 text-sm font-medium text-muted">
                PV-Potenzial (Obergrenze)
                <FormulaInfo title="PV-Potenzial (Obergrenze)">
                  <p>Simulation im Modus „potential": lädt in jeder Zuhause-Stunde mit dem kompletten verfügbaren PV-Überschuss (+ Akku oberhalb der Haushaltsreserve), <strong>ohne Tagesbedarf-Deckel</strong> – reine Obergrenze dessen, was diese Anschlussklasse an PV überhaupt liefern könnte.</p>
                  <p>Anteil <code>= min(potenzieller PV-Nutzung, Tagesbedarf) ÷ Tagesbedarf</code>, über alle Saisons summiert.</p>
                  <p>Eine größere Anschlussklasse hilft nur, wenn auch mehr stündlicher PV-Überschuss abgerufen wird. Reicht der Überschuss pro Stunde ohnehin nicht aus (z. B. wenig PV, kurzes Zeitfenster), schneiden Schuko/1-phasig oft gleich gut oder sogar besser ab - deshalb der Vergleichswert darunter.</p>
                </FormulaInfo>
              </p>
              <p class="mt-1 text-2xl font-semibold text-highlighted">
                {{ toPercent(classResult(item.value).potentialSelfConsumptionShare) }} %
              </p>
              <p v-if="item.value > 3.7" class="mt-1 text-xs text-muted">
                Zum Vergleich:
                <template v-for="(kw, i) in REFERENCE_CLASSES" :key="kw">{{ i > 0 ? ' · ' : '' }}{{ SHORT_CLASS_LABEL[kw] }} {{ toPercent(classResult(kw).potentialSelfConsumptionShare) }} %</template>
              </p>
            </div>
            <div class="rounded-lg border border-default p-4">
              <p class="flex items-center gap-1 text-sm font-medium text-muted">
                Kostenersparnis durch Smart
                <FormulaInfo title="Kostenersparnis durch Smart">
                  <p><code>Netzbezug-Ersparnis durch Smart (kWh/Jahr) × Strompreis (ct/kWh) ÷ 100</code>.</p>
                  <p>Eine größere Anschlussklasse bedeutet nicht automatisch mehr Ersparnis - "Smart" deckelt die Ladeleistung ohnehin auf den aktuellen PV-Überschuss. Bei knappem stündlichem Überschuss kann Schuko/1-phasig ähnlich gut oder besser abschneiden, siehe Vergleichswert darunter.</p>
                  <p>
                    Bei {{ item.value }} kW drosselt Smart die Ladeleistung während der Ladephasen auf
                    durchschnittlich {{ averageSmartPowerKw(item.value).toFixed(1) }} kW, um einen möglichst hohen
                    Eigenverbrauch zu erzielen - der tatsächliche Wert schwankt stundenweise mit dem
                    PV-Überschuss (+ Akku) und ist kein fester Deckel.
                  </p>
                </FormulaInfo>
              </p>
              <p class="mt-1 text-2xl font-semibold text-highlighted">
                {{ classResult(item.value).annualCostSavingEur.toFixed(0) }} €/Jahr
              </p>
              <p v-if="item.value > 3.7" class="mt-1 text-xs text-muted">
                Zum Vergleich:
                <template v-for="(kw, i) in REFERENCE_CLASSES" :key="kw">{{ i > 0 ? ' · ' : '' }}{{ SHORT_CLASS_LABEL[kw] }} {{ classResult(kw).annualCostSavingEur.toFixed(0) }} €/Jahr</template>
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="s in classResult(item.value).seasons" :key="s.season" class="space-y-1.5">
              <div class="flex items-center justify-between text-sm">
                <span class="flex items-center gap-1 font-medium text-highlighted">
                  {{ SEASON_LABELS[s.season] }}
                  <FormulaInfo :title="`${SEASON_LABELS[s.season]}: Naiv vs. Smart`">
                    <p>Stundengenaue Tagessimulation (24 Stunden, saisonale Sinus²-Erzeugungskurve): Haushalt hat Vorrang vor PV, der Überschuss lädt zuerst das Auto, danach – oberhalb der Haushalts-Nachtreserve – der Akku, der Rest kommt vom Netz.</p>
                    <p><strong>Naiv:</strong> lädt ab dem Moment der Ankunft durchgehend mit voller (gedeckelter) Leistung, unabhängig vom stündlichen PV-Überschuss - bei abendlicher Ankunft also meist abends/über Nacht ohne jeden Solarstrom.</p>
                    <p><strong>Smart:</strong> lädt nur mit dem, was der aktuelle PV-Überschuss (+ Akku) hergibt, und verschiebt dafür bei Bedarf einen Teil der Ladung bis zum nächsten PV-Fenster (z. B. dem frühen Vormittag, falls das Fahrzeug so lange zuhause bleibt).</p>
                    <p><strong>Sonnenstunden:</strong> Zuhause-Stunden, in denen die PV-Erzeugung den Haushaltsverbrauch übersteigt – unabhängig von Ladeleistung/Strategie.</p>
                    <p>Eine Stunde zählt als „zuhause", wenn das Fahrzeug in weniger als 30&nbsp;Minuten davon abwesend war.</p>
                  </FormulaInfo>
                </span>
                <span class="text-muted">{{ s.dailyEnergyKwh.toFixed(1) }} kWh/Tag · {{ s.sunHours }} Sonnenstunden (davon {{ s.smartPvDirectKwh.toFixed(1) }} kWh nutzbar)</span>
              </div>
              <div class="flex h-5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  v-for="seg in segments(s)"
                  :key="seg.key"
                  :class="seg.swatch"
                  :style="{ width: seg.percent + '%' }"
                  :title="`${seg.label}: ${seg.kwh.toFixed(1)} kWh (${Math.round(seg.percent)} %)`"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 text-xs">
                <UBadge :color="BOTTLENECK_COLOR[bottleneck(s).key]" variant="subtle" size="sm">
                  {{ bottleneck(s).label }}
                </UBadge>
                <span class="text-muted">{{ bottleneck(s).detail }}</span>
              </div>
              <PvUsageChart
                :hourly="s.hourly"
                :range="summerRange(item.value)"
                :connection-kw="item.value"
                :avg-smart-power-kw="seasonAverageSmartPowerKw(s)"
                class="pt-1"
              />
            </div>
          </div>

          <div class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
            <div v-for="entry in SEGMENT_LEGEND" :key="entry.key" class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full" :class="entry.swatch" />
              {{ entry.label }}
            </div>
          </div>

          <p class="flex items-center gap-1 text-sm">
            <span class="text-muted">Netzbezug-Ersparnis durch Smart:</span>
            <span class="font-semibold text-highlighted"> {{ classResult(item.value).annualGridSavingKwh.toFixed(0) }} kWh/Jahr</span>
            <FormulaInfo title="Netzbezug-Ersparnis durch Smart">
              <p><code>Σ (Netzbezug naiv − Netzbezug smart) je Saison × Tage/Saison</code>, aufsummiert über alle drei Saisons.</p>
              <p>Tage/Saison: <code>365 ÷ 3 ≈ 121,7</code> (vereinfachte Drittelung des Jahres statt exakter Monatsgrenzen).</p>
            </FormulaInfo>
          </p>
        </div>
      </template>
    </UTabs>
  </UCard>
</template>
