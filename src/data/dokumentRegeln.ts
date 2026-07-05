import { normalisiere } from './suchen'

// Auto-Einsortierung: Schlüsselwörter in Dateiname/Titel → Thema + Unterordner.
// Die erste passende Regel gewinnt; der Vorschlag ist im Upload-Dialog änderbar.
export type DokumentRegel = { muster: string[]; themaId: string; unterordner: string }

export const dokumentRegeln: DokumentRegel[] = [
  { muster: ['mietvertrag', 'miete', 'uebergabeprotokoll'], themaId: 'wohnen', unterordner: 'Mietvertrag' },
  { muster: ['nebenkosten', 'betriebskosten', 'kaution'], themaId: 'wohnen', unterordner: 'Nebenkosten' },
  { muster: ['strom', 'internet', 'dsl', 'glasfaser'], themaId: 'wohnen', unterordner: 'Strom & Internet' },
  { muster: ['police', 'haftpflicht', 'hausrat', 'versicherungsschein', 'kfz versicherung'], themaId: 'versicherungen', unterordner: 'Policen' },
  { muster: ['schaden', 'schadensfall'], themaId: 'versicherungen', unterordner: 'Schadensfälle' },
  { muster: ['lohn', 'gehalt', 'entgelt', 'verdienst'], themaId: 'arbeit', unterordner: 'Lohnabrechnungen' },
  { muster: ['arbeitsvertrag', 'ausbildungsvertrag'], themaId: 'arbeit', unterordner: 'Verträge' },
  { muster: ['bewerbung', 'lebenslauf'], themaId: 'arbeit', unterordner: 'Bewerbungen' },
  { muster: ['zeugnis', 'zertifikat'], themaId: 'arbeit', unterordner: 'Zeugnisse' },
  { muster: ['steuer', 'steuerbescheid', 'bescheid finanzamt'], themaId: 'finanzen', unterordner: 'Bescheide' },
  { muster: ['kontoauszug', 'depot', 'giro', 'konto'], themaId: 'finanzen', unterordner: 'Nachweise' },
  { muster: ['bafoeg', 'kindergeld'], themaId: 'finanzen', unterordner: 'Bescheide' },
  { muster: ['impf', 'befund', 'arzt', 'rezept'], themaId: 'gesundheit', unterordner: 'Befunde' },
  { muster: ['krankenkasse', 'krankenversicherung', 'mitgliedsbescheinigung'], themaId: 'gesundheit', unterordner: 'Krankenkasse' },
  { muster: ['fuehrerschein', 'fahrschule'], themaId: 'mobilitaet', unterordner: 'Führerschein' },
  { muster: ['zulassung', 'fahrzeugschein', 'fahrzeugbrief', 'tuev'], themaId: 'mobilitaet', unterordner: 'Fahrzeug' },
  { muster: ['ticket', 'deutschlandticket', 'bahncard'], themaId: 'mobilitaet', unterordner: 'Tickets' },
  { muster: ['ausweis', 'reisepass', 'personalausweis'], themaId: 'amt-recht', unterordner: 'Ausweise' },
  { muster: ['anmeldung', 'ummeldung', 'meldebescheinigung', 'buergeramt'], themaId: 'amt-recht', unterordner: 'Anmeldungen' },
  { muster: ['rundfunk', 'gez'], themaId: 'wohnen', unterordner: 'Korrespondenz' },
]

export function schlageAblageVor(text: string): { themaId: string; unterordner: string } | null {
  const norm = normalisiere(text)
  for (const regel of dokumentRegeln) {
    if (regel.muster.some(m => norm.includes(normalisiere(m)))) {
      return { themaId: regel.themaId, unterordner: regel.unterordner }
    }
  }
  return null
}
