<script setup lang="ts">
const faqItems = [
  { label: 'Wann lohnt sich eine Wallbox und wann nicht?', slot: 'lohnt-sich' as const },
  { label: 'Benötige ich eine 3,7 kW, 11 kW oder 22 kW Wallbox?', slot: 'leistung' as const },
  { label: 'Welche Vorteile bietet eine Wallbox mit Überschussladen?', slot: 'ueberschuss' as const }
]
</script>

<template>
  <section class="space-y-4">
    <USeparator />
    <h2 class="text-3xl font-semibold text-highlighted">
      Häufige Fragen
    </h2>

    <UAccordion :items="faqItems">
      <template #lohnt-sich-body>
        <div class="space-y-3 text-sm text-muted">
          <p>
            Kommt drauf an, wie und wo geladen wird - der Rechner oben zeigt es konkret für die eigene
            Situation (siehe Badges „Gedeckt/Knapp/Engpass" im Ergebnis).
          </p>
          <p class="font-medium text-highlighted">
            Lohnt sich eher:
          </p>
          <ul class="list-disc space-y-1 pl-5">
            <li>Regelmäßiges Laden zuhause (täglich oder mehrmals pro Woche), nicht nur gelegentlich.</li>
            <li>Fahrleistung/Zeitfenster, bei denen eine Schuko-Steckdose (2,3 kW) zu lange braucht oder an ihre Dauerlastgrenze kommt.</li>
            <li>Eigener Stellplatz mit Zugang zum Hausanschluss.</li>
            <li>Vorhandene oder geplante PV-Anlage, die per Überschussladen genutzt werden soll.</li>
          </ul>
          <p class="font-medium text-highlighted">
            Lohnt sich eher nicht:
          </p>
          <ul class="list-disc space-y-1 pl-5">
            <li>Das Fahrzeug lädt überwiegend woanders (Arbeitgeber, öffentliche Ladesäule).</li>
            <li>Sehr geringe Fahrleistung mit viel Standzeit zuhause - dann reicht eine (fachgerecht geprüfte) Schuko-Steckdose oft aus.</li>
            <li>
              Bauliche/rechtliche Hürden machen die Installation unverhältnismäßig teuer (z. B. fehlende
              Eigentümerzustimmung im Mehrfamilienhaus, sehr weiter Weg zum Zählerschrank).
            </li>
          </ul>
        </div>
      </template>

      <template #leistung-body>
        <div class="space-y-3 text-sm text-muted">
          <p>
            Genau das berechnet der Rechner oben ("Ergebnis") - je Saison einzeln, abhängig von
            Fahrzeugen, Abwesenheitszeiten und PV-Anlage. Als grobe Richtwerte:
          </p>
          <ul class="list-disc space-y-1 pl-5">
            <li><strong class="text-highlighted">2,3 kW (Schuko):</strong> nur als Notlösung bzw. für gelegentliches Laden - siehe Hinweise zur Dauerlastfähigkeit oben.</li>
            <li><strong class="text-highlighted">3,7 kW (einphasig):</strong> reicht oft für ein Fahrzeug mit moderater Tagesfahrleistung, wenn über Nacht bzw. mehrere Stunden geladen werden kann.</li>
            <li><strong class="text-highlighted">11 kW (dreiphasig):</strong> guter Standard-Kompromiss für die meisten Ein- und Zweifamilienhäuser - deutlich schnelleres Laden, aber noch unterhalb der Genehmigungspflicht-Grenze (nur Anmeldung beim Netzbetreiber nötig). Sinnvoll bei kürzeren Zeitfenstern, Vielfahrern oder mehreren Fahrzeugen an einem gemeinsamen Anschluss.</li>
            <li><strong class="text-highlighted">22 kW:</strong> nur relevant, wenn das Fahrzeug diese Leistung überhaupt annehmen kann (siehe „Max. AC-Ladeleistung Fahrzeug" bei den Fahrzeug-Angaben) und/oder bei sehr kurzen Ladefenstern bzw. hohem Bedarf mehrerer Fahrzeuge - erfordert vorherige Genehmigung durch den Netzbetreiber.</li>
          </ul>
          <p>
            Faustregel: mehr kW hilft nur, wenn das gewählte Zeitfenster (bzw. der PV-Überschuss beim
            Smart Charging) die zusätzliche Leistung auch tatsächlich abrufen kann - siehe dazu auch die
            „Zum Vergleich"-Werte im Ergebnis und im Naiv-vs-Smart-Vergleich.
          </p>
        </div>
      </template>

      <template #ueberschuss-body>
        <div class="space-y-3 text-sm text-muted">
          <ul class="list-disc space-y-1 pl-5">
            <li>Höherer PV-Eigenverbrauch statt Einspeisung zu meist niedrigerer Vergütung.</li>
            <li>Geringere Stromkosten, da mehr Ladeenergie aus eigenem Solarstrom statt aus dem Netz kommt (siehe „Kostenersparnis durch Smart" im Vergleich oben).</li>
            <li>Lädt automatisch dann, wenn Überschuss verfügbar ist - kein manuelles Timing nötig, die Ladung wird bei Bedarf bis zum nächsten PV-Fenster verschoben.</li>
            <li>Kombinierbar mit einem Hausakku: Der Speicher deckt zuerst die Haushalts-Nachtreserve, darüber hinaus steht er zusätzlich dem Auto zur Verfügung.</li>
          </ul>
          <p>
            Wichtig: Es gibt dabei keinen festen Leistungsdeckel - die tatsächliche Ladeleistung schwankt
            stundenweise mit dem gerade verfügbaren PV-Überschuss (siehe „Genutzt (smart)" im
            Tagesverlauf-Diagramm oben). Der Vorteil ist besonders groß, wenn das Fahrzeug tagsüber
            zuhause steht statt nur abends/nachts.
          </p>
          <p class="font-medium text-highlighted">
            Nachteil:
          </p>
          <p>
            Damit Überschussladen funktioniert, muss das Fahrzeug während der gesamten geplanten Ladezeit
            angeschlossen bleiben - im Gegensatz zum naiven Laden (sofort volle Leistung, dafür meist
            schneller fertig) kann sich das Laden bis zum nächsten PV-Fenster hinziehen. Bei kurzen
            Standzeiten oder wenn das Auto zwischendurch wieder gebraucht wird, sollte deshalb ausreichend
            Puffer (Abwesenheits-Slots oben) eingeplant werden.
          </p>
        </div>
      </template>
    </UAccordion>
  </section>
</template>
