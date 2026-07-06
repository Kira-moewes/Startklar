import type { BedarfsCheck, ZielStatus, Zielwert } from './types'
import { parseEuro, parseMillionen, enthaeltJa } from '../../lib/bedarfMatch'

// Faustregeln (50 Mio. € Deckung, SB-Üblichkeiten) folgen gängiger
// Verbraucherberatung, sind aber redaktionell noch ungeprüft.

const deckungZiel: Zielwert = {
  kriteriumKey: 'deckung',
  label: 'Deckungssumme',
  ziel: 'mind. 50 Mio. €',
  pruefe: (wert): ZielStatus => {
    const mio = parseMillionen(wert)
    if (mio === null) return 'unklar'
    return mio >= 50 ? 'erfuellt' : 'nicht-erfuellt'
  },
}

const ausfallZiel: Zielwert = {
  kriteriumKey: 'ausfalldeckung',
  label: 'Ausfalldeckung',
  ziel: 'enthalten',
  pruefe: (wert): ZielStatus => {
    const ja = enthaeltJa(wert)
    if (ja === null) return 'unklar'
    return ja ? 'erfuellt' : 'nicht-erfuellt'
  },
}

const sbZiel = (puffer: string): Zielwert => {
  const strikt = puffer === 'nichts'
  return {
    kriteriumKey: 'selbstbeteiligung',
    label: 'Selbstbeteiligung',
    ziel: strikt ? '0 €' : 'bis 150 € ist ok (senkt den Beitrag)',
    pruefe: (wert): ZielStatus => {
      const eur = parseEuro(wert)
      if (eur === null) return 'unklar'
      return eur <= (strikt ? 0 : 150) ? 'erfuellt' : 'nicht-erfuellt'
    },
  }
}

export const haftpflichtCheck: BedarfsCheck = {
  kategorieId: 'haftpflicht',
  titel: 'Brauche ich eine Haftpflicht?',
  intro: 'Drei kurze Fragen zeigen dir, ob du eine private Haftpflicht brauchst und worauf es bei dir ankommt.',
  fragen: [
    {
      key: 'mitversichert',
      titel: 'Bist du noch über deine Eltern haftpflichtversichert?',
      hinweis: 'In der Erstausbildung bist du oft automatisch mitversichert – einmal nachfragen.',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein' },
        { wert: 'unklar', label: 'Weiß ich nicht' },
      ],
    },
    {
      key: 'puffer',
      titel: 'Wie viel könntest du bei einem kleinen Schaden selbst zahlen?',
      optionen: [
        { wert: 'nichts', label: 'Fast nichts' },
        { wert: '150', label: 'Bis 150 €' },
        { wert: 'mehr', label: 'Auch mehr' },
      ],
    },
    {
      key: 'risiko',
      titel: 'Trifft etwas davon auf dich zu?',
      optionen: [
        { wert: 'leihen', label: 'Ich leihe oft teure Sachen (Technik, Rad)' },
        { wert: 'schluessel', label: 'Ich passe auf fremde Schlüssel auf (WG, Job)' },
        { wert: 'beides', label: 'Beides' },
        { wert: 'nichts', label: 'Nichts davon' },
      ],
    },
    {
      key: 'haushalt',
      titel: 'Wohnst du mit Partner:in zusammen?',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein' },
      ],
    },
    {
      key: 'ausland',
      titel: 'Planst du längere Zeit im Ausland (Auslandssemester, Work & Travel)?',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'vielleicht', label: 'Vielleicht' },
        { wert: 'nein', label: 'Nein' },
      ],
    },
    {
      key: 'tiere',
      titel: 'Hast du einen Hund oder ein Pferd?',
      hinweis: 'Katzen und Kleintiere sind über die Privathaftpflicht abgedeckt.',
      optionen: [
        { wert: 'hund', label: 'Hund' },
        { wert: 'pferd', label: 'Pferd' },
        { wert: 'nein', label: 'Nein' },
      ],
    },
  ],
  auswerten: (antworten, profil) => {
    const nochBeiEltern = ['schueler', 'azubi', 'student', 'fsj']
    const hinweise: string[] = []
    const bausteine: string[] = []
    if (antworten.risiko === 'leihen' || antworten.risiko === 'beides') {
      bausteine.push('Geliehene und gemietete Sachen mitversichert')
    }
    if (antworten.risiko === 'schluessel' || antworten.risiko === 'beides') {
      bausteine.push('Schlüsselverlust eingeschlossen')
    }
    if (antworten.haushalt === 'ja') {
      bausteine.push('Partner:in mitversicherbar (Paar-Tarif prüfen – oft kaum teurer)')
    }
    if (antworten.ausland === 'ja' || antworten.ausland === 'vielleicht') {
      bausteine.push('Weltweiter Schutz für mindestens 1 Jahr Auslandsaufenthalt')
    }
    if (antworten.tiere === 'hund') {
      hinweise.push('Für den Hund brauchst du eine EIGENE Tierhalterhaftpflicht (je nach Bundesland Pflicht) – die Privathaftpflicht deckt ihn nicht.')
    }
    if (antworten.tiere === 'pferd') {
      hinweise.push('Fürs Pferd brauchst du eine EIGENE Tierhalterhaftpflicht – die Privathaftpflicht deckt es nicht.')
    }

    if (antworten.mitversichert === 'ja' && profil?.status && nochBeiEltern.includes(profil.status)) {
      return {
        stufe: 'verzichtbar',
        titel: 'Vermutlich schon abgedeckt',
        begruendung: 'Du bist vermutlich noch über die Haftpflicht deiner Eltern mitversichert.',
        zielwerte: [],
        hinweise: ['Das endet meist mit der ersten Berufstätigkeit oder dem Ende der Erstausbildung – mach den Check dann neu.', ...hinweise],
      }
    }

    const zielwerte = [deckungZiel, ausfallZiel, sbZiel(antworten.puffer)]

    if (antworten.mitversichert === 'unklar') {
      return {
        stufe: 'pruefen',
        titel: 'Erst klären',
        begruendung: 'Frag zuerst deine Eltern – die Antwort spart dir womöglich den ganzen Beitrag.',
        zielwerte,
        bausteine,
        hinweise,
      }
    }

    return {
      stufe: 'wichtig',
      titel: 'Wichtig für dich',
      begruendung: 'Die wichtigste freiwillige Versicherung überhaupt – ein Personenschaden kann sonst dein Leben lang kosten.',
      zielwerte,
      bausteine,
      hinweise,
    }
  },
}
