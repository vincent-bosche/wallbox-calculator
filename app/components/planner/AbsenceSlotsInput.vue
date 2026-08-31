<script setup lang="ts">
import type { AbsenceSlot } from '~/types/planner'
import { createAbsenceSlot } from '~/utils/planner/factory'

const slots = defineModel<AbsenceSlot[]>({ required: true })

function addSlot() {
  slots.value = [...slots.value, createAbsenceSlot('08:00', '17:00')]
}

function removeSlot(id: string) {
  slots.value = slots.value.filter(slot => slot.id !== id)
}
</script>

<template>
  <div class="space-y-2">
    <div v-for="slot in slots" :key="slot.id" class="flex items-center gap-2">
      <UInput v-model="slot.start" type="time" size="sm" class="w-32" />
      <span class="text-muted text-sm">bis</span>
      <UInput v-model="slot.end" type="time" size="sm" class="w-32" />
      <UButton
        icon="i-lucide-trash-2"
        color="neutral"
        variant="ghost"
        size="sm"
        :disabled="slots.length <= 1"
        aria-label="Zeitraum entfernen"
        @click="removeSlot(slot.id)"
      />
    </div>
    <UButton
      icon="i-lucide-plus"
      label="Zeitraum hinzufügen"
      color="neutral"
      variant="subtle"
      size="sm"
      @click="addSlot"
    />
  </div>
</template>
