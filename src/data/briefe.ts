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
  // „Schon zu spät?"-Zweig (r7 Kap. 2.4): schamfrei, entdramatisierend – nimmt
  // erlernte Hilflosigkeit gerade denen, die schon hinterher sind.
  zuSpaet: string
  // „Mach's allein"-Skript (r7 Kap. 4b.2 Nr. 5): die wörtliche Formulierung
  // fürs Telefonat / die Mail – für alle ohne jemanden zum Fragen.
  alleinSkript: string
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
    zuSpaet: 'Länger als zwei Wochen her? Das passiert ständig und ist fast nie ein echtes Problem. Melde dich einfach jetzt an – ein Bußgeld ist zwar theoretisch möglich, wird bei ehrlicher, verspäteter Anmeldung aber so gut wie nie verhängt. Sag am Amt ruhig, dass du es nachholst.',
    alleinSkript: 'Am Schalter oder Telefon: „Guten Tag, ich bin umgezogen und möchte mich mit meinem neuen Wohnsitz anmelden. Ich habe Ausweis und Wohnungsgeberbestätigung dabei – was brauchen Sie noch von mir?"',
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
    zuSpaet: 'Schon Mahnungen bekommen? Ruhig bleiben – das lässt sich fast immer klären. Antworte jetzt und erklär deine Lage (in der Wohnung zahlt schon jemand / du hast Anspruch auf Befreiung). Eine rückwirkende Korrektur oder Befreiung ist oft möglich.',
    alleinSkript: '„Guten Tag, ich habe Post vom Beitragsservice erhalten. In meinem Haushalt zahlt bereits [Name/Person] den Beitrag." – oder: „Ich beziehe [BAföG/Leistung] und möchte mich vom Beitrag befreien lassen. Wie gehe ich vor?"',
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
    zuSpaet: 'Die Frist, um Einwände zu erheben, ist lang (in der Regel bis zu 12 Monate). Und selbst wenn eine Nachzahlung schon fällig war: Ruf beim Vermieter an – eine Ratenzahlung ist üblich und lässt sich meist unkompliziert vereinbaren.',
    alleinSkript: 'An den Vermieter: „Guten Tag, ich habe die Nebenkostenabrechnung erhalten und möchte sie in Ruhe prüfen. Falls eine Nachzahlung ansteht, würde ich das gern in Raten zahlen – ginge das?"',
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
    zuSpaet: 'Schon unterschrieben und erst jetzt unsicher? Kein Grund zur Panik – du kannst jede Klausel nachträglich prüfen lassen (Mieterverein, Verbraucherzentrale, oft günstig oder kostenlos). Und die Kaution musst du nicht auf einen Schlag zahlen: Du darfst sie in drei monatlichen Raten aufteilen.',
    alleinSkript: 'An den Vermieter: „Guten Tag, zur Kaution – ich würde diese gern in den drei erlaubten monatlichen Raten zahlen. Ist das für Sie in Ordnung?"',
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
    zuSpaet: 'Schon länger in der teuren Grundversorgung? Da geht nichts verloren – aus der Grundversorgung kommst du jederzeit mit kurzer Frist (meist zwei Wochen) raus. Notier deinen Zählerstand und vergleich in Ruhe; der Wechsel ist unkompliziert.',
    alleinSkript: 'Beim Grundversorger: „Guten Tag, ich bin in [Adresse] eingezogen. Mein Zählerstand ist [Zahl] vom [Datum]. Bitte melden Sie mich an – einen möglichen Anbieterwechsel prüfe ich parallel selbst."',
    quest: { journeyId: 'erste-wohnung', taskId: 'strom-internet' },
  },
]

// Krisen-Weiche (r7 Kap. 2.4): Wenn hinter der Post echte Not steckt, tritt das
// Produkt zurück und verweist auf echte, kostenlose Hilfe. Bewusst knapp,
// stabile, bundesweite Nummern. FAKT VOR LAUNCH PRÜFEN (Nummern/Anbieter).
export type Krisenhilfe = { titel: string; kontakt: string; hinweis: string }

export const krisenhilfen: Krisenhilfe[] = [
  {
    titel: 'Nummer gegen Kummer (bis 25)',
    kontakt: '116 111',
    hinweis: 'Kostenlos & anonym, Mo–Sa. Für alles, was dich belastet – nicht nur Behördenkram.',
  },
  {
    titel: 'TelefonSeelsorge',
    kontakt: '0800 111 0 111',
    hinweis: 'Rund um die Uhr, kostenlos & anonym. Auch per Chat unter online.telefonseelsorge.de.',
  },
  {
    titel: 'Careleaver e.V.',
    kontakt: 'careleaver.de',
    hinweis: 'Von und für junge Menschen, die ohne Familien-Rückhalt starten.',
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
