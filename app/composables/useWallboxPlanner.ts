import type { PlannerState } from '~/types/planner'
import { computeAllSeasonResults } from '~/utils/planner/calculations'
import { createDefaultState, createVehicle } from '~/utils/planner/factory'
import type { Preset } from '~/utils/planner/presets'
import { computeComparisonResult } from '~/utils/planner/simulation'

export function useWallboxPlanner() {
  const state = useState<PlannerState>('wallbox-planner-state', () => createDefaultState())

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

  const seasonResults = computed(() => computeAllSeasonResults(state.value))
  const comparisonResult = computed(() => computeComparisonResult(state.value))

  return {
    state,
    addVehicle,
    removeVehicle,
    loadPreset,
    seasonResults,
    comparisonResult
  }
}
