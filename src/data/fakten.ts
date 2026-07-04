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
  FRIST_ZULASSUNG: { wert: '{FRIST_ZULASSUNG}', geprueft: null },
  BETRAG_ZULASSUNG: { wert: '{BETRAG_ZULASSUNG}', geprueft: null },
  FRIST_RUNDFUNKBEITRAG: { wert: '{FRIST_RUNDFUNKBEITRAG}', geprueft: null },
  FRIST_VERSICHERUNG: { wert: '{FRIST_VERSICHERUNG}', geprueft: null },
  FRIST_ADRESSAENDERUNG: { wert: '{FRIST_ADRESSAENDERUNG}', geprueft: null }
}

export function faktum(key: string): Faktum | null {
  return fakten[key] ?? null
}
