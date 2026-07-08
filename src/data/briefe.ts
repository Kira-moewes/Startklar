// Kuratierter Brief-Entschlüsseler (ohne KI): häufige, angsteinflößende Briefe
// rund um die erste eigene Wohnung – in ruhiger Sprache eingeordnet und mit
// einem kleinsten ersten Schritt. Jeder Brief brückt in die passende Aufgabe.

export type Dringlichkeit = 'hoch' | 'mittel' | 'niedrig'

export type Briefart = {
  id: string
  titel: string
  // Erkennungshilfen: Absender/Betreff-Stichworte zum Suchen und Wiedererkennen.
  stichworte: string[]
  einordnung: string // Was ist das? Ruhig, entdramatisierend.
  frist: string // Wie viel Zeit hast du (menschenlesbar).
  dringlichkeit: Dringlichkeit
  ersterSchritt: string // Ein 2-Minuten-Schritt.
  quest: { journeyId: string; taskId: string }
}

export const briefarten: Briefart[] = [
  {
    id: 'meldeaufforderung',
    titel: 'Aufforderung zur Anmeldung (Bürgeramt / Meldebehörde)',
    stichworte: ['bürgeramt', 'meldebehörde', 'einwohnermeldeamt', 'anmeldung', 'meldepflicht', 'ummelden', 'wohnsitz'],
    einordnung: 'Die Stadt möchte, dass du deinen neuen Wohnsitz offiziell anmeldest. Das ist ein Standard­vorgang – kein Vorwurf, sondern Routine. Fast alle müssen das nach einem Umzug machen.',
    frist: 'Meist innerhalb von zwei Wochen nach Einzug – ein verpasster Tag ist noch kein Drama.',
    dringlichkeit: 'mittel',
    ersterSchritt: 'Schau auf der Website deiner Stadt, ob es einen Online-Termin fürs Bürgeramt gibt, und leg dir Ausweis + Mietvertrag bereit.',
    quest: { journeyId: 'erste-wohnung', taskId: 'anmeldung-amt' },
  },
  {
    id: 'rundfunkbeitrag',
    titel: 'Brief vom „Beitragsservice" (Rundfunkbeitrag / GEZ)',
    stichworte: ['rundfunk', 'beitragsservice', 'gez', 'ard', 'zdf', 'rundfunkbeitrag', 'anmeldung wohnung'],
    einordnung: 'Der Beitragsservice schreibt jeden neuen Haushalt an. Das wirkt streng, ist aber nur eine automatische Meldung. Wichtig: Pro Wohnung zahlt nur einer – wenn du in einer WG oder bei Familie mitzahlst, musst du selbst nichts extra zahlen.',
    frist: 'Du hast Zeit zu antworten – handle in den nächsten Tagen, nicht in Minuten.',
    dringlichkeit: 'mittel',
    ersterSchritt: 'Prüfe, ob in deinem Haushalt schon jemand zahlt. Falls du BAföG oder Sozialleistungen bekommst, merk dir das Stichwort „Befreiung".',
    quest: { journeyId: 'erste-wohnung', taskId: 'rundfunkbeitrag' },
  },
  {
    id: 'nebenkostenabrechnung',
    titel: 'Nebenkosten- / Betriebskostenabrechnung',
    stichworte: ['nebenkosten', 'betriebskosten', 'abrechnung', 'nachzahlung', 'guthaben', 'heizkosten', 'vermieter'],
    einordnung: 'Einmal im Jahr rechnet der Vermieter ab, was Heizung, Wasser und Müll wirklich gekostet haben. Es kann eine Nachzahlung ODER ein Guthaben herauskommen. Du darfst die Abrechnung in Ruhe prüfen – sie ist nicht sofort fällig, nur weil sie im Briefkasten liegt.',
    frist: 'Eine Nachzahlung ist meist erst in ein paar Wochen fällig; Einwände kannst du bis zu 12 Monate lang erheben.',
    dringlichkeit: 'niedrig',
    ersterSchritt: 'Such die eine Zahl unten: „Nachzahlung" oder „Guthaben". Mehr musst du heute nicht verstehen.',
    quest: { journeyId: 'erste-wohnung', taskId: 'nebenkosten-kaution' },
  },
  {
    id: 'mietvertrag-kaution',
    titel: 'Mietvertrag / Forderung der Kaution',
    stichworte: ['mietvertrag', 'kaution', 'kaltmiete', 'staffelmiete', 'übergabe', 'vermieter', 'wohnung'],
    einordnung: 'Bevor du einziehst, willst du wissen, worauf du dich einlässt – und die Kaution ist gesetzlich begrenzt (höchstens drei Kaltmieten). Kein Grund zur Eile: Du unterschreibst erst, wenn du es verstanden hast.',
    frist: 'Kein festes Datum – Tempo bestimmst du, nicht der Brief.',
    dringlichkeit: 'niedrig',
    ersterSchritt: 'Such im Vertrag die Kaltmiete und rechne ×3 – so viel darf die Kaution höchstens sein.',
    quest: { journeyId: 'erste-wohnung', taskId: 'mietvertrag' },
  },
  {
    id: 'strom-grundversorgung',
    titel: 'Post vom Stromanbieter (Grundversorgung / Abschlag)',
    stichworte: ['strom', 'energie', 'grundversorgung', 'abschlag', 'zählerstand', 'stadtwerke', 'anbieter'],
    einordnung: 'Ziehst du ein, ohne selbst einen Vertrag zu wählen, landest du automatisch beim örtlichen Grundversorger – das ist erlaubt, aber oft teurer. Der Brief will meist nur deinen Zählerstand oder kündigt einen monatlichen Abschlag an.',
    frist: 'Ein paar Tage Zeit – in Ruhe vergleichen lohnt sich mehr als schnell handeln.',
    dringlichkeit: 'niedrig',
    ersterSchritt: 'Fotografiere deinen Stromzähler mit der Zahl – die brauchst du gleich als Erstes.',
    quest: { journeyId: 'erste-wohnung', taskId: 'strom-internet' },
  },
]

// Einfache Stichwort-Suche für das Eingabefeld.
export function findeBriefarten(suche: string): Briefart[] {
  const q = suche.trim().toLowerCase()
  if (!q) return briefarten
  return briefarten.filter(
    b =>
      b.titel.toLowerCase().includes(q) ||
      b.stichworte.some(s => s.includes(q) || q.includes(s)),
  )
}

export function briefart(id: string): Briefart | undefined {
  return briefarten.find(b => b.id === id)
}
