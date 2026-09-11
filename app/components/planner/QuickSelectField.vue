<script setup lang="ts">
const props = withDefaults(defineProps<{
  options: number[]
  unit?: string
  min?: number
  max?: number
  step?: number
}>(), {
  unit: '',
  min: 0,
  max: 1000,
  step: 1
})

const modelValue = defineModel<number>({ required: true })

const isCustom = computed(() => !props.options.includes(modelValue.value))

function formatOption(value: number) {
  return props.unit ? `${value} ${props.unit}` : `${value}`
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <UButton
      v-for="option in options"
      :key="option"
      :label="formatOption(option)"
      size="sm"
      :color="!isCustom && modelValue === option ? 'primary' : 'neutral'"
      :variant="!isCustom && modelValue === option ? 'solid' : 'outline'"
      @click="modelValue = option"
    />
    <UInputNumber
      v-model="modelValue"
      :min="min"
      :max="max"
      :step="step"
      locale="de-DE"
      size="sm"
      class="w-32"
      :class="isCustom && 'ring-2 ring-primary rounded-md'"
      :aria-label="`Eigener Wert${unit ? ` (${unit})` : ''}`"
    />
  </div>
</template>
