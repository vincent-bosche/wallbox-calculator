<script setup lang="ts">
import type { CombustionVehicleOption, EvVehicleOption } from '~/utils/kostenvergleich/presets'
import { VEHICLE_PAIR_PRESETS } from '~/utils/kostenvergleich/presets'

const { selectVehiclePair, selectedPairId } = useKostenvergleich()
const route = useRoute()
const router = useRouter()

function onSelect(id: string | undefined) {
  const pair = VEHICLE_PAIR_PRESETS.find(p => p.id === id)
  if (!pair) return
  selectVehiclePair(pair)
  router.replace({ hash: `#${pair.slug}` })
}

onMounted(() => {
  const slug = route.hash.slice(1)
  if (!slug) return
  const pair = VEHICLE_PAIR_PRESETS.find(p => p.slug === slug)
  if (pair) selectVehiclePair(pair)
})

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

function formatVariant(vehicle: EvVehicleOption | CombustionVehicleOption) {
  const price = eur.format(vehicle.purchasePriceEur)
  return vehicle.variant ? `${vehicle.variant} · ${price}` : price
}
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-xl font-semibold text-highlighted">
        Fahrzeug-Auswahl
      </h2>
      <p class="text-sm text-muted">
        Ein Fahrzeugpaar wählen, um Kaufpreis und Verbrauch beider Seiten vorzubefüllen – danach sind die Werte frei
        anpassbar. Die Verbrauchswerte sind reale Durchschnittswerte (spritmonitor.de/ADAC Ecotest),
        keine Herstellerangaben.<br>
        Für den Vergleich wurde immer das günstigste Modell gewählt mit Serienausstattung.<br>
        Es sind keine Herstellerrabatte oder Bonuszahlungen (E-Auto Prämie) eingerechnet.
      </p>
    </div>

    <UFormField label="Fahrzeugpaar">
      <USelectMenu
        :model-value="selectedPairId"
        :items="VEHICLE_PAIR_PRESETS"
        value-key="id"
        placeholder="Fahrzeugpaar wählen…"
        class="w-full"
        @update:model-value="onSelect"
      >
        <template #item-label="{ item }">
          <div class="flex w-full items-center justify-between gap-2">
            <span class="min-w-0 flex-1 truncate">{{ item.combustion.model }}</span>
            <span class="min-w-0 flex-1 truncate text-right">{{ item.ev.model }}</span>
          </div>
        </template>
        <template #item-description="{ item }">
          <div class="flex w-full items-center justify-between gap-2 text-xs">
            <span class="min-w-0 flex-1 truncate">{{ formatVariant(item.combustion) }}</span>
            <span class="min-w-0 flex-1 truncate text-right">{{ formatVariant(item.ev) }}</span>
          </div>
        </template>
      </USelectMenu>
    </UFormField>
  </section>
</template>
