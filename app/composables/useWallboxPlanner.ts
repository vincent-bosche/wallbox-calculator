import type { PlannerState } from '~/types/planner'
import { computeAllSeasonResults } from '~/utils/planner/calculations'
import { createDefaultState, createVehicle } from '~/utils/planner/factory'
import type { Preset } from '~/utils/planner/presets'
import { computeComparisonResult } from '~/utils/planner/simulation'
import { deserializePlannerState, serializePlannerState } from '~/utils/planner/urlState'

const STATE_QUERY_PARAM = 's'

export function useWallboxPlanner() {
  const state = useState<PlannerState>('wallbox-planner-state', () => createDefaultState())
  const hasRestoredFromUrl = useState('wallbox-planner-restored-from-url', () => false)
  const route = useRoute()
  const router = useRouter()

  function addVehicle() {
    const index = state.value.vehicles.length + 1
    state.value.vehicles.push(createVehicle({
      name: `Fahrzeug ${index}`,
      hasOwnConnection: false
    }))
  }

  function removeVehicle(id: string) {
    if (state.value.vehicles.length <= 1) return
    state.value.vehicles = state.value.vehicles.filter(v => v.id !== id)
  }

  function loadPreset(preset: Preset) {
    state.value = preset.state()
  }

  // Übernimmt einen geteilten Planer-Stand aus der URL (z. B. beim Öffnen eines geteilten Links).
  function restoreStateFromUrl() {
    if (hasRestoredFromUrl.value) return
    hasRestoredFromUrl.value = true

    const raw = route.query[STATE_QUERY_PARAM]
    if (typeof raw !== 'string') return
    const restored = deserializePlannerState(raw)
    if (restored) state.value = restored
  }

  // Spiegelt den aktuellen Planer-Stand in die URL, damit der Link geteilt/neu geladen werden kann.
  function syncStateToUrl() {
    router.replace({ query: { ...route.query, [STATE_QUERY_PARAM]: serializePlannerState(state.value) } })
  }

  const seasonResults = computed(() => computeAllSeasonResults(state.value))
  const comparisonResult = computed(() => computeComparisonResult(state.value))

  return {
    state,
    addVehicle,
    removeVehicle,
    loadPreset,
    restoreStateFromUrl,
    syncStateToUrl,
    seasonResults,
    comparisonResult
  }
}
