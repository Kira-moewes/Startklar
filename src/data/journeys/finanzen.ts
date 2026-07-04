import type { Journey } from '../types'

export const finanzenJourney: Journey = {
  id: 'finanzen',
  title: 'Finanzen',
  subtitle: 'Konto, Steuern und der Papierkram dahinter.',
  tasks: [
    {
      id: 'girokonto',
      title: 'Eigenes Girokonto',
      summary: 'Wenn du von einem Jugendkonto auf ein eigenes Konto wechselst, ist das ein sinnvoller Schritt.',
      steps: [
        'Prüfe, welche Kontenangebote zu dir passen.',
        'Vergleiche Gebühren, Online-Funktionen und Karten.',
        'Wechsle dann sauber und stelle die neuen Zahlungen um.'
      ],
      deadline: 'Kein fester Termin', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du nicht auf ein eigenes Konto umsteigst, kann das den Alltag mit Zahlungen und Abos unnötig erschweren.',
      category: 'finanzen'
    },
    {
      id: 'steuererklaerung',
      title: 'Steuererklärung – lohnt sie sich?',
      summary: 'Für viele Menschen lohnt sich die Steuererklärung, weil sie eine Rückerstattung bekommen können.',
      steps: [
        'Lohnsteuerbescheinigung finden.',
        'Prüfen, ob die Abgabe sich lohnt {BETRAG_RUECKERSTATTUNG}.',
        'ELSTER-Konto anlegen.'
      ],
      deadline: '{FRIST_STEUER}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du sie nicht prüfst, verpasst du vielleicht eine Rückerstattung oder einen wichtigen Hinweis.',
      category: 'finanzen',
      faktenKeys: ['FRIST_STEUER', 'BETRAG_RUECKERSTATTUNG']
    },
    {
      id: 'familienversicherung-check',
      title: 'Noch über die Eltern versichert?',
      summary: 'Prüfe, bis wann du noch über die Familienversicherung abgedeckt bist.',
      steps: [
        'Deine Versicherungspapiere prüfen.',
        'Die Frist für die Familienversicherung nachschauen.',
        'Wenn nötig, rechtzeitig eine eigene Lösung klären.'
      ],
      deadline: '{FRIST_FAMILIENVERSICHERUNG}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du die Versicherung nicht rechtzeitig prüfst, kann es später zu einer Lücke kommen.',
      category: 'versicherung',
      faktenKeys: ['FRIST_FAMILIENVERSICHERUNG']
    },
    {
      id: 'schufa',
      title: 'Schufa verstehen',
      summary: 'Die Schufa ist ein wichtiges Thema, wenn du später Verträge, Kredite oder ein Handyabo abschließen willst.',
      steps: [
        'Prüfen, was die Schufa ist.',
        'Den kostenlosen Jahresbericht {ANZAHL_SCHUFA_KOSTENLOS} nutzen.',
        'Fehler prüfen und bei Bedarf korrigieren.'
      ],
      deadline: 'Kein fester Termin', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du die Schufa nicht kennst, können Unklarheiten später schwerer aufgelöst werden.',
      category: 'finanzen',
      faktenKeys: ['ANZAHL_SCHUFA_KOSTENLOS']
    }
  ]
}
