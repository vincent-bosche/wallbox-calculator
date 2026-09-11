export interface Vehicle {
  id: string
  model: string
  variant: string
  purchasePriceEur: number
  power?: number // ps
  purchaseUrl?: string;
  consumptionUrl?: string;
}
export interface EvVehicleOption extends Vehicle {
  consumptionKwh100km: number
}

export interface CombustionVehicleOption extends Vehicle {
  consumptionL100km: number
}

// Verbrauchswerte sind reale Durchschnittswerte (spritmonitor.de-Nutzerdaten bzw. ADAC-Ecotest-Messungen),
// keine Hersteller-/WLTP-Angaben. UVP jeweils für die günstigste Motorisierung/Ausstattung (Stand 09/2026).
// Bei sehr neu eingeführten Modellen (z. B. ID.7, ID.Buzz, CLA) liegen noch keine breiten Realwerte vor -
// hier wurden die nächstliegenden verfügbaren Messwerte als Näherung verwendet.
export const EV_VEHICLE_OPTIONS: EvVehicleOption[] = [
  { id: 'id3', model: 'VW ID.3', variant: 'Neo Trend (50 kWh)', consumptionKwh100km: 18, purchasePriceEur: 33995 },
  { id: 'id4', model: 'VW ID.4', variant: 'Pure (58 kWh)', consumptionKwh100km: 20, purchasePriceEur: 40580 },
  { id: 'id7', model: 'VW ID.7', variant: 'Pro (77 kWh)', consumptionKwh100km: 19, purchasePriceEur: 56995 },
  { id: 'id-buzz', model: 'VW ID.Buzz', variant: 'Pro (kurzer Radstand)', consumptionKwh100km: 23.8, purchasePriceEur: 60821 },
  { id: 'corsa-electric', model: 'Opel Corsa Electric', variant: 'Edition (46 kWh)', consumptionKwh100km: 18.8, purchasePriceEur: 30440 },
  { id: 'astra-electric', model: 'Opel Astra Electric', variant: 'Edition (58 kWh)', consumptionKwh100km: 18.8, purchasePriceEur: 37990 },
  { id: '500e', model: 'Fiat 500e', variant: 'Pop (23,8 kWh)', consumptionKwh100km: 18, purchasePriceEur: 24990 },
  { id: 'cooper-e', model: 'Mini Cooper E', variant: 'Essential (40,7 kWh)', consumptionKwh100km: 16.8, purchasePriceEur: 32900 },
  { id: 'kona-elektro', model: 'Hyundai Kona Elektro', variant: 'Select (49 kWh)', consumptionKwh100km: 16.7, purchasePriceEur: 38340 },
  { id: 'r5', model: 'Renault 5 E-Tech', variant: 'Evolution (40 kWh)', consumptionKwh100km: 17.9, purchasePriceEur: 26290 },
  { id: 'enyaq', model: 'Skoda Enyaq', variant: 'Essence 60', consumptionKwh100km: 18.9, purchasePriceEur: 43490 },
  { id: 'cla-250e', model: 'Mercedes CLA 250+', variant: '', consumptionKwh100km: 17.8, purchasePriceEur: 55858 },
  { id: 'ix1', model: 'BMW iX1', variant: 'eDrive20', consumptionKwh100km: 17.4, purchasePriceEur: 49400 },
  { id: 'a6-etron', model: 'Audi A6 e-tron', variant: 'Sportback', consumptionKwh100km: 21.2, purchasePriceEur: 62800 },
  { id: 'elroq', model: 'Skoda Elroq', variant: '50 Tour', consumptionKwh100km: 18.8, purchasePriceEur: 33900 },
  { id: 'born', model: 'Cupra Born', variant: '58 kWh (190 PS)', consumptionKwh100km: 18, purchasePriceEur: 39990 },
  { id: 'tavascan', model: 'Cupra Tavascan', variant: '58 kWh (190 PS)', consumptionKwh100km: 20, purchasePriceEur: 49900 },
  { id: 'spring', model: 'Dacia Spring', variant: 'Expression (65 PS)', consumptionKwh100km: 14.4, purchasePriceEur: 18700 },
  { id: 'ix3', model: 'BMW iX3', variant: '40 (82,6 kWh)', consumptionKwh100km: 18.3, purchasePriceEur: 63400 },
  { id: 'i4', model: 'BMW i4', variant: 'eDrive35 Gran Coupé', consumptionKwh100km: 19.3, purchasePriceEur: 57500 },
  { id: 'i5', model: 'BMW i5', variant: 'eDrive40', consumptionKwh100km: 22.5, purchasePriceEur: 70900 },
  { id: 'glc-eq', model: 'Mercedes GLC mit EQ Technologie', variant: '250 EQ', consumptionKwh100km: 23, purchasePriceEur: 64736 },
  { id: 'eqe', model: 'Mercedes EQE', variant: '300 Limousine', consumptionKwh100km: 21.3, purchasePriceEur: 67200 },
  { id: 'q6-etron', model: 'Audi Q6 e-tron', variant: '', consumptionKwh100km: 23.8, purchasePriceEur: 63500 },
  { id: 'e-c3', model: 'Citroën ë-C3', variant: 'You (30 kWh)', consumptionKwh100km: 18.5, purchasePriceEur: 20140 },
  { id: 'grandland-electric', model: 'Opel Grandland Electric', variant: '73 kWh Edition', consumptionKwh100km: 23, purchasePriceEur: 46950 },
  { id: 'puma-gen-e', model: 'Ford Puma Gen-E', variant: '46,8 kWh (168 PS)', consumptionKwh100km: 16.3, purchasePriceEur: 36900 },
  { id: 'ioniq5', model: 'Hyundai Ioniq 5', variant: '63 kWh (170 PS)', consumptionKwh100km: 18.7, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/hyundai/hyundai-ioniq-5/', purchasePriceEur: 45750 },
  { id: 'tesla-model-y', model: 'Tesla Model Y', variant: 'Propulsion RWD', consumptionKwh100km: 18.8, purchasePriceEur: 38970 },
  { id: 'byd-seal-u', model: 'BYD Seal U', variant: 'Comfort (71,8 kWh)', consumptionKwh100km: 23.8, purchasePriceEur: 41990 }
]

export const COMBUSTION_VEHICLE_OPTIONS: CombustionVehicleOption[] = [
  { id: 'golf', model: 'VW Golf 8', variant: '1.5 TSI Trend', consumptionL100km: 5.6, purchasePriceEur: 29835 },
  { id: 'tiguan', model: 'VW Tiguan', variant: 'Trend 1.5 eTSI', consumptionL100km: 6.7, purchasePriceEur: 39385 },
  { id: 'passat', model: 'VW Passat', variant: 'Variant 1.5 eTSI', consumptionL100km: 6.5, purchasePriceEur: 42540 },
  { id: 'multivan', model: 'VW Multivan (T7)', variant: '2.0 TSI', consumptionL100km: 9.9, purchasePriceEur: 57465 },
  { id: 'corsa', model: 'Opel Corsa', variant: '1.2 Turbo Edition', consumptionL100km: 6.7, purchasePriceEur: 23340 },
  { id: 'astra', model: 'Opel Astra', variant: 'Hybrid 145 PS Edition', consumptionL100km: 7.5, purchasePriceEur: 32990 },
  { id: '500-hybrid', model: 'Fiat 500', variant: 'Hybrid Pop 1.0 GSE', consumptionL100km: 5.5, purchasePriceEur: 19990 },
  { id: 'cooper-c', model: 'Mini Cooper', variant: 'C Essential', consumptionL100km: 7.3, purchasePriceEur: 27500 },
  { id: 'kona', model: 'Hyundai Kona', variant: '1.0 T-GDI Select', consumptionL100km: 7.4, purchasePriceEur: 27950 },
  { id: 'clio', model: 'Renault Clio', variant: 'Evolution TCe 115', consumptionL100km: 6.5, purchasePriceEur: 19900 },
  { id: 'octavia', model: 'Skoda Octavia', variant: 'Essence 1.5 TSI mHEV', consumptionL100km: 6.9, purchasePriceEur: 32140 },
  { id: 'cla-180', model: 'Mercedes CLA', variant: '180 Mild-Hybrid', consumptionL100km: 5.5, purchasePriceEur: 46243 },
  { id: 'x1', model: 'BMW X1', variant: 'sDrive18i', consumptionL100km: 9.7, purchasePriceEur: 45100 },
  { id: 'a6', model: 'Audi A6', variant: 'Limousine 2.0 TFSI', consumptionL100km: 7.4, purchasePriceEur: 55500 },
  { id: 'karoq', model: 'Skoda Karoq', variant: 'Selection 1.0 TSI', consumptionL100km: 7.1, purchasePriceEur: 33930 },
  { id: 'leon', model: 'Seat Leon', variant: 'Style 1.5 TSI', consumptionL100km: 7.7, purchasePriceEur: 28900 },
  { id: 'formentor', model: 'Cupra Formentor', variant: '1.5 TSI (150 PS)', consumptionL100km: 8, purchasePriceEur: 41710 },
  { id: 'sandero', model: 'Dacia Sandero', variant: 'SCe 65 Essential', consumptionL100km: 6.6, purchasePriceEur: 12790 },
  { id: 'x3', model: 'BMW X3', variant: '20 xDrive', consumptionL100km: 10.4, purchasePriceEur: 59400 },
  { id: '4er-gc', model: 'BMW 4er Gran Coupé', variant: '420i', consumptionL100km: 8.8, purchasePriceEur: 53900 },
  { id: '5er', model: 'BMW 5er', variant: '520i', consumptionL100km: 8.1, purchasePriceEur: 60000 },
  { id: 'glc', model: 'Mercedes GLC', variant: '200 d 4MATIC', consumptionL100km: 6.8, purchasePriceEur: 58715 },
  { id: 'e-klasse', model: 'Mercedes E-Klasse', variant: '200 d', consumptionL100km: 6.2, purchasePriceEur: 58900 },
  { id: 'q5', model: 'Audi Q5', variant: '2.0 TFSI (204 PS)', consumptionL100km: 9, purchasePriceEur: 54100 },
  { id: 'c3', model: 'Citroën C3', variant: 'You PureTech 83', consumptionL100km: 7.1, purchasePriceEur: 16290 },
  { id: 'grandland', model: 'Opel Grandland', variant: 'Hybrid 145', consumptionL100km: 7.4, purchasePriceEur: 37990 },
  { id: 'puma', model: 'Ford Puma', variant: 'Titanium 1.0 EcoBoost Hybrid', consumptionL100km: 6.7, purchasePriceEur: 28900 },
  { id: 'tucson', model: 'Hyundai Tucson', variant: 'Select 1.6 T-GDI', consumptionL100km: 7.23, consumptionUrl: 'https://www.spritmonitor.de/de/uebersicht/19-Hyundai/189-Tucson.html?fueltype=2&power_s=150&power_e=150&powerunit=2', purchasePriceEur: 36490 }
]

function findEv(id: string): EvVehicleOption {
  return EV_VEHICLE_OPTIONS.find(v => v.id === id)!
}

function findCombustion(id: string): CombustionVehicleOption {
  return COMBUSTION_VEHICLE_OPTIONS.find(v => v.id === id)!
}

export interface VehiclePairPreset {
  id: string
  slug: string
  label: string
  ev: EvVehicleOption
  combustion: CombustionVehicleOption
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function pairPreset(evId: string, combustionId: string): VehiclePairPreset {
  const ev = findEv(evId)
  const combustion = findCombustion(combustionId)
  return {
    id: `${combustionId}-${evId}`,
    slug: `${slugify(combustion.model)}-gegen-${slugify(ev.model)}-vergleich`,
    label: `${combustion.model} vs. ${ev.model}`,
    ev,
    combustion
  }
}

export const VEHICLE_PAIR_PRESETS: VehiclePairPreset[] = [
  pairPreset('id3', 'golf'),
  pairPreset('id4', 'tiguan'),
  pairPreset('id7', 'passat'),
  pairPreset('id-buzz', 'multivan'),
  pairPreset('corsa-electric', 'corsa'),
  pairPreset('astra-electric', 'astra'),
  pairPreset('500e', '500-hybrid'),
  pairPreset('cooper-e', 'cooper-c'),
  pairPreset('kona-elektro', 'kona'),
  pairPreset('r5', 'clio'),
  pairPreset('enyaq', 'octavia'),
  pairPreset('cla-250e', 'cla-180'),
  pairPreset('ix1', 'x1'),
  pairPreset('a6-etron', 'a6'),
  pairPreset('elroq', 'karoq'),
  pairPreset('born', 'leon'),
  pairPreset('tavascan', 'formentor'),
  pairPreset('spring', 'sandero'),
  pairPreset('ix3', 'x3'),
  pairPreset('i4', '4er-gc'),
  pairPreset('i5', '5er'),
  pairPreset('glc-eq', 'glc'),
  pairPreset('eqe', 'e-klasse'),
  pairPreset('q6-etron', 'q5'),
  pairPreset('e-c3', 'c3'),
  pairPreset('grandland-electric', 'grandland'),
  pairPreset('puma-gen-e', 'puma'),
  pairPreset('ioniq5', 'tucson'),
  pairPreset('tesla-model-y', 'tiguan'),
  pairPreset('byd-seal-u', 'tiguan')
]
