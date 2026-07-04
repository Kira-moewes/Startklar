# STARTKLAR — Planungskonzept v2

**Stand:** 04.07.2026 · **Branch:** `claude/app-planning-concept-3z98hd`
**Zweck:** Vollständige Spezifikation der nächsten Ausbaustufe. Dieses Dokument ist der Implementierungs-Auftrag — jedes Kapitel ist so konkret, dass daraus direkt Code geschrieben werden kann.

---

## 1. Produktüberblick & Prinzipien

### 1.1 Was Startklar ist

Eine installierbare Web-App (PWA), die 16–24-Jährige personalisiert durch Behördengänge, Verträge und Alltags-To-dos rund um den 18. Geburtstag führt. Kein Login, alle Daten bleiben auf dem Gerät (localforage) — das ist ein Datenschutz- und Vertrauens-Vorteil, kein Provisorium.

### 1.2 Kernprinzip: Neutralität ist der Burggraben (entschieden, nicht verhandelbar)

Die App verdient Geld über Affiliate-Provisionen — aber Vertrauen treibt die Conversion, nicht Link-Dichte. Deshalb gilt strukturell erzwungen:

1. **Jeder Anbieter-Vergleich enthält mindestens eine neutrale, provisionsfreie Option** (z. B. Verbraucherzentrale, offizieller Vergleichsrechner). Das Datenmodell validiert das (siehe 4.1) — es ist technisch unmöglich, einen Vergleich ohne neutrale Option zu rendern.
2. **Jeder Provisionslink ist als „Werbung" gekennzeichnet** (§ 5a UWG / Kennzeichnungspflicht) plus Aufklärungssatz in Jugendsprache.
3. **18+-Gate hart im Rendering-Layer:** Affiliate-Links existieren im DOM nur, wenn `profile.volljaehrig === 'ja'`. Kein Soft-Filter, keine reine UI-Ausblendung — eine einzige Komponente (`AffiliateLink`) kapselt das Gate, und nur sie darf Affiliate-URLs rendern.

### 1.3 Ist-Stand (bereits gebaut, wird weiterverwendet)

| Baustein | Datei(en) | Status |
|---|---|---|
| 4 Journeys (Start, Erste Wohnung, Finanzen, Mobilität), ~30 Aufgaben | `src/data/journeys/*.ts` | ✅ fertig |
| Onboarding (7 Fragen) + lokales Profil | `src/data/profile.ts`, `src/hooks/useProfile.ts`, `src/pages/Onboarding.tsx` | ✅ fertig |
| Sichtbarkeits-Engine (Aufgaben nur wenn relevant) | `src/data/visibility.ts` | ✅ fertig |
| Fakten-System mit „zuletzt geprüft am" | `src/data/fakten.ts` | ✅ Struktur fertig, Werte `[GEGENCHECKEN]` |
| Abhaken + Fortschritt (localforage) | `src/hooks/useProgress.ts` | ✅ fertig, wird um `doneAt` erweitert |
| Dashboard (Ring, Balken, Heatmap, StatCards) | `src/pages/Dashboard.tsx`, `src/components/ui/` | ✅ fertig, wird verfeinert |
| Design-System (Editorial: Pine/Coral/Cream, Fraunces/Outfit/Inter) | `src/index.css` | ✅ fertig |
| PWA + Vercel-Deploy | `vite.config.ts`, `vercel.json` | ✅ fertig |

### 1.4 Entschieden verschoben (Nicht-Ziele dieser Ausbaustufe)

Aus dem ursprünglichen Briefing werden **bewusst nicht jetzt** gebaut — mit definierten Andock-Punkten:

- **KI-Assistent (Chat/RAG):** erst wenn Content-Basis + Backend stehen. Andock-Punkt: Aufgaben-Detail-Seite bekommt später einen „Frag nach"-Button.
- **Supabase/Backend + Accounts:** erst nötig für Sync über Geräte. Andock-Punkt: `useProfile`/`useProgress`/`useTermine` kapseln bereits die gesamte Persistenz — Austausch localforage→Supabase ist ein reiner Adapter-Tausch, keine UI-Änderung.
- **Headless CMS:** erst ab regelmäßiger Redaktion. Andock-Punkt: alle Inhalte liegen als typisierte Datenmodule in `src/data/` — Migration ins CMS ist Export der bestehenden Typen.
- **Push-Notifications:** auf iOS-PWA unzuverlässig. Ersatz jetzt: ICS-Export in den Handy-Kalender (Kapitel 6) — Erinnerungen kommen zuverlässig vom Betriebssystem.
- **B2B-Schullizenzen, Premium-Abo, Begleiter-Charakter „Flo" (Rive):** Phase 3+.

---

## 2. Screen-Landkarte (Soll-Zustand nach dieser Ausbaustufe)

```
Header (persistent): Logo · SearchBar (NEU) · Agenda-Icon (NEU) · Profil
│
├── /                    Home: Hero · Suche/Themen-Chips (NEU) · Nächster Termin (NEU)
│                        · Bereichs-Karten mit Mini-Fortschrittsbalken (NEU)
├── /dashboard           Überblick: Ring · 1 hervorgehobener nächster Schritt (GEÄNDERT)
│                        · Balken pro Bereich · ehrliche Aktivitäts-Heatmap (GEÄNDERT)
├── /journey/:id         Bereichs-Übersicht: Aufgabenliste + Fortschrittsbalken
├── /journey/:id/task/:id  Aufgaben-Detail: Schritte · Frist · Vergleichs-Block (NEU)
│                        · Termin setzen (NEU) · Abhaken mit Feedback (GEÄNDERT)
├── /vergleich/:vergleichId/:optionId   Anbieter-Detailseite (NEU)
├── /agenda              Terminübersicht + ICS-Export (NEU)
├── /onboarding, /profil Fragen (+ 1 neue Prioritäten-Frage)
└── /impressum, /datenschutz  (Ergänzung Affiliate-Hinweise)
```

---

## 3. Feature A — Suche

**Ziel:** Nutzer tippen ihre Alltagswörter („GEZ", „Perso", „Kindergeld") und landen direkt auf der passenden Aufgaben-Checkliste. Die Suche ist der schnellste Weg in die App — auch für Nutzer ohne Onboarding.

### 3.1 Datenmodell

`src/data/types.ts` — `Task` erweitern:

```ts
export interface Task {
  // ... bestehende Felder bleiben unverändert
  keywords?: string[]   // Synonyme, Alltagssprache, Falschschreibungen
}
```

Keywords in allen 4 Journey-Dateien ergänzen. Regeln für gute Keywords:

- **Alltagssprache statt Amtsdeutsch:** „GEZ" für Rundfunkbeitrag, „Perso" für Personalausweis, „Ummelden" für Anmeldung
- **Anlass-Wörter:** „umziehen", „erstes Auto", „erster Job", „18 geworden"
- **Häufige Falschschreibungen:** „steuererklärung", „steuer erklärung", „schufa auskunft"
- Pro Aufgabe 4–8 Keywords, alles klein geschrieben

### 3.2 Such-Logik — neue Datei `src/data/search.ts`

Client-seitig, kein Backend, kein Package (bei ~30–60 Aufgaben unnötig):

```ts
export type SearchHit = { journeyId: string; task: Task; score: number }
export function searchTasks(query: string, profile: Profile | null): SearchHit[]
```

- **Normalisierung:** lowercase, Umlaute vereinheitlichen (ä→ae ODER beide Varianten matchen), Trim
- **Matching & Ranking:** Titel-Präfix-Treffer (Score 3) > Keyword-Treffer (2) > Wort im Titel (2) > Substring in Summary (1). Mehrwort-Query: alle Wörter müssen irgendwo matchen (AND)
- **Personalisierung:** Treffer, die laut `istRelevant()` (aus `src/data/visibility.ts`) NICHT zum Profil passen, werden nicht versteckt, sondern ans Ende sortiert und mit Hinweis „betrifft dich laut Profil eher nicht" gerendert — Suche darf nie leerer wirken als die App ist
- Max. 8 Ergebnisse, sortiert nach Score

### 3.3 UI — neue Komponente `src/components/SearchBar.tsx`

- Sitzt im `Layout.tsx`-Header (Desktop: Feld sichtbar; Mobil: Lupe-Icon → Feld expandiert) **und** prominent auf Home
- Sofort-Ergebnisse als Dropdown während des Tippens (debounce ~150 ms): Aufgaben-Titel, `CategoryBadge` (existiert schon), Journey-Name als Kontextzeile
- Klick → direkt zu `/journey/:journeyId/task/:taskId`
- **Leerer Treffer:** kein totes Ende — Text „Dazu haben wir (noch) nichts" + 4–6 beliebte Themen-Chips (siehe 7.1) + Hinweis „Sag uns, was fehlt" (mailto-Link)
- Tastatur: ↑/↓ + Enter, Esc schließt; `role="combobox"`/`aria-activedescendant` für Screenreader

---

## 4. Feature B — Anbieter-Vergleich & Monetarisierung

**Ziel:** Wenn eine Aufgabe einen Abschluss/Kauf enthält (Versicherung, Konto, Strom), zeigt die App direkt im Aufgaben-Detail einen kompakten Vergleich mehrerer Anbieter. Ein Button pro Anbieter führt zur ausführlichen Detailseite. Hier entsteht die Provision — transparent und neutral.

### 4.1 Datenmodell — neue Datei `src/data/angebote.ts`

```ts
export interface AnbieterOption {
  id: string
  anbieter: string            // z. B. "HUK24"
  produkt: string             // z. B. "Privathaftpflicht Basis"
  preisRahmen: string         // z. B. "ab ca. 3 €/Monat" [GEGENCHECKEN]
  usps: [string, string, string]   // genau 3 prägnante Punkte für die Karte
  geeignetFuer: string[]      // "du willst es günstig", "du willst alles per App"
  nichtGeeignetWenn: string[] // ehrliche Abgrenzung — DAS baut Vertrauen
  fallstricke: string[]       // z. B. "Selbstbeteiligung 150 € im Basistarif"
  leistungen: { label: string; enthalten: boolean; detail?: string }[]  // für Detailseite
  provision: boolean          // true = Affiliate-Partner
  affiliateUrl: string | null // null bis Partnerkonto freigeschaltet → Fallback neutralUrl
  neutralUrl: string          // direkte Anbieter-/Info-URL ohne Tracking
  geprueft: string | null     // Datum "zuletzt geprüft am", wie fakten.ts
}

export interface Vergleich {
  id: string                  // z. B. "haftpflicht"
  taskRef: { journeyId: string; taskId: string }
  titel: string               // "Haftpflicht: 3 Anbieter im Vergleich"
  hinweis?: string            // Kontext, z. B. "Oft bist du noch über deine Eltern versichert — erst prüfen!"
  optionen: AnbieterOption[]
  neutraleAlternative: {      // PFLICHTFELD — erzwingt Neutralität strukturell
    label: string             // "Unabhängig vergleichen bei der Verbraucherzentrale"
    url: string
    beschreibung: string
  }
}
```

**Struktur-Invariante (im Modul erzwingen):** Eine Funktion `validateVergleiche()` läuft beim Modul-Import (dev) bzw. als Test und wirft, wenn ein `Vergleich` keine `neutraleAlternative` hat oder alle `optionen` `provision: true` UND `neutraleAlternative` fehlt. → Es ist strukturell unmöglich, einen rein bezahlten Vergleich zu bauen.

Verknüpfung: `Task` bekommt optionales Feld `vergleichId?: string`.

### 4.2 Kompakt-Ansicht im Aufgaben-Detail — neue Komponente `src/components/VergleichBlock.tsx`

Eingebettet in `TaskDetail.tsx` zwischen Schritten und Abhak-Button, wenn `task.vergleichId` gesetzt:

- Überschrift + optionaler `hinweis` (z. B. „Erst prüfen, ob du das überhaupt brauchst" — verlinkt ggf. den Entscheidungs-Schritt)
- **2–4 Karten**, horizontal scrollbar auf Mobil (Snap-Scrolling), Grid auf Desktop. Pro Karte:
  - Anbieter + Produktname
  - Preisrahmen (groß, aber mit „ab ca." — keine Scheingenauigkeit)
  - 3 USPs als Checkliste
  - Badge **„Werbung"** (Coral-Outline, klein aber deutlich) wenn `provision: true`
  - Button „Details ansehen →" → `/vergleich/:vergleichId/:optionId`
- **Neutrale Alternative gleichrangig** als eigene Karte im selben Raster (nicht als Fußnote!) — visuell unterscheidbar (Pine-Rahmen, Label „Unabhängig"), gleiche Größe
- Darunter ein Satz Transparenz: *„Bei Links mit ‚Werbung' bekommen wir eine Provision, wenn du darüber abschließt. Dein Preis ändert sich dadurch nicht — und unsere Einschätzung auch nicht."*

### 4.3 Anbieter-Detailseite — neue Page `src/pages/VergleichDetail.tsx`, Route `/vergleich/:vergleichId/:optionId`

Aufbau (anschaulich, scanbar, keine Textwüste):

1. **Kopf:** Anbieter, Produkt, Preisrahmen, „Werbung"-Badge, „zuletzt geprüft am"
2. **„Passt zu dir, wenn …"** — `geeignetFuer` als grüne Häkchen-Liste
3. **„Eher nicht, wenn …"** — `nichtGeeignetWenn` als neutrale Liste (kein Rot-Alarm)
4. **Leistungs-Tabelle:** `leistungen` mit ✓/– und optionalem Detail — auf Mobil als gestapelte Zeilen, kein horizontales Scrollen
5. **„Darauf achten":** `fallstricke` als Hinweis-Box
6. **Vergleichs-Kontext:** Mini-Zeile „Andere Optionen: [Anbieter B] [Anbieter C] [Unabhängig vergleichen]" — Nutzer bleibt souverän
7. **CTA:** `<AffiliateLink option={...}>Zum Anbieter →</AffiliateLink>` (siehe 4.4) + Provisions-Aufklärungssatz direkt darunter

### 4.4 18+-Gate — neue Komponente `src/components/AffiliateLink.tsx`

**Die einzige Stelle im Code, die `affiliateUrl` rendern darf.** Logik:

```
volljaehrig === 'ja'  && affiliateUrl  → <a href={affiliateUrl} rel="sponsored noopener"> + "Werbung"-Badge
volljaehrig === 'ja'  && !affiliateUrl → <a href={neutralUrl}> (Fallback bis Partnerkonto da ist)
volljaehrig !== 'ja'                   → <a href={neutralUrl}> + Hinweis
                                         "Abschließen geht erst ab 18 – informieren kannst du dich jetzt schon."
```

- Kein anderes Modul importiert `affiliateUrl` direkt (Lint-Konvention: Zugriff nur via `AffiliateLink`)
- `rel="sponsored"` auf allen Provisionslinks (SEO/Transparenz-Standard)
- Klick-Zählung lokal (anonymer Counter in localforage) als Vorstufe für spätere Analytics — keine externen Tracker in dieser Stufe

### 4.5 Start-Vergleiche (Inhalte, alle Daten `[GEGENCHECKEN]` bis Kira verifiziert)

| Vergleich | Task-Anbindung | Optionen (real, realistisch) | Neutrale Alternative |
|---|---|---|---|
| Haftpflicht | `finanzen:haftpflicht` | HUK24, Allianz, GetSafe | Verbraucherzentrale-Ratgeber |
| KFZ-Versicherung | `mobilitaet:kfz-versicherung` | HUK-Coburg, CosmosDirekt, Allianz | Verivox/Check24-Hinweis + VZ |
| Girokonto | `finanzen:girokonto` | DKB, ING, Sparkasse (regional) | Stiftung Warentest Konto-Vergleich |
| Strom & Internet | `erste-wohnung:strom-internet` | E.ON, Vattenfall, regionaler Grundversorger | Verbraucherzentrale Energieberatung |

Später ausbaubar (gleiche Struktur, Etappe 4+): Hausrat (`erste-wohnung:hausrat`), Depot (`finanzen:depot-etf` — nur mit klarer „keine Anlageberatung"-Abgrenzung).

Affiliate-Programme dafür: FinanceAds (Versicherungen/Konten), Awin (Energie/Telko) — Anmeldung ist Kiras Aufgabe (Kapitel 9).

---

## 5. Feature C — Fortschritt verfeinern (motivieren statt überfordern)

Der Bestand (`Dashboard.tsx` mit `Ring`, `Bar`, `StatCard`, `Heatmap`) bleibt — vier gezielte Änderungen:

### 5.1 Positives Framing überall

- Balken-Beschriftung immer „**3 von 8 geschafft**", nie „62 % offen" oder Restanzeigen
- 0 %-Bereiche: Balken dezent (Pine-Mist, keine Warnfarbe), Text „Noch nicht angefangen — alles gut"
- 100 %: Balken wechselt auf Pine + kleines ✓ „Geschafft!"

### 5.2 Mini-Fortschrittsbalken auf Home

`Home.tsx`-Bereichskarten bekommen einen dünnen (4 px) `Bar` unter dem Untertitel — nur wenn mindestens 1 Aufgabe erledigt ist (vorher wäre er nur Druck). Wiederverwendung der bestehenden `Bar`-Komponente mit neuer `size`-Prop (`thin | default`).

### 5.3 Ein nächster Schritt statt drei

Dashboard: Die bestehende `nextTasks`-Logik liefert weiterhin 3, aber gerendert wird **1 hervorgehobene Karte** („Dein nächster Schritt") + einklappbare Zeile „2 weitere anzeigen". Ein einziger klarer Call-to-Action reduziert Entscheidungslast — das ist der Kern von „nicht überfordern".

### 5.4 Ehrliche Heatmap

Die aktuelle Heatmap verteilt Erledigt-Zähler **fiktiv** über 35 Zellen — das ist erfundene Aktivität und fliegt raus. Ersatz:

- `useProgress.ts` speichert beim Abhaken zusätzlich `doneAt: string` (ISO-Datum). Speicherformat-Migration: bisheriger Wert `boolean` → neu `{ done: boolean; doneAt?: string }`; Lese-Pfad akzeptiert beide Formate (alte `true` = erledigt ohne Datum)
- Heatmap zeigt echte Erledigungen der letzten 5 Wochen; Zellen ohne Aktivität bleiben leer — ehrlich und trotzdem motivierend, weil jede echte Zelle verdient ist
- Solange < 3 Erledigungen existieren: Heatmap ausblenden (leeres Raster demotiviert), stattdessen Platz für den „nächsten Schritt"

---

## 6. Feature D — Terminieren, Agenda & Kalender-Export

**Ziel:** Aufgaben bekommen ein selbstgewähltes Datum („Mach ich am …"), eine aufgeräumte Agenda zeigt was ansteht, und ein Klick legt den Termin in den echten Handy-Kalender — dort erinnert das Betriebssystem zuverlässig (zuverlässiger als jede PWA-Notification, besonders auf iOS).

### 6.1 Datenhaltung — neuer Hook `src/hooks/useTermine.ts`

Muster von `useProgress.ts` übernehmen (localforage-Instanz, Store-Name `termine`):

```ts
type Termin = { journeyId: string; taskId: string; datum: string /* YYYY-MM-DD */ }
useTermine(): {
  termine: Termin[]
  setTermin(journeyId, taskId, datum): void
  removeTermin(journeyId, taskId): void
  loading: boolean
}
```

### 6.2 Termin setzen im Aufgaben-Detail

In `TaskDetail.tsx` unter dem Abhak-Button:

- Button „📅 Termin setzen" öffnet Inline-Bereich mit **Schnellwahl-Chips**: „Heute", „Dieses Wochenende", „Nächste Woche" + nativem `<input type="date">` für freie Wahl (nativer Picker = beste Mobil-UX, null Dependencies)
- Gesetzter Termin wird angezeigt: „Geplant für Sa, 12.07." + „Ändern" / „Entfernen" + „In Kalender übernehmen" (ICS, siehe 6.4)
- Beim Abhaken einer terminierten Aufgabe wird der Termin automatisch entfernt

### 6.3 Agenda — neue Page `src/pages/Agenda.tsx`, Route `/agenda`

- Gruppierung: **Überfällig** (freundlich: „War geplant — kein Stress, verschieb's einfach", mit 1-Klick „+1 Woche") · **Diese Woche** · **Nächste Woche** · **Später**
- Pro Eintrag: Datum, Aufgaben-Titel, `CategoryBadge`, Journey-Kontext, Link zur Aufgabe
- Leerer Zustand: „Noch nichts geplant. Such dir eine Aufgabe aus und setz dir einen Termin — Zukunfts-Du sagt danke."
- Kopfbereich: „Alle Termine in deinen Kalender" (Sammel-ICS)
- Header-Icon (Kalender) in `Layout.tsx` verlinkt hierher; Home und Dashboard zeigen den **nächsten anstehenden Termin** als kleine Karte

### 6.4 ICS-Export — neue Datei `src/lib/ics.ts`

Kein Package nötig, ICS ist Textformat:

```ts
export function terminZuIcs(termin: Termin, task: Task): string  // VCALENDAR/VEVENT
export function downloadIcs(filename: string, icsContent: string): void  // Blob + <a download>
```

- VEVENT: ganztägig (`DTSTART;VALUE=DATE`), SUMMARY = Aufgaben-Titel, DESCRIPTION = Summary + App-Link (`https://<domain>/journey/:j/task/:t`), UID = `startklar-{j}-{t}@startklar.app`, VALARM -1 Tag („Morgen: …")
- Funktioniert auf iOS (öffnet Kalender-Import) und Android (Kalender-App) ohne Backend
- CRLF-Zeilenenden und 75-Zeichen-Folding beachten (ICS-Spec)

---

## 7. UX-Verbesserungen (Ergänzungen mit klarem Mehrwert)

### 7.1 Themen-Chips auf Home
4–6 klickbare Chips unter der Suche („Umzug", „Erstes Auto", „Versicherung", „Geld zurück", „Kindergeld") — füllen die Suche vor bzw. springen direkt zur Aufgabe. Macht die Suche entdeckbar und gibt Orientierung ohne Tippen. Datenquelle: kuratierte Liste in `src/data/search.ts`.

### 7.2 Erledigt-Moment
Beim Abhaken in `TaskDetail.tsx`: kurze CSS-Feier (Check-Icon skaliert ein, 4–6 Konfetti-Partikel als CSS-Animation, ~800 ms, `prefers-reduced-motion` respektieren) + wechselnder Bestätigungssatz („Ein Behörden-Endgegner weniger."). Kein Package.

### 7.3 Teilbarer Fortschritt
Dashboard-Button „Teilen": Web Share API (`navigator.share`) mit Text „Ich bin schon zu X % startklar fürs Erwachsenenleben 💪" + App-Link; Fallback „In Zwischenablage kopiert". Kostenloser Wachstumshebel, 20 Zeilen Code.

### 7.4 Prioritäten-Frage im Onboarding
Neue letzte Frage (Mehrfachauswahl, neues Feld `anlass?: string[]` in `Profile`): „Was steht bei dir gerade an?" (bald 18 / Umzug / erster Job oder Ausbildung / erstes Auto / einfach Überblick). Wirkung: Journeys mit Treffer werden auf Home zuerst gelistet (reine Sortierung, keine neue Sichtbarkeits-Logik — `fragen`-Array in `profile.ts` erweitern, Onboarding rendert Multi-Select für dieses Feld).

---

## 8. Umsetzungs-Roadmap

| Etappe | Inhalt | Neue/geänderte Dateien | Aufwand |
|---|---|---|---|
| **1 — Suche & Fortschritt** | Keywords, `search.ts`, `SearchBar`, Themen-Chips; Framing, Mini-Bars auf Home, 1-Schritt-Fokus, ehrliche Heatmap + `doneAt`-Migration | `types.ts`, `journeys/*`, `search.ts`(neu), `SearchBar.tsx`(neu), `Layout.tsx`, `Home.tsx`, `Dashboard.tsx`, `useProgress.ts`, `Bar.tsx` | ~1 Session |
| **2 — Termine & Agenda** | `useTermine`, Termin-UI im Task-Detail, `/agenda`, ICS-Export, Termin-Karten auf Home/Dashboard | `useTermine.ts`(neu), `Agenda.tsx`(neu), `ics.ts`(neu), `TaskDetail.tsx`, `App.tsx`, `Layout.tsx` | ~1 Session |
| **3 — Vergleiche & Gate** | Datenmodell + Validierung, `VergleichBlock`, Detailseite, `AffiliateLink` mit 18+-Gate, 4 Start-Vergleiche mit realen Anbieterdaten `[GEGENCHECKEN]` | `angebote.ts`(neu), `VergleichBlock.tsx`(neu), `VergleichDetail.tsx`(neu), `AffiliateLink.tsx`(neu), `types.ts`, `TaskDetail.tsx`, `App.tsx` | ~1–2 Sessions |
| **4 — Monetarisierung scharf schalten** | Nach Freischaltung der Partnerkonten: `affiliateUrl`s eintragen, Anbieterdaten verifizieren (`geprueft` setzen), Impressum/Datenschutz ergänzen, Erledigt-Moment, Teilen-Button, Prioritäten-Frage | `angebote.ts`, `Impressum.tsx`, `Datenschutz.tsx`, `Dashboard.tsx`, `profile.ts`, `Onboarding.tsx` | ~1 Session + Kiras Zuarbeit |

Jede Etappe endet deploybar (`npm run build` grün, Vercel-Preview testbar).

---

## 9. Offene Punkte für Kira (Zuarbeit, blockiert nur Etappe 4)

1. **Affiliate-Konten anmelden:** FinanceAds (Versicherung/Konto) und Awin (Energie/Telko). Freischaltung dauert oft 1–2 Wochen — früh starten. Bis dahin laufen alle Links neutral (`neutralUrl`-Fallback ist eingebaut).
2. **Fakten verifizieren:** alle `[GEGENCHECKEN]`-Platzhalter in `src/data/fakten.ts` (Fristen, Beträge) — die App zeigt bis dahin „Wird gerade geprüft".
3. **Anbieterdaten prüfen:** Preise/Leistungen der Start-Vergleiche (Kapitel 4.5) gegen aktuelle Anbieter-Websites checken, dann `geprueft`-Datum setzen.
4. **Impressum & Datenschutz:** Affiliate-Kennzeichnung erwähnen; wenn PostHog o. Ä. später kommt, Datenschutzerklärung erweitern.
5. **Domain-Entscheidung** für App-Links in ICS-Dateien und Share-Texten.

---

*Dieses Dokument ersetzt das frühere Briefing (React Native/Supabase/CMS) als Arbeitsgrundlage. Die dort beschriebenen Später-Phasen (KI-Assistent, Accounts, B2B) bleiben als Vision gültig — Andock-Punkte siehe 1.4.*
