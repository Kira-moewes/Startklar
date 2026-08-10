import type { BedarfsCheck, ZielStatus, Zielwert } from './types'
import { parseEuro, enthaeltJa } from '../../lib/bedarfMatch'

// GKV-Wahl ist Sozialversicherung, keine Versicherungsvermittlung – trotzdem
// gleiche Neutralitäts-Mechanik wie bei den anderen Checks.
// Zusatzbeitrags-Schwelle ≈ Durchschnitt; redaktionell ungeprüft.

const beitragZiel: Zielwert = {
  kriteriumKey: 'zusatzbeitrag',
  label: 'Zusatzbeitrag',
  ziel: 'unter dem Durchschnitt (≈ 2,5 %)',
  pruefe: (wert): ZielStatus => {
    const p = parseEuro(wert) // nimmt bei Spannen die Obergrenze; ',' als Dezimaltrenner
    if (p === null) return 'unklar'
    return p <= 2.5 ? 'erfuellt' : 'nicht-erfuellt'
  },
}

const jaZiel = (kriteriumKey: string, label: string): Zielwert => ({
  kriteriumKey,
  label,
  ziel: 'ja',
  pruefe: (wert): ZielStatus => {
    const ja = enthaeltJa(wert)
    if (ja === null) return 'unklar'
    return ja ? 'erfuellt' : 'nicht-erfuellt'
  },
})

export const krankenkasseCheck: BedarfsCheck = {
  kategorieId: 'krankenkasse',
  titel: 'Welche Krankenkasse passt zu mir?',
  intro: 'Fünf kurze Fragen zeigen dir, worauf es bei DEINER Kassenwahl ankommt – die Grundleistungen sind überall fast gleich.',
  fragen: [
    {
      key: 'status',
      titel: 'Bist du noch über deine Eltern familienversichert?',
      hinweis: 'Geht meist bis 25, solange du in Ausbildung/Studium bist und wenig verdienst.',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein, eigene Kasse' },
        { wert: 'unklar', label: 'Weiß ich nicht' },
      ],
      vorbelegung: (p) => {
        if (p.krankenversicherung === 'familie') return 'ja'
        if (p.krankenversicherung === 'eigene') return 'nein'
        if (p.krankenversicherung === 'unklar') return 'unklar'
        return undefined
      },
    },
    {
      key: 'wichtig',
      titel: 'Was ist dir bei einer Kasse am wichtigsten?',
      optionen: [
        { wert: 'beitrag', label: 'Möglichst niedriger Beitrag' },
        { wert: 'extras', label: 'Extras (Zahnreinigung, Bonus)' },
        { wert: 'digital', label: 'Alles digital erledigen' },
        { wert: 'egal', label: 'Bin mir nicht sicher' },
      ],
    },
    {
      key: 'sport',
      titel: 'Machst du regelmäßig Sport oder Vorsorge-Checks?',
      hinweis: 'Dann lohnen sich Bonusprogramme richtig.',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Eher nicht' },
      ],
    },
    {
      key: 'zahn',
      titel: 'Würdest du professionelle Zahnreinigung nutzen?',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein' },
      ],
    },
    {
      key: 'wechselgrund',
      titel: 'Willst du gerade wechseln – und warum?',
      optionen: [
        { wert: 'beitrag', label: 'Beitrag ist gestiegen' },
        { wert: 'service', label: 'Unzufrieden mit dem Service' },
        { wert: 'erste', label: 'Ich brauche meine erste eigene Kasse' },
        { wert: 'nein', label: 'Will nur vergleichen' },
      ],
    },
  ],
  auswerten: (antworten) => {
    if (antworten.status === 'ja') {
      return {
        stufe: 'verzichtbar',
        titel: 'Noch nichts zu tun',
        begruendung: 'Du bist familienversichert – eine eigene Kasse brauchst du erst mit eigenem Einkommen oder ab 25.',
        zielwerte: [],
        hinweise: ['Merk dir: Beim ersten Job oder ab 25 wird die Kassenwahl aktuell – mach den Check dann neu.'],
      }
    }

    const zielwerte: Zielwert[] = []
    const bausteine: string[] = []
    const hinweise: string[] = []

    if (antworten.wichtig === 'beitrag' || antworten.wechselgrund === 'beitrag') {
      zielwerte.push(beitragZiel)
    }
    if (antworten.zahn === 'ja') zielwerte.push(jaZiel('zahnreinigung', 'Zahnreinigung'))
    if (antworten.sport === 'ja') zielwerte.push(jaZiel('bonusprogramm', 'Bonusprogramm'))
    if (antworten.wichtig === 'digital') zielwerte.push(jaZiel('digital', 'App / Online-Service'))
    if (antworten.wichtig === 'egal') {
      zielwerte.push(beitragZiel)
      hinweise.push('Wenn du unsicher bist: Der Zusatzbeitrag ist der handfesteste Unterschied – die Grundleistungen sind gesetzlich fast identisch.')
    }
    if (antworten.wechselgrund === 'service') {
      bausteine.push('Erreichbarkeit testen: Ruf vor dem Wechsel einmal bei der neuen Kasse an')
    }
    hinweise.push('Der Wechsel ist unkompliziert: Bei der neuen Kasse anmelden – sie kündigt für dich bei der alten.')
    if (antworten.status === 'unklar') {
      hinweise.push('Klär zuerst mit deinen Eltern oder der Kasse, ob du noch familienversichert bist.')
    }

    return {
      stufe: 'wichtig',
      titel: antworten.wechselgrund === 'erste' ? 'Deine erste eigene Kasse' : 'Lohnt den Blick',
      begruendung: 'Die Kassenwahl kostet nichts, spart aber schnell über 100 € im Jahr – und Extras, die du wirklich nutzt.',
      zielwerte,
      bausteine,
      hinweise,
    }
  },
}
