import type { PlannerState } from '~/types/planner'
import { createAbsenceSlot, createVehicle } from './factory'

export interface Preset {
  id: string
  title: string
  description: string
  icon: string
  state: () => PlannerState
}

export const PRESETS: Preset[] = [
  {
    id: 'commuter-no-pv',
    title: 'Klassischer Pendler',
    description: '1 Fahrzeug, 40 km/Tag, keine PV – typischer Feierabend-Lader.',
    icon: 'i-lucide-briefcase',
    state: () => ({
      vehicles: [
        createVehicle({
          name: 'Pendler',
          consumptionKwh100km: 18,
          dailyDistanceKm: 40,
          hasOwnConnection: true,
          absenceSlots: [createAbsenceSlot('08:00', '17:00')]
        })
      ],
      pv: { enabled: false, kwp: 6, orientation: 'south', batteryKwh: 0 },
      household: { profile: 'medium', customDailyKwh: 10 },
      electricityPriceCtPerKwh: 32
    })
  },
  {
    id: 'two-vehicles-shared',
    title: 'Zwei Fahrzeuge, ein Anschluss',
    description: 'Pendler + Zweitwagen ohne eigenen Anschluss, teilen sich eine Wallbox.',
    icon: 'i-lucide-users',
    state: () => ({
      vehicles: [
        createVehicle({
          name: 'Fahrzeug A (Pendler)',
          consumptionKwh100km: 18,
          dailyDistanceKm: 60,
          hasOwnConnection: true,
          absenceSlots: [createAbsenceSlot('08:00', '17:00')]
        }),
        createVehicle({
          name: 'Fahrzeug B (Zweitwagen)',
          consumptionKwh100km: 16,
          dailyDistanceKm: 15,
          hasOwnConnection: false,
          absenceSlots: [createAbsenceSlot('08:00', '08:30'), createAbsenceSlot('14:00', '14:30')]
        })
      ],
      pv: { enabled: false, kwp: 6, orientation: 'south', batteryKwh: 0 },
      household: { profile: 'medium', customDailyKwh: 10 },
      electricityPriceCtPerKwh: 32
    })
  },
  {
    id: 'field-sales-pv',
    title: 'Vielfahrer im Außendienst mit PV',
    description: '150 km/Tag, nur abends zuhause, PV 9 kWp ohne Speicher.',
    icon: 'i-lucide-car',
    state: () => ({
      vehicles: [
        createVehicle({
          name: 'Außendienst-Fahrzeug',
          consumptionKwh100km: 22,
          dailyDistanceKm: 150,
          hasOwnConnection: true,
          absenceSlots: [createAbsenceSlot('07:30', '19:00')]
        })
      ],
      pv: { enabled: true, kwp: 9, orientation: 'south', batteryKwh: 0 },
      household: { profile: 'medium', customDailyKwh: 10 },
      electricityPriceCtPerKwh: 32
    })
  },
  {
    id: 'home-office-pv-battery',
    title: 'Homeoffice/Rentner mit Speicher',
    description: 'Viel Zuhause-Zeit, PV 8 kWp Ost-West mit 10-kWh-Speicher.',
    icon: 'i-lucide-house',
    state: () => ({
      vehicles: [
        createVehicle({
          name: 'Fahrzeug',
          consumptionKwh100km: 16,
          dailyDistanceKm: 25,
          hasOwnConnection: true,
          absenceSlots: [createAbsenceSlot('10:00', '11:00')]
        })
      ],
      pv: { enabled: true, kwp: 8, orientation: 'east-west', batteryKwh: 10 },
      household: { profile: 'medium', customDailyKwh: 10 },
      electricityPriceCtPerKwh: 32
    })
  },
  {
    id: 'terraced-house-small-pv',
    title: 'Reihenhaus, kleine PV',
    description: '50 km/Tag, PV 4 kWp Flachdach – Winter-Grenzfall.',
    icon: 'i-lucide-sun',
    state: () => ({
      vehicles: [
        createVehicle({
          name: 'Fahrzeug',
          consumptionKwh100km: 20,
          dailyDistanceKm: 50,
          hasOwnConnection: true,
          absenceSlots: [createAbsenceSlot('08:00', '16:30')]
        })
      ],
      pv: { enabled: true, kwp: 4, orientation: 'flat', batteryKwh: 0 },
      household: { profile: 'medium', customDailyKwh: 10 },
      electricityPriceCtPerKwh: 32
    })
  },
  {
    id: 'two-vehicles-bottleneck',
    title: 'Geteilter Anschluss, beide Vielfahrer',
    description: 'Zwei Vielfahrer an einem Anschluss – möglicher Engpass.',
    icon: 'i-lucide-triangle-alert',
    state: () => ({
      vehicles: [
        createVehicle({
          name: 'Fahrzeug A',
          consumptionKwh100km: 18,
          dailyDistanceKm: 80,
          hasOwnConnection: true,
          absenceSlots: [createAbsenceSlot('08:00', '17:00')]
        }),
        createVehicle({
          name: 'Fahrzeug B',
          consumptionKwh100km: 18,
          dailyDistanceKm: 70,
          hasOwnConnection: false,
          absenceSlots: [createAbsenceSlot('08:00', '17:00')]
        })
      ],
      pv: { enabled: false, kwp: 6, orientation: 'south', batteryKwh: 0 },
      household: { profile: 'medium', customDailyKwh: 10 },
      electricityPriceCtPerKwh: 32
    })
  }
]
