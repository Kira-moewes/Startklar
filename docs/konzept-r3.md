# Startklar – Konzept Runde 3

**Thema:** KI-Assistent „Klaro" + Profilseite & Einstellungen (inkl. Design-Anpassung)
**Status:** Planung abgeschlossen – bereit zur Umsetzung
**Stand:** Juli 2026

Dieses Dokument ist so geschrieben, dass in der Code-Runde nur noch implementiert
werden muss: Jede Entscheidung ist getroffen, jedes Arbeitspaket benennt Dateien,
Datentypen und Akzeptanzkriterien.

> **Nicht Teil dieser Runde:** Das visuelle Redesign (ZIP-Datei) wird separat im
> Code-Modus umgesetzt. Arbeitspaket 1 (Theming-Fundament) ist bewusst so
> geschnitten, dass es die technische Grundlage dafür legt.

---

## 1. Kritische Prüfung der Ideen

### 1.1 Idee: „Ein KI-Agent, der ALLE Fragen des Nutzers beantwortet"

**Was daran gut ist:** Die App hat inzwischen viele Bereiche (4 Journeys, 7
Vergleichskategorien, Termine, Fortschritt, Suche). Ein Assistent, der Fragen
versteht und direkt zur richtigen Stelle führt, senkt die Hürde deutlich –
gerade für die Zielgruppe, die von Behörden-Themen ohnehin überfordert ist.

**Wo die Idee in dieser Form nicht trägt – und wie wir sie retten:**

| Problem | Konsequenz für das Konzept |
|---|---|
| **„Alle Fragen" ist nicht einlösbar.** Die App verspricht im Footer „Keine Rechtsberatung" (`src/components/Layout.tsx`). Ein Agent, der frei über Mietrecht oder Steuern spricht, überschreitet diese Grenze. | Der Agent beantwortet Fragen **zu den Inhalten und Funktionen der App** und verweist bei allem darüber hinaus ehrlich auf seine Grenzen („Das kann ich nicht beurteilen – aber hier ist der Schritt, der dir weiterhilft"). |
| **Halluzinationsgefahr bei Fakten.** Alle Beträge und Fristen sind noch ungeprüfte `{PLATZHALTER}` (`src/data/fakten.ts`, `geprueft: null`). Eine Cloud-KI würde plausibel klingende, aber ungeprüfte Zahlen erfinden. | Antworten nennen Fristen/Beträge **nur aus der Wissensbasis** und kennzeichnen ungeprüfte Fakten („wird gerade geprüft") – gleiche Logik wie in `TaskDetail.tsx`. |
| **Eine Cloud-KI kollidiert mit dem Kernversprechen.** README und Konzept v2: „Alle Nutzerdaten bleiben lokal auf dem Gerät." Jede LLM-Anfrage verlässt das Gerät, kostet Geld pro Anfrage und bricht die Offline-Fähigkeit der PWA. | **Hybrid-Architektur** (Entscheidung aus der Rückfrage): Ein lokaler Assistent ist der Standard – offline, kostenlos, privat. Die Cloud-KI ist ein **Opt-in** in den Einstellungen, mit eigenem Datenschutzhinweis. |
| **Ein Chatbot ohne App-Zustand wäre austauschbar.** Was ChatGPT nicht kann: wissen, was DU schon erledigt hast. | **Eigene Idee:** Der Agent kennt Profil, Fortschritt und Termine (alles lokal vorhanden) und beantwortet damit die wertvollsten Fragen überhaupt: „Was ist mein nächster Schritt?", „Was ist überfällig?" |

**Fazit:** Idee angenommen, aber als *hybrider Guide mit Guardrails* statt
als allwissender Chatbot. Jede Antwort verlinkt ihre Quelle in der App –
das erfüllt die zweite Hälfte der Anforderung („verweist auf die korrekte
Stelle") und macht Antworten überprüfbar.

### 1.2 Idee: „Nutzer-Profilseite + Einstellungen (z. B. Design anpassen)"

**Was daran gut ist:** `/profil` ist aktuell nur ein Alias auf das komplette
Onboarding (`src/App.tsx`, Zeile 30). Wer eine einzige Antwort ändern will
(z. B. „habe jetzt ein Auto"), muss alle 7 Fragen neu durchklicken. Eine echte
Profilseite behebt einen realen Schmerzpunkt.

**Was die Idee unterschätzt:**

- **Design anpassen braucht ein Fundament.** Die Farbtokens sind hart in
  `@theme` kodiert (`src/index.css`) – es gibt derzeit keinen Mechanismus für
  Dark Mode oder Akzentfarben. Der Token-Umbau ist das eigentliche Arbeitspaket;
  die Schalter in den Einstellungen sind danach trivial.
- **Es fehlt der wichtigste Einstellungs-Block: Datenhoheit.** Alle Daten
  liegen ausschließlich in IndexedDB. Handy weg / Browserdaten gelöscht /
  Gerätewechsel = kompletter Fortschritt weg. **Eigene Idee:** Export/Import
  als JSON-Datei + „Alles löschen" mit Bestätigung. Das stärkt zugleich das
  Datenschutz-Versprechen (DSGVO-Gedanke: Auskunft & Löschung, ganz ohne Server).

**Fazit:** Idee angenommen und erweitert um Datenhoheit, Sichtbarkeits-Vorschau
beim Ändern von Antworten und die KI-Einstellungen (Opt-in-Schalter gehören
logisch hierher).

### 1.3 Weitere eigene Ideen, die einfließen

1. **Quick-Chips** im Chat („Nächster Schritt", „Was ist überfällig?", „Was
   kannst du?") – die meisten Nutzer:innen wollen nicht tippen.
2. **Aktionen mit Bestätigung** (Entscheidung aus der Rückfrage): Der Agent
   kann einen Termin vorbereiten, einen Schritt als erledigt vorschlagen oder
   direkt navigieren – ausgeführt wird erst nach Tap auf „Ja, machen".
3. **App-Hilfe als Wissensbasis:** Bisher erklärt niemand die App selbst
   („Wie kriege ich einen Termin in meinen Kalender?" → ICS-Export). Der Agent
   bekommt dafür eigene FAQ-Einträge.
4. **Schriftgröße & reduzierte Animationen** als Barrierefreiheits-Gewinn, der
   fast gratis mitkommt, wenn das Theming ohnehin umgebaut wird.

---

## 2. Architektur: KI-Assistent „Klaro"

Arbeitsname **„Klaro"** – passt zum App-Namen, klingt nach Antwort („Klaro!")
und macht klar, dass es ein Helfer ist, kein Mensch.

### 2.1 Überblick

```
Nutzerfrage
   │
   ▼
[1] Intent-Erkennung (regelbasiert, lokal) ──▶ Treffer: strukturierte Antwort
   │  kein Intent                                  aus App-Zustand (+ Aktion)
   ▼
[2] Retrieval über Wissensbasis (lokal) ─────▶ Treffer: Antwort + Deep-Links
   │  schwacher/kein Treffer
   ▼
[3] Cloud-KI aktiviert? ──nein──▶ ehrliche Fallback-Antwort + beste Links
   │  ja
   ▼
[4] Serverless Function → Claude API → Antwort mit Verweisen/Aktionsvorschlägen
```

Stufen 1–2 laufen **immer lokal** (offline-fähig, keine Kosten, keine Daten
verlassen das Gerät). Stufe 4 ist strikt Opt-in.

### 2.2 Neue Dateien (Agent-Kern, lokal)

```
src/lib/retrieval.ts            – gemeinsames Such-/Scoring-Modul (auch für /suche)
src/data/agent/types.ts         – AgentMessage, AgentAction, WissensEintrag …
src/data/agent/wissensbasis.ts  – baut Einträge aus journeys + vergleich + faq
src/data/agent/faq.ts           – App-Hilfe-Einträge (redaktioneller Inhalt)
src/data/agent/synonyme.ts      – Synonym-Lexikon
src/data/agent/intents.ts       – Intent-Regeln + Antwortbau aus App-Zustand
src/hooks/useAgent.ts           – Chat-Zustand, Persistenz, Antwort-Pipeline
```

### 2.3 Datentypen (verbindlich für die Code-Runde)

```ts
// src/data/agent/types.ts
export type AgentRolle = 'nutzer' | 'klaro'

export type AgentLink = { label: string; route: string }   // route = interner Pfad

export type AgentAction =
  | { typ: 'navigiere'; route: string; label: string }
  | { typ: 'termin-vorschlag'; titel: string; journeyId?: string; taskId?: string }
  | { typ: 'erledigt-vorschlag'; journeyId: string; taskId: string; titel: string }

export type AgentMessage = {
  id: string                    // crypto.randomUUID()
  rolle: AgentRolle
  text: string
  links?: AgentLink[]           // "Korrekte Stelle in der App"
  actions?: AgentAction[]       // werden als Karten mit Bestätigen-Button gerendert
  quelle?: 'lokal' | 'ki'       // Badge im UI: lokale vs. KI-Antwort
  zeit: string                  // ISO-Timestamp
}

export type WissensEintrag = {
  id: string
  art: 'task' | 'vergleich' | 'faq'
  titel: string
  text: string                  // durchsuchbarer Volltext
  route: string                 // Deep-Link
  kategorie?: TaskCategory
}
```

### 2.4 Wissensbasis (`wissensbasis.ts`)

Wird **zur Laufzeit einmalig** (Modul-Scope, memoisiert) aus vorhandenen Daten
gebaut – keine Duplikation von Inhalten:

- je Task aus `journeys` (`src/data/index.ts`): `titel`, Text aus
  `summary + steps + deadline + consequence`, Route `/journey/{j.id}/task/{t.id}`
- je Vergleichskategorie aus `vergleichsKategorien` (`src/data/vergleich.ts`):
  Text aus `titel + intro + tipps`, Route `/vergleich/{k.id}`
- je FAQ-Eintrag aus `faq.ts`, Route auf die betreffende Seite

**FAQ-Inhalte (redaktionell, in `faq.ts` anzulegen – mind. diese 12):**
Onboarding neu machen · einzelne Profil-Antwort ändern · Schritt abhaken /
rückgängig · Termin anlegen · Termin in Kalender exportieren (ICS) · eigenes
Angebot im Vergleich eintragen · Favorit markieren · Suche benutzen ·
Daten exportieren/importieren · alle Daten löschen · Dark Mode einschalten ·
Was ist der KI-Modus / was passiert mit meinen Daten?

### 2.5 Retrieval (`src/lib/retrieval.ts`)

Die vorhandene `normalisiere()`-Funktion aus `src/pages/Suche.tsx` (Zeile 28)
zieht hierher um und wird zu einem kleinen Scoring erweitert – **keine neue
Dependency**:

```ts
export function normalisiere(s: string): string      // wie bisher (ä→ae …)
export function tokenisiere(s: string): string[]     // split, Stopwörter raus, Synonyme expandieren
export function score(queryTokens: string[], eintrag: WissensEintrag): number
// Gewichte: Treffer im Titel ×3, im Text ×1; Präfix-Match zählt halb („kau" → „kaution")
export function suche(query: string, eintraege: WissensEintrag[], limit?: number): Treffer[]
```

`src/pages/Suche.tsx` wird auf dasselbe Modul umgestellt (Verhalten der Seite
bleibt gleich, Sortierung „relevant zuerst" bleibt) – ein Suchindex, zwei
Verbraucher.

**Synonym-Lexikon (`synonyme.ts`), Startbestand (erweiterbar):**
ummelden/umzug→anmeldung · miete/mietvertrag→wohnung · knete/kohle→geld ·
kfz/wagen→auto · krankenkasse→krankenversicherung · gez→rundfunkbeitrag ·
konto→girokonto · steuern→steuererklaerung · handyvertrag→handy ·
lappen→fuehrerschein

### 2.6 Intents (`intents.ts`)

Regelbasiert (Stichwort-/Mustererkennung auf der normalisierten Eingabe),
Reihenfolge = Priorität:

| Intent | Auslöser (Beispiele) | Antwort (nutzt App-Zustand) |
|---|---|---|
| `was-kannst-du` | „hilfe", „was kannst du", leerer Chat | Fähigkeiten + Quick-Chips |
| `naechster-schritt` | „nächster schritt", „was soll ich tun", „womit anfangen" | erster nicht erledigter, relevanter Task (Reihenfolge: `journeys` × `relevanteTasks` × `useAllProgress`) + Link + Aktion `navigiere` |
| `ueberfaellig` | „überfällig", „verpasst", „deadline" | Termine mit `datum < heute && !erledigt` aus `useTermine` + Link `/termine` |
| `fortschritt` | „wie weit bin ich", „fortschritt" | erledigt/gesamt je Journey (wie Dashboard) + Link `/fortschritt` |
| `termin-anlegen` | „erinnere mich", „termin für X" | Aktion `termin-vorschlag` (Titel aus bestem Retrieval-Treffer zu X) |
| `profil-aendern` | „bin umgezogen", „habe jetzt ein auto", „profil ändern" | Link `/profil` + Hinweis, welche Frage gemeint sein dürfte |

Kein Intent → Retrieval (2.5). Bestes Ergebnis < Mindest-Score → Stufe 3/4.

### 2.7 Cloud-KI (Opt-in, Stufe B)

- **Function:** plattformneutraler Handler `src/server/agentHandler.ts`
  (reine Request/Response-Logik) + zwei dünne Adapter: `api/agent.ts` (Vercel)
  und `netlify/functions/agent.ts`. So bleibt die Doppel-Hosting-Strategie
  (vercel.json + netlify.toml) erhalten.
- **Modell:** `claude-haiku-4-5` (schnell, günstig; Antwortqualität reicht für
  diesen scharf umrissenen Anwendungsfall). Max ~1024 Output-Tokens.
- **System-Prompt** enthält: Rolle („Klaro, Assistent der Startklar-App"),
  Guardrails (keine Rechts-/Steuer-/Finanzberatung; keine Fristen/Beträge
  erfinden – nur aus mitgelieferter Wissensbasis; auf Deutsch, du-Form, kurz),
  kompakte Wissensbasis (Titel + Kurztext + Route aller Einträge, ~15 kB) und
  das Antwortformat.
- **Strukturierte Antwort** via Tool-Use: ein Tool `antworte` mit Schema
  `{ text, links[], actions[] }` → mappt 1:1 auf `AgentMessage`; damit kann
  auch die Cloud-Antwort auf die „korrekte Stelle in der App" verweisen und
  Aktionen vorschlagen.
- **Request-Payload** (Client → Function): `{ frage, verlauf (letzte 6 Nachrichten), kontext? }`.
  `kontext` (Kurz-Zusammenfassung aus Profil + offenen Schritten + nächsten
  Terminen, max ~500 Zeichen) wird **nur** mitgeschickt, wenn der separate
  Schalter „Kontext mitschicken" aktiv ist.
- **Schutz:** einfaches Rate-Limit (z. B. 20 Anfragen/Stunde/IP, In-Memory
  reicht für den Anfang), Payload-Größenlimit, CORS nur eigene Origin,
  `ANTHROPIC_API_KEY` als Server-Env-Variable (niemals im Client).
- **Fallbacks:** offline / Fehler / Limit erreicht → lokale Antwort aus Stufe 2
  mit ehrlichem Hinweis („KI gerade nicht erreichbar – das hier hilft dir aus
  der App weiter").
- **Datenschutz:** Aktivierung zeigt einmalig einen Hinweisdialog (was wird
  gesendet, wohin, keine Speicherung). `src/pages/Datenschutz.tsx` bekommt
  einen vorbereiteten Absatz-Baustein (finaler Text weiterhin via eRecht24).

### 2.8 Agent-UI

```
src/components/agent/AgentButton.tsx   – FAB unten rechts, auf allen Seiten (in Layout.tsx)
src/components/agent/AgentPanel.tsx    – mobil: Bottom-Sheet (~85dvh), Desktop (≥sm): Panel rechts (~420px)
src/components/agent/MessageBubble.tsx – Text + Links (als Pill-Buttons) + Quelle-Badge („lokal"/„KI")
src/components/agent/ActionCard.tsx    – Aktionsvorschlag mit „Ja, machen" / „Lieber nicht"
src/components/agent/QuickChips.tsx    – Vorschlags-Chips (kontextabhängig, s. u.)
```

- **Verlauf** in localforage-Store `agent-chat` (Instanz analog `useTermine`),
  max. 100 Nachrichten (älteste fliegen raus), löschbar in den Einstellungen
  und im Panel selbst.
- **Aktions-Ausführung nach Bestätigung:** `navigiere` → `useNavigate`;
  `termin-vorschlag` → vorhandener Deep-Link-Mechanismus
  `/termine?neu=1&titel=…&journey=…&task=…` (bereits implementiert, s.
  `TaskDetail.tsx` Zeile 104); `erledigt-vorschlag` → `useProgress(journeyId).toggle(taskId)`.
- **Quick-Chips kontextabhängig:** auf Task-Seiten zusätzlich „Erklär mir
  diesen Schritt"; auf `/termine` „Was ist überfällig?"; Standard: „Nächster
  Schritt", „Wie weit bin ich?", „Was kannst du?".
- **A11y:** Panel als `role="dialog"` mit Fokus-Falle, Esc schließt,
  `aria-live="polite"` für neue Antworten, FAB mit `aria-label="Klaro fragen"`.

---

## 3. Architektur: Profil & Einstellungen

### 3.1 Routing & Navigation

- `src/pages/Profil.tsx` **neu**; Route `/profil` zeigt sie (Alias auf
  `Onboarding` in `App.tsx` Zeile 30 entfällt). `/onboarding` bleibt für den
  Erstlauf unverändert.
- `Layout.tsx`: Nav-Eintrag „Profil" ergänzen; der Link „Profil anpassen" auf
  der Startseite (`Home.tsx` Zeile 54) zeigt weiter auf `/profil` und landet
  damit automatisch auf der neuen Seite.

### 3.2 Aufbau der Seite (eine Seite, zwei Abschnitte)

**Abschnitt „Dein Profil":**
- Je Frage aus `fragen` (`src/data/profile.ts`) eine Karte: Fragetitel, aktuell
  gewählte Antwort (Label, nicht Rohwert), Tap öffnet die Optionsliste inline
  (gleiches Button-Design wie Onboarding).
- Beim Ändern: sofort speichern via `useProfile.save`, danach
  **Sichtbarkeits-Vorschau** als Toast/Zeile: Differenz der sichtbaren Schritte
  vorher/nachher via `relevanteTasks` über alle `journeys` („✓ Gespeichert –
  3 Schritte neu für dich eingeblendet").
- Unbeantwortete Fragen (Onboarding übersprungen): Karte zeigt „Noch nicht
  beantwortet".
- Fußlink: „Onboarding komplett neu starten" → `/onboarding`.

**Abschnitt „Einstellungen":**

| Gruppe | Optionen | Verhalten |
|---|---|---|
| Darstellung | Modus: Hell / Dunkel / System · Akzentfarbe: Koralle (Standard) / Olive / Himmel / Beere · Schriftgröße: S / M / L · Weniger Animationen: an/aus | sofort wirksam, Vorschau live |
| Klaro (KI) | KI-Modus an/aus · „Kontext mitschicken" an/aus (nur sichtbar wenn KI-Modus an) · Chatverlauf löschen | Aktivieren zeigt einmalig Hinweisdialog (s. 2.7) |
| Deine Daten | „Daten exportieren" (JSON-Download) · „Daten importieren" (Datei wählen) · „Alles löschen" | Löschen mit Bestätigungsdialog (Texteingabe nicht nötig, aber zweistufig) |
| Über | App-Version, Links Impressum/Datenschutz, „Keine Rechtsberatung"-Hinweis | statisch |

### 3.3 Settings-Persistenz & Anwendung

```ts
// src/hooks/useSettings.ts
export type Einstellungen = {
  theme: 'hell' | 'dunkel' | 'system'      // default 'system'
  akzent: 'koralle' | 'olive' | 'himmel' | 'beere'  // default 'koralle'
  schrift: 's' | 'm' | 'l'                 // default 'm'
  wenigerAnimation: boolean                // default false
  kiModus: boolean                         // default false
  kiKontext: boolean                       // default false
}
```

- localforage-Store `einstellungen` (Instanz-Muster wie `useProfile.ts`).
- **React-Context** `SettingsProvider` (in `main.tsx` um `<App/>`), damit
  Layout, Agent und Profilseite denselben Zustand sehen – anders als bei
  `useProfile` (mehrfach instanziierter Hook) muss eine Änderung hier sofort
  überall greifen.
- Anwendung als Attribute auf `<html>`: `data-theme` (aufgelöst: system →
  `matchMedia('(prefers-color-scheme: dark)')` + Listener), `data-akzent`,
  `data-schrift`, `data-motion`.
- **Flash-Vermeidung:** Da IndexedDB asynchron ist, wird die letzte Auswahl
  zusätzlich als Spiegel-Kopie in `localStorage('startklar-theme')` gehalten
  und von einem 3-Zeilen-Inline-Script in `index.html` vor dem ersten Paint
  auf `<html>` gesetzt.

### 3.4 Datenexport / -import / Löschen

```ts
// src/lib/datenExport.ts
export async function exportiereAlles(): Promise<Blob>   // JSON-Download
export async function importiereAlles(file: File): Promise<ImportErgebnis>
export async function loescheAlles(): Promise<void>
```

- **Format:** `{ version: 1, exportiertAm: ISO, stores: { profil, progress, "progress-dates", termine, vergleich, einstellungen, "agent-chat" } }` –
  je Store alle Key/Value-Paare (via `store.iterate`). Die 5 bestehenden
  Store-Namen sind in den Hooks verifiziert (`useProfile`, `useProgress` ×2,
  `useTermine`, `useVergleich`); dazu kommen die 2 neuen.
- Die `createInstance`-Aufrufe ziehen in ein zentrales Modul
  `src/lib/stores.ts` um, damit Export/Import/Löschen und die Hooks garantiert
  dieselben Instanzen verwenden (Hooks importieren von dort – reine
  Umzugs-Änderung, kein Verhaltensunterschied).
- **Import:** validiert `version` + Grundstruktur, überschreibt vollständig
  (kein Merge – einfacher und vorhersagbar), zeigt vorher an, was in der Datei
  steckt („Profil, 12 erledigte Schritte, 3 Termine …"). Danach `location.reload()`.
- **Löschen:** `loescheAlles()` leert alle Stores + `localStorage`-Spiegel,
  dann Reload → App startet im Ausgangszustand (Onboarding-Karte).

---

## 4. Theming-Umbau (AP1 – Fundament)

**Prinzip: Token-Namen bleiben, Werte werden themefähig.** Alle bestehenden
Klassen (`text-pine`, `bg-cream`, `border-pine-mist` …) funktionieren
unverändert weiter → minimaler Diff, kein Risiko flächiger Regressionen.

```css
/* src/index.css – Zielstruktur */
:root {
  --hue-pine: #1B3931;         /* … alle 11 Hell-Werte wie heute */
  --hue-akzent: #F47B5B;       /* koralle */
  --hue-akzent-tief: #D95F41;
}
:root[data-akzent='olive']  { --hue-akzent: #7C8A4E; --hue-akzent-tief: #606C38; }
:root[data-akzent='himmel'] { --hue-akzent: #4E7C8A; --hue-akzent-tief: #38606C; }
:root[data-akzent='beere']  { --hue-akzent: #8A4E6E; --hue-akzent-tief: #6C3852; }
:root[data-theme='dunkel']  { /* dunkle Gegenwerte aller Tokens */ }

@theme inline {
  --color-pine: var(--hue-pine);
  --color-coral: var(--hue-akzent);
  --color-coral-deep: var(--hue-akzent-tief);
  /* … restliche Tokens analog */
}
```

- `@theme inline` sorgt dafür, dass Tailwind-Utilities die `var()`-Referenz
  ausgeben (statt den Wert einzubrennen) – nur so greift der Attribut-Wechsel
  zur Laufzeit. Opazitäts-Modifier (`text-ink/70`) funktionieren in Tailwind 4
  via `color-mix()` auch mit Variablen.
- **Dunkle Palette** (Startvorschlag, in der Code-Runde feinjustieren):
  Hintergrund `#141D1A`, Karte `#1C2723`, Text `#EDE9DC`, Pine→helles Salbei
  `#A7C4B5`, Mist→`#2A3833`, Koralle bleibt (funktioniert auf dunkel), Kontrast
  je Paarung ≥ 4.5:1 (WCAG AA) prüfen.
- **Schriftgröße:** `:root[data-schrift='s'] { font-size: 93.75% }`,
  `'l' { font-size: 112.5% }` – wirkt global, weil das Layout rem-basiert ist.
- **Weniger Animationen:** `:root[data-motion='reduziert'] * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important }`;
  zusätzlich respektiert `system`-Default `prefers-reduced-motion`.
- **Aufräumen:** hartkodierte Hexwerte ersetzen – `TaskDetail.tsx` Zeile 66
  (`#f9d9d3`, `#a84a3a`) bekommt zwei neue Tokens (`--color-warn-bg`,
  `--color-warn-text`) mit Dunkel-Varianten.
- `index.html`: `<meta name="theme-color">` dynamisch nachziehen (PWA-Leiste).

---

## 5. Arbeitspakete

Reihenfolge: **AP1 → (AP2 ∥ AP3) → AP4 → AP5 → AP6 → AP7.**
AP6 ist bewusst abtrennbar – die App ist nach AP5 voll funktionsfähig ohne Cloud.
Schätzungen in Fokus-Sessions (½ Tag ≈ 1 Session).

### AP1 – Theming-Fundament (≈ 1 Session)
**Dateien:** `src/index.css`, `index.html`, `src/main.tsx`, neu `src/hooks/useSettings.ts`, neu `src/lib/stores.ts`, `src/pages/TaskDetail.tsx` (Hex-Bereinigung)
**Inhalt:** Token-Umbau (Abschnitt 4), `Einstellungen`-Typ + Context + Persistenz, Attribut-Anwendung, Flash-Schutz-Script.
**Akzeptanz:**
- [ ] Umschalten Hell/Dunkel/System wirkt sofort auf allen Seiten, ohne Reload
- [ ] System-Modus folgt dem OS-Wechsel live
- [ ] Akzent/Schriftgröße/Motion wirken global; Reload zeigt keinen Farb-Flash
- [ ] `npm run build` grün; Lighthouse-Kontrast-Check dunkel ≥ AA

### AP2 – Einstellungen-UI + Datenhoheit (≈ 1 Session)
**Dateien:** neu `src/pages/Profil.tsx` (Einstellungs-Abschnitt), neu `src/lib/datenExport.ts`, `src/App.tsx`, `src/components/Layout.tsx`
**Akzeptanz:**
- [ ] Alle Schalter aus Tabelle 3.2 vorhanden und persistent über Reload
- [ ] Export lädt JSON mit allen 7 Stores; Import stellt einen Export exakt wieder her (Roundtrip-Test)
- [ ] „Alles löschen" ist zweistufig und setzt die App nachweisbar auf Werkszustand
- [ ] KI-Schalter zeigt beim ersten Aktivieren den Hinweisdialog

### AP3 – Profilseite (≈ 1 Session)
**Dateien:** `src/pages/Profil.tsx` (Profil-Abschnitt), nutzt `fragen`/`useProfile`/`relevanteTasks`
**Akzeptanz:**
- [ ] Jede der 7 Antworten einzeln änderbar, ohne die anderen zu berühren
- [ ] Nach Änderung erscheint die Sichtbarkeits-Differenz („n Schritte ein-/ausgeblendet")
- [ ] Unbeantwortete Fragen klar erkennbar; Link zum kompletten Onboarding vorhanden
- [ ] `/profil` zeigt die neue Seite; `/onboarding` unverändert

### AP4 – Agent-Kern lokal (≈ 2 Sessions)
**Dateien:** neu `src/lib/retrieval.ts`, `src/data/agent/{types,wissensbasis,faq,synonyme,intents}.ts`, neu `src/hooks/useAgent.ts`, Umstellung `src/pages/Suche.tsx`
**Akzeptanz:**
- [ ] Wissensbasis enthält alle Tasks, alle 7 Vergleichskategorien und ≥ 12 FAQ-Einträge, jeweils mit gültiger Route
- [ ] Alle 6 Intents liefern korrekte Antworten aus echtem App-Zustand (manuell: frisches Profil vs. Profil mit Fortschritt/überfälligem Termin)
- [ ] „ummelden", „GEZ", „Lappen" finden die richtigen Einträge (Synonyme greifen)
- [ ] `/suche` verhält sich unverändert (gleiche Treffer für „kaution", „rundfunk")
- [ ] Fallback-Antwort bei Nonsens-Eingabe ist ehrlich und bietet die 3 besten Links an

### AP5 – Agent-UI (≈ 2 Sessions)
**Dateien:** `src/components/agent/*` (5 Komponenten), `src/components/Layout.tsx` (FAB einhängen)
**Akzeptanz:**
- [ ] FAB auf allen Seiten; Panel öffnet als Bottom-Sheet (mobil) bzw. Seitenpanel (Desktop)
- [ ] Verlauf übersteht Reload, ist auf 100 Nachrichten begrenzt und löschbar
- [ ] Jede der 3 Aktionsarten führt nach Bestätigung die korrekte App-Änderung aus; „Lieber nicht" verwirft folgenlos
- [ ] Link-Tap navigiert und schließt das Panel
- [ ] Tastatur: Esc schließt, Fokus-Falle aktiv, `aria-live` funktioniert (Screenreader-Smoke-Test)

### AP6 – Cloud-KI (≈ 2 Sessions)
**Dateien:** neu `src/server/agentHandler.ts`, `api/agent.ts`, `netlify/functions/agent.ts`, Erweiterung `useAgent.ts`, `src/pages/Datenschutz.tsx` (Baustein)
**Akzeptanz:**
- [ ] Bei aktivem KI-Modus beantwortet Klaro eine freie Frage („Warum brauche ich eine Haftpflicht?") in natürlicher Sprache **mit** Deep-Link
- [ ] „Kontext mitschicken" aus → Request enthält nachweislich kein Profil/Fortschritt
- [ ] Function offline/Fehler/429 → lokaler Fallback mit Hinweis, kein Crash
- [ ] Antwort-Badge unterscheidet „lokal"/„KI"; API-Key nur serverseitig
- [ ] Rate-Limit greift (manueller Test)

### AP7 – Feinschliff & Doku (≈ 1 Session)
**Inhalt:** PWA-Offline-Durchlauf (Agent lokal, Einstellungen, Profil), A11y-Pass über neue Flächen, README v3-Abschnitt finalisieren, tote Klassen/Tokens aufräumen.
**Akzeptanz:** Offline-Modus: alles außer Cloud-KI voll nutzbar; `npm run lint` + `npm run build` grün.

---

## 6. Risiken & offene Punkte

| Punkt | Einschätzung / Entscheidung nötig |
|---|---|
| **Hosting-Festlegung für AP6** | Vercel *und* Netlify sind konfiguriert. Die Function wird für beide vorbereitet (Adapter-Muster), aber der `ANTHROPIC_API_KEY` muss dort gesetzt werden, wo produktiv deployt wird. → Entscheidung von Kira vor AP6; bis dahin blockiert nichts. |
| **API-Kosten** | Haiku + kurze Antworten + Rate-Limit ⇒ grob < 1 ct pro Frage. Bei öffentlicher Verbreitung später Budget-Alarm beim Provider setzen. |
| **Fakten sind Platzhalter** | Klaro kennzeichnet Fristen/Beträge als „wird gerade geprüft" (wie `TaskDetail`). Redaktionelle Prüfung bleibt eigenes, unabhängiges To-do. |
| **Datenschutztext** | Weiterhin Platzhalter (eRecht24, durch Kira). AP6 liefert den inhaltlichen Baustein für den KI-Abschnitt zu. |
| **Design-ZIP / Redesign** | Separater Schritt nach dieser Runde. AP1 ist die Voraussetzung: Sobald alle Farben über Tokens laufen, ist das Redesign primär ein Austausch von Token-Werten + Layout-Anpassungen. |
| **Kein Test-Framework im Repo** | Akzeptanzkriterien sind bewusst manuell prüfbar formuliert. Optional in AP4 `vitest` nur für `retrieval.ts`/`intents.ts` einführen (reine Funktionen, ideal testbar) – Empfehlung: ja, wenn Budget da ist. |

---

## 7. Was nach Umsetzung dieses Konzepts gilt

- Klaro beantwortet Fragen zu allen App-Inhalten **offline, kostenlos und
  privat** – und mit aktiviertem KI-Modus auch frei formulierte Fragen, immer
  mit Verweis auf die korrekte Stelle in der App.
- Nutzer:innen ändern einzelne Profil-Antworten in Sekunden und sehen sofort,
  was sich dadurch ändert.
- Die App sieht aus, wie man es möchte (hell/dunkel, Akzent, Schriftgröße),
  und die eigenen Daten lassen sich mitnehmen, sichern und restlos löschen.
- Das Theming-Fundament macht das anstehende Redesign (ZIP) zu einem
  überschaubaren, risikoarmen Schritt.
