<script setup lang="ts">
const connectionTypes = [
  {
    title: 'Schuko-Steckdose (bis 2,3 kW)',
    description: 'Normale Haushaltssteckdose. Nur für gelegentliches Laden geeignet – bei regelmäßiger Dauerlast besteht Überhitzungsgefahr, da haushaltsübliche Steckdosen dafür nicht ausgelegt sind. Hersteller empfehlen meist eine Ladeleistung deutlich unter dem Maximalwert und regelmäßige Kontrolle der Steckverbindung.',
    requirements: [
      'Eigene, ausschließlich für die Steckdose genutzte Zuleitung (kein Anschluss über Mehrfachsteckdosen oder Verlängerungskabel).',
      'Ladestrom auf ca. 10 A (rund 2,3 kW) begrenzt, nicht die vollen 16 A der Absicherung ausnutzen.',
      'Ladekabel bzw. Ladebox mit Temperaturüberwachung im Stecker (ICCB), die bei Überhitzung automatisch abschaltet.',
      'Steckdose und Leitung von einer Elektrofachkraft auf Zustand und Dauerlastfähigkeit prüfen und bei Bedarf erneuern lassen.',
      'Regelmäßige Sichtkontrolle auf Erwärmung, Verfärbung oder Beschädigung der Steckdose.'
    ]
  },
  {
    title: 'CEE-Steckdose ("Camping-Steckdose", 3,7–22 kW)',
    description: 'Blaue (einphasig, 3,7 kW) oder rote (dreiphasig, bis 22 kW) Industriesteckdose. Höhere Leistung als Schuko, aber die Steckverbindung ist ebenfalls nicht für dauerhafte hohe Lasten zertifiziert und daher nur als Übergangslösung empfehlenswert.'
  },
  {
    title: 'Festinstallierte Wallbox mit Typ-2-Anschluss (11 oder 22 kW)',
    description: 'Die empfohlene Lösung fürs regelmäßige Laden. Bringt eigene Sicherheitstechnik mit (Fehlerstromschutz, Lastüberwachung) und lässt sich mit Lademanagement sowie PV-Kopplung (Smart Charging) kombinieren.'
  }
]
</script>

<template>
  <UCard>
    <UCollapsible>
      <UButton
        label="Anschlussarten & Installation"
        icon="i-lucide-plug-zap"
        trailing-icon="i-lucide-chevron-down"
        color="neutral"
        variant="ghost"

        block
      />
      <template #content>
        <div class="space-y-6 pt-4 text-sm text-muted">
          <section class="space-y-3">
            <h3 class="font-medium text-highlighted">
              Die drei Anschlussarten
            </h3>
            <div v-for="type in connectionTypes" :key="type.title" class="space-y-1">
              <p class="font-medium text-highlighted">
                {{ type.title }}
              </p>
              <p>{{ type.description }}</p>
              <template v-if="type.requirements">
                <p class="pt-1 font-medium text-highlighted">
                  Voraussetzungen für dauerhafte Nutzung:
                </p>
                <ul class="list-disc space-y-1 pl-5">
                  <li v-for="requirement in type.requirements" :key="requirement">
                    {{ requirement }}
                  </li>
                </ul>
              </template>
            </div>
          </section>

          <section class="space-y-1">
            <h3 class="font-medium text-highlighted">
              Anmeldung & Genehmigung
            </h3>
            <p>
              Eine Wallbox mit einer Leistung von mehr al 3,7 kW mit einschließlich 11 kW muss vor Installation beim Netzbetreiber <strong>angemeldet</strong> werden.
              Bei Wallboxen über 11kW muss diese vom Netzbetreiber vorher <strong>genehmigt</strong> werden.
              Im Zweifel lohnt sich eine kurze Nachfrage beim örtlichen Netzbetreiber. Für Wallboxen über
              4,2 kW kann der Netzbetreiber im Rahmen von §14a EnWG eine steuerbare Ausführung verlangen.
            </p>
          </section>

          <section class="space-y-1">
            <h3 class="font-medium text-highlighted">
              Wer installieren darf
            </h3>
            <p>
              Der elektrische Anschluss darf nur von einer Elektrofachkraft bzw. einem beim örtlichen Netzbetreiber
              eingetragenen Installationsbetrieb vorgenommen werden. Eine Eigeninstallation ist unzulässig und kann
              Versicherungsschutz sowie Herstellergarantie gefährden.
            </p>
          </section>

          <section class="space-y-1">
            <h3 class="font-medium text-highlighted">
              Worauf du achten solltest
            </h3>
            <ul class="list-disc space-y-1 pl-5">
              <li>Ausreichende Absicherung und Kabelquerschnitt für die gewählte Ladeleistung.</li>
              <li>
                Fehlerstromschutz: FI-Schutzschalter Typ B oder Typ A mit zusätzlichem
                DC-Fehlerstromerkennungsmodul (RDC-DD), da Ladevorgänge Gleichfehlerströme verursachen können.
              </li>
              <li>Kapazität des Hausanschlusses prüfen, besonders bei mehreren Wallboxen oder mit Wärmepumpe.</li>
              <li>Bei mehreren Ladepunkten: Lastmanagement einplanen, um eine Überlastung zu vermeiden.</li>
              <li>Für PV-Kopplung/Smart Charging: kompatible Schnittstelle zu Wechselrichter bzw. Energiemanagement prüfen (z. B. Modbus, OCPP, Herstellerprotokoll).</li>
              <li>Bei gewerblicher Abrechnung (Firmenwagen, Vermietung): eichrechtskonforme Messeinrichtung erforderlich.</li>
            </ul>
          </section>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>
