export type Faktum = {
  wert: string
  geprueft: string | null
}

export const fakten: Record<string, Faktum> = {
  FRIST_ANMELDUNG: { wert: '{FRIST_ANMELDUNG}', geprueft: null },
  BETRAG_RUNDFUNK: { wert: '{BETRAG_RUNDFUNK}', geprueft: null },
  FRIST_STEUER: { wert: '{FRIST_STEUER}', geprueft: null },
  BETRAG_RUECKERSTATTUNG: { wert: '{BETRAG_RUECKERSTATTUNG}', geprueft: null },
  FRIST_FAMILIENVERSICHERUNG: { wert: '{FRIST_FAMILIENVERSICHERUNG}', geprueft: null },
  ANZAHL_SCHUFA_KOSTENLOS: { wert: '{ANZAHL_SCHUFA_KOSTENLOS}', geprueft: null },
  FRIST_FUEHRERSCHEIN: { wert: '{FRIST_FUEHRERSCHEIN}', geprueft: null },
  BETRAG_FUEHRERSCHEIN: { wert: '{BETRAG_FUEHRERSCHEIN}', geprueft: null },
  FRIST_ZULASSUNG: { wert: '{FRIST_ZULASSUNG}', geprueft: null },
  BETRAG_ZULASSUNG: { wert: '{BETRAG_ZULASSUNG}', geprueft: null },
  FRIST_RUNDFUNKBEITRAG: { wert: '{FRIST_RUNDFUNKBEITRAG}', geprueft: null },
  FRIST_VERSICHERUNG: { wert: '{FRIST_VERSICHERUNG}', geprueft: null },
  FRIST_ADRESSAENDERUNG: { wert: '{FRIST_ADRESSAENDERUNG}', geprueft: null }
}

// Neu hinzugefügte Platzhalter
fakten['STATUS_ALTERSVORSORGEDEPOT'] = { wert: '{STATUS_ALTERSVORSORGEDEPOT}', geprueft: null }
fakten['ALTER_KINDERGELD_MAX'] = { wert: '{ALTER_KINDERGELD_MAX}', geprueft: null }
fakten['BETRAG_DTICKET'] = { wert: '{BETRAG_DTICKET}', geprueft: null }
fakten['HAUSHALT_50_30_20'] = { wert: '{HAUSHALT_50_30_20}', geprueft: null }

// Platzhalter für erste-wohnung & start Journeys
fakten['BUSSGELD_ANMELDUNG'] = { wert: '{BUSSGELD_ANMELDUNG}', geprueft: null }
fakten['ANZAHL_KALTMIETEN_KAUTION'] = { wert: '{ANZAHL_KALTMIETEN_KAUTION}', geprueft: null }
fakten['FRIST_KUENDIGUNG_STROM'] = { wert: '{FRIST_KUENDIGUNG_STROM}', geprueft: null }
fakten['BETRAG_PERSO'] = { wert: '{BETRAG_PERSO}', geprueft: null }
fakten['FRIST_WIDERRUF'] = { wert: '{FRIST_WIDERRUF}', geprueft: null }
fakten['FRIST_KK_WECHSEL'] = { wert: '{FRIST_KK_WECHSEL}', geprueft: null }
fakten['BETRAG_PLASMA'] = { wert: '{BETRAG_PLASMA}', geprueft: null }
fakten['FRIST_BAFOEG'] = { wert: '{FRIST_BAFOEG}', geprueft: null }
fakten['BETRAG_MINIJOB'] = { wert: '{BETRAG_MINIJOB}', geprueft: null }

export function faktum(key: string): Faktum | null {
  return fakten[key] ?? null
}
