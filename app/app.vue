<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'de'
  }
})

useSeoMeta({
  title: 'Wallbox-Planer',
  description: 'Finde heraus, welche Ladeleistung du für deine Wallbox wirklich brauchst – abhängig von Fahrverhalten, Fahrzeugen und PV-Anlage, getrennt nach Sommer, Übergangszeit und Winter.'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1 flex items-center gap-2 font-semibold text-highlighted"
        >
          <UIcon name="i-lucide-zap" class="size-6 text-primary" />
          Wallbox-Planer
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Wallbox-Planer • unverbindliche Orientierungshilfe, kein Ersatz für eine Elektrofachkraft
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
