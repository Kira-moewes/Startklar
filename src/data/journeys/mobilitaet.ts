import type { Journey } from '../types'

export const mobilitaetJourney: Journey = {
  id: 'mobilitaet',
  title: 'Mobilität',
  subtitle: 'Führerschein, erstes Auto und alles drumherum.',
  tasks: [
    {
      id: 'fuehrerschein-fristen',
      title: 'Führerschein: Fristen im Blick',
      summary: 'Halte die wichtigen Fristen für die Führerschein-Ausbildung im Blick, damit du nichts übersehen musst.',
      steps: [
        'Theorie- und Praxis-Fristen beim Fahrlehrer erfragen.',
        'Prüfungstermine planen.',
        'Unterlagen bereithalten.'
      ],
      deadline: '{FRIST_FUEHRERSCHEIN}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn Fristen verstreichen, müssen oft Teile neu gemacht werden – das ist nervig, aber meist noch machbar.',
      category: 'mobilitaet',
      faktenKeys: ['FRIST_FUEHRERSCHEIN']
    },
    {
      id: 'kfz-anmelden',
      title: 'Auto anmelden',
      summary: 'Wenn du ein Auto hast oder bekommen wirst, ist die Anmeldung ein wichtiger Schritt.',
      steps: [
        'Termin bei der Zulassungsstelle vereinbaren.',
        'Unterlagen: eVB-Nummer, Fahrzeugpapiere, Ausweis.',
        'Kennzeichen beantragen.',
        'Kosten {BETRAG_ZULASSUNG} einplanen.'
      ],
      deadline: '{FRIST_ZULASSUNG}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Ohne Anmeldung darfst du das Auto nicht legal im öffentlichen Straßenverkehr nutzen.',
      category: 'mobilitaet',
      faktenKeys: ['FRIST_ZULASSUNG', 'BETRAG_ZULASSUNG']
    },
    {
      id: 'kfz-versicherung',
      title: 'KFZ-Versicherung wählen',
      summary: 'Eine KFZ-Versicherung ist ein zentraler Punkt, wenn du ein Auto nutzt oder anmelden willst.',
      steps: [
        'Haftpflicht ist Pflicht.',
        'Teilkasko oder Vollkasko abwägen.',
        'Neutral vergleichen.'
      ],
      deadline: 'Vor der Zulassung', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Ohne Versicherung ist eine Zulassung nicht möglich.',
      category: 'versicherung',
      vergleichAbSchritt: 3
    }
  ]
}
