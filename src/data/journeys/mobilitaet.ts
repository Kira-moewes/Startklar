import type { Journey } from '../types'

export const mobilitaetJourney: Journey = {
  id: 'mobilitaet',
  title: 'Mobilität',
  subtitle: 'Führerschein, erstes Auto und alles drumherum.',
  tasks: [
    {
      id: 'fuehrerschein-fristen',
      title: 'Führerschein: Fristen im Blick',
      summary: 'Von der Anmeldung in der Fahrschule bis zur Prüfung gibt es ein paar Fristen, die du kennen solltest — damit nichts verfällt.',
      steps: [
        'Vor dem Antrag: Sehtest (Optiker/Augenarzt, gilt 2 Jahre) und einen Erste-Hilfe-Kurs (läuft nicht ab) machen – beide Nachweise brauchst du für die Anmeldung.',
        'Antrag auf Fahrerlaubnis bei der Führerscheinstelle stellen (oft schon 6 Monate vorher möglich, damit du pünktlich starten kannst).',
        'Schon mit 17: Begleitetes Fahren (BF17) – Theorie und Praxis wie üblich, danach fährst du mit eingetragenen Begleitpersonen, bis du 18 wirst.',
        'Nach bestandener Theorieprüfung hast du 12 Monate Zeit für die praktische Prüfung — sonst musst du die Theorie wiederholen.',
        'Extra-Hinweis für alte Führerscheine: Papier- und Kartenführerscheine werden gestaffelt umgetauscht ({FRIST_FUEHRERSCHEIN}) — prüfe deinen Jahrgang.'
      ],
      deadline: 'Nach bestandener Theorie: 12 Monate Zeit für die praktische Prüfung',
      consequence: 'Wenn Fristen verstreichen, müssen oft Teile neu gemacht werden – das ist nervig und kostet extra, aber meist noch machbar.',
      category: 'mobilitaet',
      faktenKeys: ['FRIST_FUEHRERSCHEIN'],
      hilfen: [{ label: 'Zuständige Führerscheinstelle finden', url: 'https://verwaltung.bund.de/' }]
    },
    {
      id: 'kfz-anmelden',
      title: 'Auto anmelden',
      summary: 'Wenn du ein Auto kaufst oder übernimmst, musst du es bei der Zulassungsstelle anmelden, bevor du losfahren darfst.',
      steps: [
        'Vorher die Kfz-Haftpflicht abschließen und die eVB-Nummer (elektronische Versicherungsbestätigung) besorgen — ohne sie geht die Zulassung nicht.',
        'Termin bei der Zulassungsstelle vereinbaren (viele bieten Online-Terminbuchung an).',
        'Unterlagen mitnehmen: eVB-Nummer, Fahrzeugpapiere (Zulassungsbescheinigung Teil I und II – Teil II beim Gebrauchtwagen vom Vorbesitzer), gültige HU/AU, Personalausweis, ggf. SEPA-Mandat für die Kfz-Steuer.',
        'Kennzeichen beantragen und prägen lassen; mit Gebühren von {BETRAG_ZULASSUNG} rechnen (Schilder kosten extra).'
      ],
      deadline: '{FRIST_ZULASSUNG}',
      consequence: 'Ohne Zulassung darfst du das Auto nicht legal im öffentlichen Straßenverkehr nutzen — und ohne gültige Haftpflicht ist die Zulassung gar nicht möglich.',
      category: 'mobilitaet',
      faktenKeys: ['FRIST_ZULASSUNG', 'BETRAG_ZULASSUNG'],
      hilfen: [{ label: 'Kfz-Zulassung & Termin finden', url: 'https://verwaltung.bund.de/' }]
    },
    {
      id: 'kfz-versicherung',
      title: 'Kfz-Versicherung wählen',
      summary: 'Die Kfz-Haftpflicht ist Pflicht. Zusätzlicher Kasko-Schutz ist freiwillig — hier entscheidest du, was zu dir passt.',
      steps: [
        'Haftpflicht ist gesetzlich vorgeschrieben: Sie zahlt Schäden, die du anderen zufügst. Ohne sie gibt es keine Zulassung.',
        'Teil- oder Vollkasko abwägen: Teilkasko deckt z. B. Diebstahl, Glasbruch, Wildunfälle; Vollkasko zusätzlich selbst verschuldete Schäden am eigenen Auto — bei jungen/neuen Autos oft sinnvoll.',
        'Angebote neutral vergleichen: Beitrag, Selbstbeteiligung, Schadenfreiheitsklasse und Fahrerkreis (wer fährt?) beeinflussen den Preis stark.',
        'Wechsel-Stichtag beachten: Eine laufende Kfz-Versicherung kündigst du meist bis {FRIST_VERSICHERUNG}.'
      ],
      deadline: 'Vor der Zulassung abschließen',
      consequence: 'Ohne Versicherung ist eine Zulassung nicht möglich – und Fahren ohne Haftpflicht ist strafbar.',
      category: 'versicherung',
      faktenKeys: ['FRIST_VERSICHERUNG']
    }
  ]
}
