import type { AbsenceSlot } from '~/types/planner'

const MINUTES_PER_DAY = 1440

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return ((hours % 24) * 60 + (minutes || 0)) % MINUTES_PER_DAY
}

function markAway(minuteMask: boolean[], slot: AbsenceSlot) {
  const start = timeToMinutes(slot.start)
  const end = timeToMinutes(slot.end)
  if (end === start) return
  if (end > start) {
    for (let m = start; m < end; m++) minuteMask[m] = true
  } else {
    // Slot reicht über Mitternacht hinweg.
    for (let m = start; m < MINUTES_PER_DAY; m++) minuteMask[m] = true
    for (let m = 0; m < end; m++) minuteMask[m] = true
  }
}

export function buildAwayMask(slots: AbsenceSlot[]): boolean[] {
  const mask = new Array(MINUTES_PER_DAY).fill(false)
  slots.forEach(slot => markAway(mask, slot))
  return mask
}

// Home-Zeitfenster, in dem mindestens eines der übergebenen Fahrzeuge zuhause ist
// (= Zeitfenster, das für einen geteilten Anschluss zur Verfügung steht).
export function groupHomeWindowHours(slotsList: AbsenceSlot[][]): number {
  if (slotsList.length === 0) return 24
  const masks = slotsList.map(buildAwayMask)
  let awayForAllMinutes = 0
  for (let m = 0; m < MINUTES_PER_DAY; m++) {
    if (masks.every(mask => mask[m])) awayForAllMinutes++
  }
  return 24 - awayForAllMinutes / 60
}

export function homeWindowHours(slots: AbsenceSlot[]): number {
  return groupHomeWindowHours([slots])
}

// Stundenraster (24 Einträge) für die Simulation: eine Stunde gilt als "zuhause",
// wenn das Fahrzeug in weniger als der halben Stunde abwesend war.
export function hourlyHomeMask(slots: AbsenceSlot[]): boolean[] {
  const minuteMask = buildAwayMask(slots)
  const hours: boolean[] = []
  for (let h = 0; h < 24; h++) {
    const awayMinutes = minuteMask.slice(h * 60, h * 60 + 60).filter(Boolean).length
    hours.push(awayMinutes < 30)
  }
  return hours
}
