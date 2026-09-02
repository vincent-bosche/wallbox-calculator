<script setup lang="ts">
import { getSharedConnectionHint } from '~/utils/planner/calculations'

const { state, addVehicle, removeVehicle } = useWallboxPlanner()

const sharedConnectionHint = computed(() => getSharedConnectionHint(state.value.vehicles))
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-highlighted">
        Fahrzeuge
      </h2>
      <UButton
        label="Fahrzeug hinzufügen"
        icon="i-lucide-plus"
        color="neutral"
        variant="subtle"
        size="sm"
        @click="addVehicle"
      />
    </div>

    <UAlert
      v-if="sharedConnectionHint"
      icon="i-lucide-share-2"
      color="warning"
      variant="subtle"
      :title="sharedConnectionHint"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <VehicleCard
        v-for="vehicle in state.vehicles"
        :key="vehicle.id"
        :vehicle="vehicle"
        :removable="state.vehicles.length > 1"
        @remove="removeVehicle(vehicle.id)"
      />
    </div>
  </section>
</template>
