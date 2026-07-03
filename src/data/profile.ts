export type Profile = {
  volljaehrig?: 'ja' | 'nein'
  status?: 'schueler' | 'azubi' | 'student' | 'berufstaetig' | 'suchend' | 'fsj'
  einkommen?: 'keins' | 'minijob' | 'ausbildung' | 'vollzeit' | 'werkstudent'
  wohnsituation?: 'eltern' | 'auszug_geplant' | 'ausgezogen' | 'wg'
  mobilitaet?: 'kein' | 'fs_laeuft' | 'fs_ohne_auto' | 'auto_geplant' | 'auto'
  krankenversicherung?: 'familie' | 'eigene' | 'privat' | 'unklar'
  unterstuetzung?: 'viel' | 'etwas' | 'kaum' | 'niemand'
}

export type Frage = {
  feld: keyof Profile
  titel: string
  hinweis?: string
  optionen: { wert: string; label: string }[]
}

export const fragen: Frage[] = [
  {
    feld: 'volljaehrig',
    titel: 'Bist du schon 18?',
    hinweis: 'Mehr wollen wir gar nicht wissen – kein Geburtsdatum nötig.',
    optionen: [
      { wert: 'ja', label: 'Ja, bin ich' },
      { wert: 'nein', label: 'Noch nicht' },
    ],
  },
  {
    feld: 'status',
    titel: 'Was beschreibt dich gerade am besten?',
    optionen: [
      { wert: 'schueler', label: 'Schüler:in' },
      { wert: 'azubi', label: 'Azubi' },
      { wert: 'student', label: 'Student:in' },
      { wert: 'berufstaetig', label: 'Ich arbeite schon' },
      { wert: 'suchend', label: 'Ich suche noch' },
      { wert: 'fsj', label: 'FSJ / BFD' },
    ],
  },
  {
    feld: 'einkommen',
    titel: 'Wie sieht es mit eigenem Geld aus?',
    optionen: [
      { wert: 'keins', label: 'Noch keins' },
      { wert: 'minijob', label: 'Minijob / Nebenjob' },
      { wert: 'ausbildung', label: 'Ausbildungsvergütung' },
      { wert: 'vollzeit', label: 'Vollzeitgehalt' },
      { wert: 'werkstudent', label: 'Werkstudent:in' },
    ],
  },
  {
    feld: 'wohnsituation',
    titel: 'Wo wohnst du – oder wo bald?',
    optionen: [
      { wert: 'eltern', label: 'Bei meinen Eltern' },
      { wert: 'auszug_geplant', label: 'Ich ziehe bald aus' },
      { wert: 'ausgezogen', label: 'Schon ausgezogen' },
      { wert: 'wg', label: 'In einer WG' },
    ],
  },
  {
    feld: 'mobilitaet',
    titel: 'Und beim Thema Mobilität?',
    optionen: [
      { wert: 'kein', label: 'Kein Thema für mich' },
      { wert: 'fs_laeuft', label: 'Führerschein läuft gerade' },
      { wert: 'fs_ohne_auto', label: 'Führerschein ja, Auto nein' },
      { wert: 'auto_geplant', label: 'Erstes Auto ist geplant' },
      { wert: 'auto', label: 'Hab schon ein Auto' },
    ],
  },
  {
    feld: 'krankenversicherung',
    titel: 'Wie bist du krankenversichert?',
    optionen: [
      { wert: 'familie', label: 'Über meine Eltern' },
      { wert: 'eigene', label: 'Eigene gesetzliche' },
      { wert: 'privat', label: 'Privat' },
      { wert: 'unklar', label: 'Keine Ahnung – klären wir' },
    ],
  },
  {
    feld: 'unterstuetzung',
    titel: 'Wer hilft dir bei Behörden-Kram?',
    hinweis: 'Ehrliche Antwort hilft uns, den richtigen Ton zu treffen.',
    optionen: [
      { wert: 'viel', label: 'Meine Eltern, viel' },
      { wert: 'etwas', label: 'Ein bisschen' },
      { wert: 'kaum', label: 'Kaum' },
      { wert: 'niemand', label: 'Niemand – ich mach das allein' },
    ],
  },
]
