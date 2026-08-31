<script setup lang="ts">
import type { Orientation } from '~/types/planner'
import {
  ELECTRICITY_PRICE_QUICK_VALUES,
  ORIENTATION_LABELS,
  PV_BATTERY_QUICK_VALUES,
  PV_KWP_QUICK_VALUES
} from '~/utils/planner/constants'

const { state } = useWallboxPlanner()

const orientationItems = (Object.entries(ORIENTATION_LABELS) as [Orientation, string][])
  .map(([value, label]) => ({ label, value }))
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <div>
          <h2 class="text-lg font-semibold text-highlighted">
            PV-Anlage
          </h2>
          <p class="text-sm text-muted">
            Beeinflusst PV-Deckungsgrad und den Naiv-vs-Smart-Vergleich.
          </p>
        </div>
        <USwitch v-model="state.pv.enabled" aria-label="PV-Anlage vorhanden" />
      </div>
    </template>

    <div v-if="state.pv.enabled" class="space-y-5">
      <UFormField label="Anlagengröße (kWp)">
        <QuickSelectField
          v-model="state.pv.kwp"
          :options="PV_KWP_QUICK_VALUES"
          unit="kWp"
          :min="1"
          :max="30"
          :step="0.5"
        />
      </UFormField>

      <UFormField label="Ausrichtung">
        <URadioGroup v-model="state.pv.orientation" orientation="horizontal" :items="orientationItems" />
      </UFormField>

      <UFormField label="Batteriespeicher vorhanden (kWh)">
        <QuickSelectField
          v-model="state.pv.batteryKwh"
          :options="PV_BATTERY_QUICK_VALUES"
          unit="kWh"
          :min="0"
          :max="60"
          :step="1"
        />
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
          <div class="pt-4">
            <UFormField
              label="Strompreis (ct/kWh)"
              description="Für die Kostenersparnis im Naiv-vs-Smart-Vergleich."
            >
              <QuickSelectField
                v-model="state.electricityPriceCtPerKwh"
                :options="ELECTRICITY_PRICE_QUICK_VALUES"
                unit="ct/kWh"
                :min="10"
                :max="80"
                :step="1"
              />
            </UFormField>
          </div>
        </template>
      </UCollapsible>
    </div>
    <p v-else class="text-sm text-muted">
      Ohne PV-Anlage entfällt der PV-Deckungsgrad und der Naiv-vs-Smart-Vergleich zeigt keinen Unterschied.
    </p>
  </UCard>
</template>
