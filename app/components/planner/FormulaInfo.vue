<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <UModal :title="title" :ui="{ content: 'sm:max-w-md' }">
    <UButton
      icon="i-lucide-info"
      color="neutral"
      variant="link"
      size="xs"
      square
      :aria-label="`Berechnung anzeigen: ${title}`"
    />
    <template #body>
      <div class="space-y-2 text-sm text-muted [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-highlighted [&_strong]:text-highlighted">
        <slot />
      </div>
    </template>
  </UModal>
</template>
