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
  consumptionWltpKwh100km: number
}

export interface CombustionVehicleOption extends Vehicle {
  consumptionL100km: number
  consumptionWltpL100km: number
  annualTaxEur: number
}

// Verbrauchswerte sind reale Durchschnittswerte (ADAC-Ecotest-Messungen),
// keine Hersteller-/WLTP-Angaben. UVP jeweils für die günstigste Motorisierung/Ausstattung (Stand 09/2026).
// Bei sehr neu eingeführten Modellen (z. B. ID.7, ID.Buzz, CLA) liegen noch keine breiten Realwerte vor -
// hier wurden die nächstliegenden verfügbaren Messwerte als Näherung verwendet.
export const EV_VEHICLE_OPTIONS: EvVehicleOption[] = [
  { id: 'id3', model: 'VW ID.3', variant: 'Neo Trend (50 kWh)', consumptionKwh100km: 19.2, consumptionWltpKwh100km: 14, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/vw/vw-id-3/', purchasePriceEur: 33995 },
  { id: 'id4', model: 'VW ID.4', variant: 'Pure (58 kWh)', consumptionKwh100km: 22.8, consumptionWltpKwh100km: 15.9, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/vw/vw-id-4/', purchasePriceEur: 40580 },
  { id: 'id7', model: 'VW ID.7', variant: 'Pro (77 kWh)', consumptionKwh100km: 18.1, consumptionWltpKwh100km: 14.6, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/vw/vw-id-7/', purchasePriceEur: 56995 },
  { id: 'id-buzz', model: 'VW ID.Buzz', variant: 'Pro (kurzer Radstand)', consumptionKwh100km: 23.3, consumptionWltpKwh100km: 19.1, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/vw/vw-id-buzz/', purchasePriceEur: 60821 },
  { id: 'corsa-electric', model: 'Opel Corsa Electric', variant: 'Edition (46 kWh)', consumptionKwh100km: 18.8, consumptionWltpKwh100km: 15.8, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/opel/opel-corsa-electric/', purchasePriceEur: 30440 },
  { id: 'astra-electric', model: 'Opel Astra Electric', variant: 'Edition (58 kWh)', consumptionKwh100km: 16.5, consumptionWltpKwh100km: 15.3, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/ecotest/details/4737/opel-astra-electric-gs/', purchasePriceEur: 37990 },
  { id: '500e', model: 'Fiat 500e', variant: 'Pop (23,8 kWh)', consumptionKwh100km: 15.9, consumptionWltpKwh100km: 13, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/fiat/fiat-500-elektro/', purchasePriceEur: 24990 },
  { id: 'cooper-e', model: 'Mini Cooper E', variant: 'Essential (40,7 kWh)', consumptionKwh100km: 17.1, consumptionWltpKwh100km: 13.8, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/mini/mini-cooper-electric/', purchasePriceEur: 32900 },
  { id: 'kona-elektro', model: 'Hyundai Kona Elektro', variant: 'Select (49 kWh)', consumptionKwh100km: 18.8, consumptionWltpKwh100km: 14.6, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/hyundai/hyundai-kona-elektro/', purchasePriceEur: 38340 },
  { id: 'r5', model: 'Renault 5 E-Tech', variant: 'Evolution (40 kWh)', consumptionKwh100km: 17.3, consumptionWltpKwh100km: 14.4, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/renault/renault-r5/', purchasePriceEur: 26290 },
  { id: 'enyaq', model: 'Skoda Enyaq', variant: 'Essence 60', consumptionKwh100km: 18.8, consumptionWltpKwh100km: 15, consumptionUrl: 'https://www.spritmonitor.de/en/overview/45-Skoda/1881-Enyaq.html', purchasePriceEur: 43490 },
  { id: 'cla-250e', model: 'Mercedes CLA 250+', variant: '', consumptionKwh100km: 13.4, consumptionWltpKwh100km: 12.3, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/mercedes-benz/mercedes-cla-test/', purchasePriceEur: 55858 },
  { id: 'ix1', model: 'BMW iX1', variant: 'eDrive20', consumptionKwh100km: 22.5, consumptionWltpKwh100km: 15.8, consumptionUrl: 'https://www.auto-motor-und-sport.de/test/bmw-ix1-edrive20-vs-vw-id-4-pro-performance-v1/technische-daten/', purchasePriceEur: 49400 },
  { id: 'a6-etron', model: 'Audi A6 e-tron', variant: 'Sportback', consumptionKwh100km: 18, consumptionWltpKwh100km: 13.6, consumptionUrl: 'https://www.firmenauto.de/fahrzeuge/pkw/test-audi-a6-e-tron-businesslimousine-mit-elektro-power/', purchasePriceEur: 62800 },
  { id: 'elroq', model: 'Skoda Elroq', variant: '50 Tour', consumptionKwh100km: 18, consumptionWltpKwh100km: 15.7, consumptionUrl: 'https://www.autohaus.de/nachrichten/fahrberichte/neuer-skoda-elroq-im-test-mit-netz-und-doppeltem-boden-3607037', purchasePriceEur: 33900 },
  { id: 'born', model: 'Cupra Born', variant: '58 kWh (190 PS)', consumptionKwh100km: 17, consumptionWltpKwh100km: 14.2, consumptionUrl: 'https://www.spritmonitor.de/en/detail/1348152.html', purchasePriceEur: 39990 },
  { id: 'tavascan', model: 'Cupra Tavascan', variant: '58 kWh (190 PS)', consumptionKwh100km: 20, consumptionWltpKwh100km: 15.4, purchasePriceEur: 49900 },
  { id: 'spring', model: 'Dacia Spring', variant: 'Expression (65 PS)', consumptionKwh100km: 16.7, consumptionWltpKwh100km: 13.2, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6497-dacia-spring-electric-65-expression/dacia-spring-electric-65-expression.pdf', purchasePriceEur: 18700 },
  { id: 'ix3', model: 'BMW iX3', variant: '40 (82,6 kWh)', consumptionKwh100km: 16.2, consumptionWltpKwh100km: 14.7, consumptionUrl: 'https://motorblock.at/2026/08/07/bmw-ix3-40-test-oesterreich/', purchasePriceEur: 63400 },
  { id: 'i4', model: 'BMW i4', variant: 'eDrive35 Gran Coupé', consumptionKwh100km: 25.5, consumptionWltpKwh100km: 14.7, consumptionUrl: 'https://www.auto-motor-und-sport.de/test/bmw-i4-edrive35-gran-coupe/technische-daten/', purchasePriceEur: 57500 },
  { id: 'i5', model: 'BMW i5', variant: 'eDrive40', consumptionKwh100km: 19.1, consumptionWltpKwh100km: 14.7, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/bmw/i5/g60-g61/328670/', purchasePriceEur: 70900 },
  { id: 'eqe', model: 'Mercedes EQE', variant: '300 Limousine', consumptionKwh100km: 20, consumptionWltpKwh100km: 15.8, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/mercedes-benz/mercedes-eqe/', purchasePriceEur: 67200 },
  { id: 'q6-etron', model: 'Audi Q6 e-tron', variant: '', consumptionKwh100km: 18.3, consumptionWltpKwh100km: 16, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6477-audi-q6-e-tron-performance/audi-q6-e-tron-performance.pdf', purchasePriceEur: 63500 },
  { id: 'e-c3', model: 'Citroën ë-C3', variant: 'You (30 kWh)', consumptionKwh100km: 19.9, consumptionWltpKwh100km: 16.5, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/AT6525_citroen-e-c3-you/citroen-e-c3-you.pdf', purchasePriceEur: 20140 },
  { id: 'grandland-electric', model: 'Opel Grandland Electric', variant: '73 kWh Edition', consumptionKwh100km: 20.2, consumptionWltpKwh100km: 17.8, consumptionUrl: 'https://assets.adac.de/image/upload/v1767076478/ADAC-eV/KOR/Text/PDF/opel-grandland-electric-long-range-97-kwh-gs_wi8khl.pdf', purchasePriceEur: 46950 },
  { id: 'puma-gen-e', model: 'Ford Puma Gen-E', variant: '46,8 kWh (168 PS)', consumptionKwh100km: 21.8, consumptionWltpKwh100km: 13.1, consumptionUrl: 'https://www.autobild.de/artikel/ford-puma-gen-e-test-28577501.html', purchasePriceEur: 36900 },
  { id: 'ioniq5', model: 'Hyundai Ioniq 5', variant: '63 kWh (170 PS)', consumptionKwh100km: 18.7, consumptionWltpKwh100km: 15.6, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/hyundai/hyundai-ioniq-5/', purchasePriceEur: 45750 },
  { id: 'tesla-model-y', model: 'Tesla Model Y', variant: 'Propulsion RWD', consumptionKwh100km: 19, consumptionWltpKwh100km: 13.1, consumptionUrl: 'https://www.autoscout24.de/informieren/testberichte/tesla/model-y/tesla-model-y-hinterradantrieb-standard-test-2026/', purchasePriceEur: 38970 },
  { id: 'byd-seal-u', model: 'BYD Seal U', variant: 'Comfort (71,8 kWh)', consumptionKwh100km: 22.2, consumptionWltpKwh100km: 19.9, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6433-byd-seal-u-design/byd-seal-u-design.pdf', purchasePriceEur: 41990 }
]

export const COMBUSTION_VEHICLE_OPTIONS: CombustionVehicleOption[] = [
  { id: 'golf', model: 'VW Golf 8', variant: '1.5 TSI Trend', consumptionL100km: 5.6, consumptionWltpL100km: 5.4, annualTaxEur: 89, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6463-vw-golf-15-tsi-life/vw-golf-15-tsi-life.pdf', purchasePriceEur: 29835 },
  { id: 'tiguan', model: 'VW Tiguan', variant: 'Trend 1.5 eTSI', consumptionL100km: 6.7, consumptionWltpL100km: 5.8, annualTaxEur: 109, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/ecotest/details/4814/vw-tiguan-1-5-etsi-opf-elegance-dsg/', purchasePriceEur: 39385 },
  { id: 'passat', model: 'VW Passat', variant: 'Variant 1.5 eTSI', consumptionL100km: 5.9, consumptionWltpL100km: 5.3, annualTaxEur: 81, consumptionUrl: 'https://www.autobild.de/artikel/vw-passat-1.5-etsi-test-25660005.html', purchasePriceEur: 42540 },
  { id: 'multivan', model: 'VW Multivan (T7)', variant: '2.0 TSI', consumptionL100km: 9.9, consumptionWltpL100km: 8.7, annualTaxEur: 242, purchasePriceEur: 57465 },
  { id: 'corsa', model: 'Opel Corsa', variant: '1.2 Turbo Edition', consumptionL100km: 5.4, consumptionWltpL100km: 5.1, annualTaxEur: 66, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/opel/opel-corsa/', purchasePriceEur: 23340 },
  { id: 'astra', model: 'Opel Astra', variant: 'Hybrid 145 PS Edition', consumptionL100km: 6, consumptionWltpL100km: 5, annualTaxEur: 60, consumptionUrl: 'https://de.motor1.com/reviews/801612/opel-astra-st-hybrid-test/', purchasePriceEur: 32990 },
  { id: '500-hybrid', model: 'Fiat 500', variant: 'Hybrid Pop 1.0 GSE', consumptionL100km: 5.3, consumptionWltpL100km: 5, annualTaxEur: 48, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/AT6049_Fiat_500_1_0_Hybrid_GSE_Launch_Edition/Fiat_500_1_0_Hybrid_GSE_Launch_Edition.pdf', purchasePriceEur: 19990 },
  { id: 'cooper-c', model: 'Mini Cooper', variant: 'C Essential', consumptionL100km: 6.5, consumptionWltpL100km: 5.9, annualTaxEur: 111, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/mini/mini-cooper-test/', purchasePriceEur: 27500 },
  { id: 'kona', model: 'Hyundai Kona', variant: '1.0 T-GDI Select', consumptionL100km: 7.5, consumptionWltpL100km: 5.7, annualTaxEur: 97, consumptionUrl: 'https://www.auto-motor-und-sport.de/test/kosten-realverbrauch-hyundai-kona-1-0-t-gdi-style/', purchasePriceEur: 27950 },
  { id: 'clio', model: 'Renault Clio', variant: 'Evolution TCe 115', consumptionL100km: 6.2, consumptionWltpL100km: 5.1, annualTaxEur: 64, consumptionUrl: 'https://autonotizen.de/fahrberichte/renault-clio-tce-115-alltag-test-video-2026', purchasePriceEur: 19900 },
  { id: 'octavia', model: 'Skoda Octavia', variant: 'Essence 1.5 TSI mHEV', consumptionL100km: 5.8, consumptionWltpL100km: 4.8, annualTaxEur: 70, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6469-skoda-octavia-combi-15-tsi-act-mhev-selection-dsg/skoda-octavia-combi-15-tsi-act-mhev-selection-dsg.pdf', purchasePriceEur: 32140 },
  { id: 'cla-180', model: 'Mercedes CLA', variant: '180 Mild-Hybrid', consumptionL100km: 5.5, consumptionWltpL100km: 4.9, annualTaxEur: 112, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/mercedes-benz/mercedes-cla-test/', purchasePriceEur: 46243 },
  { id: 'x1', model: 'BMW X1', variant: 'sDrive18i', consumptionL100km: 5.9, consumptionWltpL100km: 6.5, annualTaxEur: 141, consumptionUrl: 'https://www.adac.de/infotestrat/autodatenbank/autokatalog/detail.aspx?mid=248126&show=Autotest', purchasePriceEur: 45100 },
  { id: 'a6', model: 'Audi A6', variant: 'Limousine 2.0 TFSI', consumptionL100km: 7.4, consumptionWltpL100km: 7.3, annualTaxEur: 203, purchasePriceEur: 55500 },
  { id: 'karoq', model: 'Skoda Karoq', variant: 'Selection 1.0 TSI', consumptionL100km: 6.9, consumptionWltpL100km: 5.8, annualTaxEur: 97, consumptionUrl: 'https://www.autokostencheck.de/Skoda/Skoda-Karoq/Karoq/karoq-1-0-tsi-nu_49445/verbrauch/', purchasePriceEur: 33930 },
  { id: 'leon', model: 'Seat Leon', variant: 'Style 1.5 TSI', consumptionL100km: 6.6, consumptionWltpL100km: 5.8, annualTaxEur: 94, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/seat/leon/5f-facelift/293992/', purchasePriceEur: 28900 },
  { id: 'formentor', model: 'Cupra Formentor', variant: '1.5 TSI (150 PS)', consumptionL100km: 8.1, consumptionWltpL100km: 6.8, annualTaxEur: 116, consumptionUrl: 'https://www.auto-motor-und-sport.de/test/kosten-realverbrauch-cupra-formentor-1-5-tsi/', purchasePriceEur: 41710 },
  { id: 'sandero', model: 'Dacia Sandero', variant: 'SCe 65 Essential', consumptionL100km: 6.6, consumptionWltpL100km: 5.4, annualTaxEur: 75, consumptionUrl: 'https://www.spritmonitor.de/en/overview/113-Dacia/1122-Sandero.html?fueltype=2', purchasePriceEur: 12790 },
  { id: 'x3', model: 'BMW X3', variant: '20 xDrive', consumptionL100km: 10.4, consumptionWltpL100km: 6.9, annualTaxEur: 176, purchasePriceEur: 59400 },
  { id: '4er-gc', model: 'BMW 4er Gran Coupé', variant: '420i', consumptionL100km: 7.15, consumptionWltpL100km: 6.6, annualTaxEur: 161, consumptionUrl: 'https://www.spritmonitor.de/de/detailansicht/1001854.html', purchasePriceEur: 53900 },
  { id: '5er', model: 'BMW 5er', variant: '520i', consumptionL100km: 6.4, consumptionWltpL100km: 5.7, annualTaxEur: 113, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6555-bmw-520i-m-sportpaket-steptronic/bmw-520i-m-sportpaket-steptronic.pdf', purchasePriceEur: 60000 },
  { id: 'glc', model: 'Mercedes GLC', variant: '200 d 4MATIC', consumptionL100km: 5.88, consumptionWltpL100km: 5.1, annualTaxEur: 271, consumptionUrl: 'https://www.spritmonitor.de/en/detail/1169938.html', purchasePriceEur: 58715 },
  { id: 'e-klasse', model: 'Mercedes E-Klasse', variant: '200 d', consumptionL100km: 6.2, consumptionWltpL100km: 4.7, annualTaxEur: 247, purchasePriceEur: 58900 },
  { id: 'q5', model: 'Audi Q5', variant: '2.0 TFSI (204 PS)', consumptionL100km: 7.93, consumptionWltpL100km: 7.7, annualTaxEur: 159, consumptionUrl: 'https://www.spritmonitor.de/de/detailansicht/1398059.html', purchasePriceEur: 54100 },
  { id: 'c3', model: 'Citroën C3', variant: 'You PureTech 83', consumptionL100km: 5.75, consumptionWltpL100km: 5.5, annualTaxEur: 81, consumptionUrl: 'https://www.spritmonitor.de/en/detail/1264484.html', purchasePriceEur: 16290 },
  { id: 'grandland', model: 'Opel Grandland', variant: 'Hybrid 145', consumptionL100km: 6.9, consumptionWltpL100km: 5.6, annualTaxEur: 88, consumptionUrl: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/AT6524-opel-grandland-12-di-turbo-hybrid-gs-edct/opel-grandland-12-di-turbo-hybrid-gs-edct.pdf', purchasePriceEur: 37990 },
  { id: 'puma', model: 'Ford Puma', variant: 'Titanium 1.0 EcoBoost Hybrid', consumptionL100km: 6.1, consumptionWltpL100km: 5.4, annualTaxEur: 73, consumptionUrl: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/ford/ford-puma/', purchasePriceEur: 28900 },
  { id: 'tucson', model: 'Hyundai Tucson', variant: 'Select 1.6 T-GDI', consumptionL100km: 7.23, consumptionWltpL100km: 6.8, annualTaxEur: 166, consumptionUrl: 'https://www.spritmonitor.de/de/uebersicht/19-Hyundai/189-Tucson.html?fueltype=2&power_s=150&power_e=150&powerunit=2', purchasePriceEur: 36490 }
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
  pairPreset('eqe', 'e-klasse'),
  pairPreset('q6-etron', 'q5'),
  pairPreset('e-c3', 'c3'),
  pairPreset('grandland-electric', 'grandland'),
  pairPreset('puma-gen-e', 'puma'),
  pairPreset('ioniq5', 'tucson'),
  pairPreset('tesla-model-y', 'tiguan'),
  pairPreset('byd-seal-u', 'tiguan')
]
