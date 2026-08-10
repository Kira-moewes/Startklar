import type { BedarfsCheck, ZielStatus, Zielwert } from './types'
import { normalisiere } from '../../lib/retrieval'

// Kfz-Beiträge sind zu individuell (Alter, Region, SF-Klasse) für Richtwerte –
// der Check gibt deshalb Struktur-Empfehlungen statt Preisziele.

const schutzZiel = (alter: string): Zielwert => {
  if (alter === 'unter3') {
    return {
      kriteriumKey: 'schutz', label: 'Kaskoschutz', ziel: 'Vollkasko sinnvoll',
      pruefe: (w): ZielStatus => { const l = normalisiere(w); if (!l.trim()) return 'unklar'; return l.includes('vollkasko') ? 'erfuellt' : 'nicht-erfuellt' },
    }
  }
  if (alter === '3-8') {
    return {
      kriteriumKey: 'schutz', label: 'Kaskoschutz', ziel: 'Teilkasko meist ausreichend',
      pruefe: (w): ZielStatus => { const l = normalisiere(w); if (!l.trim()) return 'unklar'; return l.includes('teilkasko') || l.includes('vollkasko') ? 'erfuellt' : 'nicht-erfuellt' },
    }
  }
  return { kriteriumKey: 'schutz', label: 'Kaskoschutz', ziel: 'Haftpflicht reicht oft; Teilkasko nur, wenn günstig' }
}

const sbZiel = (puffer: string): Zielwert => {
  const ziel = puffer === 'nein' ? '0 € (kostet mehr Beitrag)'
    : puffer === '150' ? 'TK 150 € üblich'
    : 'TK 150 € / VK 300 € drückt den Beitrag deutlich'
  return { kriteriumKey: 'selbstbeteiligung', label: 'Selbstbeteiligung', ziel }
}

export const kfzCheck: BedarfsCheck = {
  kategorieId: 'kfz',
  titel: 'Worauf kommt es bei meiner Kfz-Versicherung an?',
  intro: 'Sieben kurze Fragen zeigen dir, welcher Schutz zu deinem Auto passt und wie du beim Beitrag sparst.',
  fragen: [
    {
      key: 'situation',
      titel: 'Wo stehst du gerade?',
      optionen: [
        { wert: 'da', label: 'Auto ist schon da' },
        { wert: 'geplant', label: 'Kauf ist geplant' },
      ],
      vorbelegung: (p) => {
        if (p.mobilitaet === 'auto') return 'da'
        if (p.mobilitaet === 'auto_geplant') return 'geplant'
        return undefined
      },
    },
    {
      key: 'alter',
      titel: 'Wie alt ist das Auto (oder dein Wunschauto)?',
      optionen: [
        { wert: 'unter3', label: 'Unter 3 Jahre' },
        { wert: '3-8', label: '3–8 Jahre' },
        { wert: 'ueber8', label: 'Über 8 Jahre' },
      ],
    },
    {
      key: 'sf',
      titel: 'Können deine Eltern helfen – SF-Klasse übertragen oder dich als Zweitwagen mitversichern?',
      optionen: [
        { wert: 'ja', label: 'Ja' },
        { wert: 'nein', label: 'Nein' },
        { wert: 'unklar', label: 'Weiß ich nicht' },
      ],
    },
    {
      key: 'puffer',
      titel: 'Hättest du Rücklagen für eine Selbstbeteiligung im Schadensfall?',
      optionen: [
        { wert: 'nein', label: 'Nein' },
        { wert: '150', label: 'Ca. 150 €' },
        { wert: '300plus', label: '300 € oder mehr' },
      ],
    },
    {
      key: 'fahrer',
      titel: 'Wer fährt das Auto?',
      optionen: [
        { wert: 'nur_ich', label: 'Nur ich' },
        { wert: 'mehrere', label: 'Auch Eltern / Partner:in' },
      ],
    },
    {
      key: 'km',
      titel: 'Wie viel fährst du ungefähr im Jahr?',
      optionen: [
        { wert: 'wenig', label: 'Unter 6.000 km' },
        { wert: 'mittel', label: '6.000–12.000 km' },
        { wert: 'viel', label: 'Mehr' },
      ],
    },
    {
      key: 'stellplatz',
      titel: 'Wo steht das Auto nachts?',
      optionen: [
        { wert: 'garage', label: 'Garage' },
        { wert: 'stellplatz', label: 'Fester Stellplatz' },
        { wert: 'strasse', label: 'An der Straße' },
      ],
    },
  ],
  auswerten: (antworten) => {
    const zielwerte = [schutzZiel(antworten.alter), sbZiel(antworten.puffer)]
    if (antworten.sf === 'ja') {
      zielwerte.push({ kriteriumKey: 'sf-klasse', label: 'Einstufung', ziel: 'Übernahme/Zweitwagen-Einstufung aktiv ansprechen' })
    }

    const bausteine: string[] = []
    if (antworten.fahrer === 'mehrere') {
      bausteine.push('Fahrerkreis „weitere Fahrer" korrekt angeben – falsche Angabe kann teuren Regress bedeuten')
    }
    if (antworten.km === 'wenig') {
      bausteine.push('Kilometer-genauer Tarif (Wenigfahrer sparen deutlich)')
    }

    const hinweise: string[] = []
    if (antworten.sf === 'unklar') hinweise.push('Ein Anruf bei deinen Eltern kann hunderte Euro im Jahr sparen.')
    if (antworten.stellplatz === 'garage') hinweise.push('Garage senkt den Beitrag – unbedingt im Antrag angeben.')
    hinweise.push('Beiträge sind extrem individuell (Alter, Region, SF-Klasse) – hol dir echte Angebote, Richtwerte gibt es hier bewusst nicht.')
    if (antworten.situation === 'geplant') hinweise.push('Versicherung VOR dem Kauf klären – die eVB-Nummer brauchst du schon fürs Anmelden.')

    return {
      stufe: 'wichtig',
      titel: 'Pflicht – ohne läuft nichts',
      begruendung: 'Ohne Kfz-Haftpflicht bekommst du kein Kennzeichen.',
      zielwerte,
      bausteine,
      hinweise,
    }
  },
}
