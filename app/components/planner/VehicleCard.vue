<script setup lang="ts">
import type { Vehicle } from '~/types/planner'
import { vehicleBufferDays } from '~/utils/planner/calculations'
import {
  BATTERY_CAPACITY_QUICK_VALUES,
  CONSUMPTION_QUICK_VALUES,
  DAILY_DISTANCE_QUICK_VALUES,
  MAX_AC_POWER_QUICK_VALUES,
  SEASON_LABELS,
  SEASONS
} from '~/utils/planner/constants'

const props = defineProps<{
  vehicle: Vehicle
  removable: boolean
}>()

const emit = defineEmits<{ remove: [] }>()

const bufferDaysBySeason = computed(() => SEASONS.map(season => ({
  season,
  label: SEASON_LABELS[season],
  days: vehicleBufferDays(props.vehicle, season)
})))
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <UInput
          v-model="vehicle.name"
          variant="none"
          size="lg"
          class="font-semibold text-highlighted -ms-3"
          aria-label="Fahrzeugname"
        />
        <UButton
          v-if="removable"
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Fahrzeug entfernen"
          @click="emit('remove')"
        />
      </div>
    </template>

    <div class="space-y-5">
      <UFormField label="Verbrauch (kWh/100 km, Basis)">
        <QuickSelectField
          v-model="vehicle.consumptionKwh100km"
          :options="CONSUMPTION_QUICK_VALUES"
          unit="kWh/100 km"
          :min="5"
          :max="60"
          :step="0.5"
        />
      </UFormField>

      <UFormField label="Tagesfahrleistung (km)">
        <QuickSelectField
          v-model="vehicle.dailyDistanceKm"
          :options="DAILY_DISTANCE_QUICK_VALUES"
          unit="km"
          :min="0"
          :max="500"
          :step="5"
        />
      </UFormField>

      <UFormField label="Hat eigenen Stromanschluss (Steckdose/Wallbox)?">
        <template #label="{ label }">
          <span class="inline-flex items-center gap-1">
            {{ label }}
            <UTooltip text="Nur relevant, wenn mehrere Fahrzeuge sich einen Anschluss teilen: Fahrzeuge ohne eigenen Anschluss laden über den Anschluss des ersten Fahrzeugs mit eigenem Anschluss.">
              <UIcon name="i-lucide-info" class="size-3.5 text-muted" />
            </UTooltip>
          </span>
        </template>
        <URadioGroup
          v-model="vehicle.hasOwnConnection"
          orientation="horizontal"
          :items="[{ label: 'Ja', value: true }, { label: 'Nein', value: false }]"
        />
      </UFormField>

      <UFormField
        label="Abwesenheits-Slots"
        description="Zeiträume, in denen das Fahrzeug nicht zuhause/ladbar ist. Das Ladezeitfenster ergibt sich als Komplementärmenge über 24 h."
      >
        <AbsenceSlotsInput v-model="vehicle.absenceSlots" />
      </UFormField>

      <UCollapsible>
        <UButton
          label="Erweitert"
          icon="i-lucide-settings-2"
          trailing-icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="sm"
          block
        />
        <template #content>
          <div class="space-y-5 pt-4">
            <UFormField
              label="Max. AC-Ladeleistung Fahrzeug"
              description="7,4 kW (32 A einphasig) sind an einem privaten Hausanschluss nur mit max. 3,7 kW/16 A nutzbar – die vollen 7,4 kW gibt es nur an öffentlichen Ladesäulen."
            >
              <QuickSelectField
                v-model="vehicle.maxAcPowerKw"
                :options="MAX_AC_POWER_QUICK_VALUES"
                unit="kW"
                :min="1.4"
                :max="43"
                :step="0.1"
              />
            </UFormField>
            <UFormField
              label="Batteriekapazität"
              description="Nur für Puffertage-Anzeige & Plausibilitätscheck."
            >
              <QuickSelectField
                v-model="vehicle.batteryCapacityKwh"
                :options="BATTERY_CAPACITY_QUICK_VALUES"
                unit="kWh"
                :min="10"
                :max="150"
                :step="1"
              />
              <p class="mt-2 flex flex-wrap items-center gap-1 text-sm text-muted">
                Tage ohne Laden (10–80 % Akku):
                <FormulaInfo title="Tage ohne Laden (10–80 % Akku)">
                  <p><code>Nutzbarer Batteriepuffer ÷ täglicher Fahrverbrauch</code>.</p>
                  <p><strong>Nutzbarer Batteriepuffer:</strong> <code>Batteriekapazität × (80 % − 10 %)</code> – nur dieser Bereich wird als alltagstauglich angenommen (Akku-Schonung).</p>
                  <p><strong>Täglicher Fahrverbrauch:</strong> <code>Tagesfahrleistung × Verbrauch/100&nbsp;km × Saisonfaktor ÷ 100</code> (ohne Ladeverluste – reiner Batteriefüllstand, nicht der Netzbezug beim Laden).</p>
                </FormulaInfo>
                <span
                  v-for="(entry, index) in bufferDaysBySeason"
                  :key="entry.season"
                  class="text-highlighted font-medium"
                >{{ index > 0 ? ' · ' : ' ' }}{{ entry.label }} {{ entry.days.toFixed(1) }} T.</span>
              </p>
            </UFormField>
          </div>
        </template>
      </UCollapsible>
    </div>
  </UCard>
</template>
