export type Faktum = {
  wert: string
  geprueft: string | null
  // Offizielle Quelle (Beleg + verlinkbar). Optional, bis redaktionell gefüllt.
  quelle?: string
}

// Recherchedatum der aktuellen Werte. „geprueft" = an offizieller Quelle
// belegt; die finale redaktionelle Bestätigung erfolgt durch Kira.
const G = '2026-07-20'

// Werte bewusst knapp gehalten (sie werden inline in Sätze eingesetzt) und
// dort, wo sie je Bundesland/Anbieter variieren, ehrlich als Spanne/„meist".
export const fakten: Record<string, Faktum> = {
  FRIST_ANMELDUNG: { wert: 'innerhalb von 2 Wochen', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/bmg/__17.html' },
  BETRAG_RUNDFUNK: { wert: '18,36 € im Monat', geprueft: G, quelle: 'https://www.rundfunkbeitrag.de/' },
  FRIST_STEUER: { wert: '31. Juli des Folgejahres (bei Pflicht); freiwillig bis zu 4 Jahre rückwirkend', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/ao_1977/__149.html' },
  BETRAG_RUECKERSTATTUNG: { wert: 'im Schnitt rund 1.240 €', geprueft: G, quelle: 'https://www.destatis.de/DE/Themen/Staat/Steuern/Lohnsteuer-Einkommensteuer/im-fokus-steuererklaerung.html' },
  FRIST_FAMILIENVERSICHERUNG: { wert: 'bis 25 (in Ausbildung/Studium), sonst bis 23', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/sgb_5/__10.html' },
  ANZAHL_SCHUFA_KOSTENLOS: { wert: 'kostenlos nach Art. 15 DSGVO – jederzeit, nicht nur einmal im Jahr', geprueft: G, quelle: 'https://www.schufa.de/newsroom/schufa/schufa-datenkopie-art-15-dsgvo/index.jsp' },
  FRIST_FUEHRERSCHEIN: { wert: 'je nach Jahrgang gestaffelt (Umtausch alter Führerscheine)', geprueft: G, quelle: 'https://www.bundesregierung.de/breg-de/aktuelles/faq-fuehrerschein-umtausch-1842574' },
  BETRAG_FUEHRERSCHEIN: { wert: 'meist 3.000–4.500 € (je nach Region und Fahrstunden)', geprueft: G, quelle: 'https://www.ace.de/ratgeber/verkehrsrecht/fuehrerschein/fuehrerscheinkosten/' },
  FRIST_ZULASSUNG: { wert: 'möglichst zeitnah (Faustregel etwa 1 Woche)', geprueft: G, quelle: 'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/kfz-zulassung/auto-ummelden/' },
  BETRAG_ZULASSUNG: { wert: 'rund 20–30 € (bundesweit einheitlich)', geprueft: G, quelle: 'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/kfz-zulassung/auto-ummelden/' },
  FRIST_RUNDFUNKBEITRAG: { wert: 'innerhalb von 1 Monat nach Einzug', geprueft: G, quelle: 'https://www.rundfunkbeitrag.de/anmelden/index_ger.html' },
  FRIST_VERSICHERUNG: { wert: 'meist bis 30. November (zum Jahresende)', geprueft: G, quelle: 'https://www.finanztip.de/kfz-versicherung/kuendigen/' },
  FRIST_ADRESSAENDERUNG: { wert: 'innerhalb von 2 Wochen (meist bei der Ummeldung)', geprueft: G, quelle: 'https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99008001011001' },
}

// Neu hinzugefügte Fakten
fakten['STATUS_ALTERSVORSORGEDEPOT'] = { wert: 'ein gefördertes Altersvorsorgedepot ist ab 2027 geplant', geprueft: G, quelle: 'https://www.bundesfinanzministerium.de/' }
fakten['ALTER_KINDERGELD_MAX'] = { wert: 'bis zur Vollendung des 25. Lebensjahres', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/estg/__32.html' }
fakten['BETRAG_DTICKET'] = { wert: '63 € im Monat', geprueft: G, quelle: 'https://www.bundesregierung.de/breg-de/aktuelles/deutschlandticket-2134074' }
fakten['HAUSHALT_50_30_20'] = { wert: '50 % Fixkosten, 30 % Wünsche, 20 % Sparen (jeweils vom Netto)', geprueft: G, quelle: 'https://www.verbraucherzentrale.de/' }

// Fakten für erste-wohnung & start
fakten['BUSSGELD_ANMELDUNG'] = { wert: 'bis zu 1.000 €', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/bmg/__54.html' }
fakten['ANZAHL_KALTMIETEN_KAUTION'] = { wert: 'höchstens 3 Kaltmieten', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/bgb/__551.html' }
fakten['FRIST_KUENDIGUNG_STROM'] = { wert: 'Grundversorgung 2 Wochen; Sondervertrag nach Erstlaufzeit max. 1 Monat', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/stromgvv/__20.html' }
fakten['BETRAG_PERSO'] = { wert: '27,60 € (unter 24) bzw. 46,00 € (ab 24)', geprueft: G, quelle: 'https://www.personalausweisportal.de/' }
fakten['FRIST_WIDERRUF'] = { wert: '14 Tage', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/bgb/__355.html' }
fakten['FRIST_KK_WECHSEL'] = { wert: '12 Monate gebunden, dann 2 Monate Kündigungsfrist', geprueft: G, quelle: 'https://www.gesetze-im-internet.de/sgb_5/__175.html' }
fakten['BETRAG_PLASMA'] = { wert: 'meist 25–40 € pro Spende (je Zentrum)', geprueft: G, quelle: 'https://www.octapharmaplasma.de/aufwandsentschaedigung/' }
fakten['FRIST_BAFOEG'] = { wert: 'erst ab dem Antragsmonat – nicht rückwirkend', geprueft: G, quelle: 'https://www.xn--bafg-7qa.de/' }
fakten['BETRAG_MINIJOB'] = { wert: '603 € im Monat', geprueft: G, quelle: 'https://www.minijob-zentrale.de/' }

export function faktum(key: string): Faktum | null {
  return fakten[key] ?? null
}

// Ersetzt alle {TOKEN} in einem Text durch den zugehörigen Fakt-Wert.
// Unbekannte Tokens bleiben unverändert stehen (sichtbarer Hinweis auf eine
// noch nicht angelegte Zahl). Ist ein Fakt-Wert selbst noch Platzhalter,
// bleibt der Token faktisch stehen – bis er redaktionell gefüllt ist.
export function fuelleFakten(text: string): string {
  return text.replace(/\{([A-Z0-9_]+)\}/g, (ganz, key) => fakten[key]?.wert ?? ganz)
}
