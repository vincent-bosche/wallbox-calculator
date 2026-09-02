<script setup lang="ts">
import type { Preset } from '~/utils/planner/presets'
import { PRESETS } from '~/utils/planner/presets'

const emit = defineEmits<{ select: [] }>()

const { loadPreset } = useWallboxPlanner()

function selectPreset(preset: Preset) {
  loadPreset(preset)
  emit('select')
}
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-xl font-semibold text-highlighted">
        Beispiel-Situationen
      </h2>
      <p class="text-sm text-muted">
        Eine Karte wählen, um alle Felder vorzubefüllen – danach frei anpassbar.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UPageCard
        v-for="preset in PRESETS"
        :key="preset.id"
        :title="preset.title"
        :description="preset.description"
        :icon="preset.icon"
        spotlight
        class="cursor-pointer text-left"
        @click="selectPreset(preset)"
      />
    </div>
  </section>
</template>
