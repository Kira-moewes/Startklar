import type { BedarfsCheck, ZielStatus, Zielwert } from './types'
import { parseEuro, enthaeltJa } from '../../lib/bedarfMatch'

// Faustregel 650 €/m² folgt gängiger Verbraucherberatung, redaktionell noch ungeprüft.

const summeZiel = (flaeche: string): Zielwert => {
  if (flaeche === 'unter30') {
    return {
      kriteriumKey: 'summe', label: 'Versicherungssumme', ziel: 'mind. 20.000 €',
      pruefe: (w): ZielStatus => { const e = parseEuro(w); return e === null ? 'unklar' : e >= 20000 ? 'erfuellt' : 'nicht-erfuellt' },
    }
  }
  if (flaeche === '30-60') {
    return {
      kriteriumKey: 'summe', label: 'Versicherungssumme', ziel: 'mind. 40.000 €',
      pruefe: (w): ZielStatus => { const e = parseEuro(w); return e === null ? 'unklar' : e >= 40000 ? 'erfuellt' : 'nicht-erfuellt' },
    }
  }
  // über 60 m²: individuelle Faustregel, keine feste Ampel
  return { kriteriumKey: 'summe', label: 'Versicherungssumme', ziel: 'Wohnfläche × 650 €' }
}

const sbZiel: Zielwert = {
  kriteriumKey: 'selbstbeteiligung',
  label: 'Selbstbeteiligung',
  ziel: 'möglichst 0–150 €',
  pruefe: (w): ZielStatus => { const e = parseEuro(w); return e === null ? 'unklar' : e <= 150 ? 'erfuellt' : 'nicht-erfuellt' },
}

const fahrradZiel: Zielwert = {
  kriteriumKey: 'fahrrad',
  label: 'Fahrraddiebstahl',
  ziel: 'eingeschlossen',
  pruefe: (w): ZielStatus => { const ja = enthaeltJa(w); return ja === null ? 'unklar' : ja ? 'erfuellt' : 'nicht-erfuellt' },
}

export const hausratCheck: BedarfsCheck = {
  kategorieId: 'hausrat',
  titel: 'Brauche ich eine Hausratversicherung?',
  intro: 'Vier kurze Fragen zeigen dir, ob sich eine Hausratversicherung für dich lohnt und wie hoch die Summe sein sollte.',
  fragen: [
    {
      key: 'wohnort',
      titel: 'Wohnst du (bald) in einer eigenen Wohnung oder WG?',
      optionen: [
        { wert: 'eigene', label: 'Eigene Wohnung' },
        { wert: 'wg', label: 'WG' },
        { wert: 'eltern', label: 'Noch bei den Eltern' },
      ],
      vorbelegung: (p) => {
        if (p.wohnsituation === 'eltern') return 'eltern'
        if (p.wohnsituation === 'wg') return 'wg'
        if (p.wohnsituation === 'ausgezogen' || p.wohnsituation === 'auszug_geplant') return 'eigene'
        return undefined
      },
    },
    {
      key: 'wert',
      titel: 'Was wären deine Sachen ungefähr wert, wenn du alles neu kaufen müsstest?',
      hinweis: 'Möbel, Technik, Kleidung, Rad – zum Neupreis.',
      optionen: [
        { wert: 'unter5000', label: 'Unter 5.000 €' },
        { wert: '5-15', label: '5.000–15.000 €' },
        { wert: 'ueber15000', label: 'Über 15.000 €' },
        { wert: 'unklar', label: 'Keine Ahnung' },
      ],
    },
    {
      key: 'flaeche',
      titel: 'Wie groß ist die Wohnung?',
      optionen: [
        { wert: 'unter30', label: 'Unter 30 m²' },
        { wert: '30-60', label: '30–60 m²' },
        { wert: 'ueber60', label: 'Über 60 m²' },
      ],
    },
    {
      key: 'fahrrad',
      titel: 'Hast du ein Fahrrad oder E-Bike, das draußen oder im Keller steht?',
      optionen: [
        { wert: 'ja_teuer', label: 'Ja, über 500 € wert' },
        { wert: 'ja_guenstig', label: 'Ja, günstiger' },
        { wert: 'nein', label: 'Nein' },
      ],
    },
    {
      key: 'lage',
      titel: 'Wo liegt die Wohnung?',
      optionen: [
        { wert: 'eg', label: 'Erdgeschoss oder Souterrain' },
        { wert: 'oben', label: 'Weiter oben' },
        { wert: 'haus', label: 'Im Haus (mehrere Etagen)' },
      ],
    },
    {
      key: 'elementar',
      titel: 'Kellerraum – oder eine Gegend mit Hochwasser-/Starkregenrisiko?',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein' },
        { wert: 'unklar', label: 'Weiß ich nicht' },
      ],
    },
    {
      key: 'wertsachen',
      titel: 'Hast du einzelne Sachen über 2.000 € (Schmuck, Kamera, Rechner)?',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein' },
      ],
    },
  ],
  auswerten: (antworten) => {
    if (antworten.wohnort === 'eltern') {
      return {
        stufe: 'verzichtbar',
        titel: 'Vermutlich schon abgedeckt',
        begruendung: 'Deine Sachen sind über die Hausratversicherung deiner Eltern mitversichert.',
        zielwerte: [],
        hinweise: ['Beim Auszug wird das Thema neu – mach den Check dann noch mal.'],
      }
    }
    if (antworten.wert === 'unter5000') {
      return {
        stufe: 'verzichtbar',
        titel: 'Wahrscheinlich verzichtbar',
        begruendung: 'Bei wenig Besitz ersetzt du im Ernstfall günstiger selbst – steck das Geld lieber in die Haftpflicht.',
        zielwerte: [],
        hinweise: [],
      }
    }

    const hinweise: string[] = []
    const bausteine: string[] = []
    if (antworten.wohnort === 'wg') {
      hinweise.push('In der WG braucht meist jede:r eine eigene Police fürs eigene Zimmer – klärt, wem was gehört.')
    }
    hinweise.push('Vereinbare einen Unterversicherungsverzicht (Stichwort m²-Pauschale).')
    if (antworten.lage === 'eg') {
      bausteine.push('Einfacher Fahrrad-/Diebstahl im EG prüfen')
      hinweise.push('Erdgeschoss heißt höheres Einbruchrisiko – abschließbare Fenster/Gitter senken oft den Beitrag.')
    }
    if (antworten.elementar === 'ja' || antworten.elementar === 'unklar') {
      bausteine.push('Elementarschäden (Starkregen, Rückstau, Hochwasser)')
    }
    if (antworten.wertsachen === 'ja') {
      hinweise.push('Prüfe die Wertsachengrenze der Police (oft 20–40 % der Versicherungssumme) – teure Einzelstücke ggf. extra melden.')
    }
    const zielwerte = [summeZiel(antworten.flaeche), sbZiel]
    if (antworten.fahrrad === 'ja_teuer') zielwerte.push(fahrradZiel)

    if (antworten.wert === 'unklar') {
      return {
        stufe: 'pruefen',
        titel: 'Erst überschlagen',
        begruendung: 'Ob sich die Versicherung lohnt, hängt am Wert deiner Sachen – den solltest du kurz überschlagen.',
        zielwerte,
        bausteine,
        hinweise: ['Geh im Kopf durch die Wohnung: Was hat mehr als 100 € gekostet? Das summiert sich schneller als gedacht.', ...hinweise],
      }
    }

    return {
      stufe: 'wichtig',
      titel: 'Wichtig für dich',
      begruendung: 'Dein Hausrat ist mehr wert, als du locker ersetzen könntest.',
      zielwerte,
      bausteine,
      hinweise,
    }
  },
}
