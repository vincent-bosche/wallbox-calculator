<script setup lang="ts">
import type { SeasonResult } from '~/types/planner'
import { CONNECTION_CLASS_LABELS } from '~/utils/planner/constants'

const props = defineProps<{
  result: SeasonResult
}>()

const chargingHours = computed(() => props.result.totalDailyEnergyKwh / props.result.recommendedClassKw)
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 border-t border-default bg-default/95 backdrop-blur supports-[backdrop-filter]:bg-default/75">
    <UContainer class="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-3 text-sm sm:justify-center">
      <div class="flex items-center gap-2">
        <span class="text-muted">Energiebedarf</span>
        <span class="font-semibold text-highlighted">{{ result.totalDailyEnergyKwh.toFixed(1) }} kWh/Tag</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-muted">Ladezeit</span>
        <span class="font-semibold text-highlighted">{{ chargingHours.toFixed(1) }} h</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-muted">bei</span>
        <UBadge
          :label="CONNECTION_CLASS_LABELS[result.recommendedClassKw]"
          color="primary"
          variant="subtle"
        />
      </div>
    </UContainer>
  </div>
</template>
