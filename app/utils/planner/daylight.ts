export interface DaylightRange {
  start: number
  end: number
}

// Erste bis letzte Stunde mit PV-Erzeugung > 0 (Sonnenaufgang/-untergang), zur Begrenzung der
// Tagesverlaufs-Diagramme auf den relevanten Bereich statt voller 24 h.
export function computeDaylightRange(pvGenKwh: number[]): DaylightRange {
  const litHours = pvGenKwh
    .map((v, h) => ({ v, h }))
    .filter(({ v }) => v > 0.0001)
    .map(({ h }) => h)
  if (litHours.length === 0) return { start: 6, end: 18 }
  return { start: litHours[0]!, end: litHours[litHours.length - 1]! }
}
