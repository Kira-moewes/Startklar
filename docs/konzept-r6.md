# Startklar – Konzept Runde 6

**Thema:** Fragebogen-First je Versicherungsblock (Steckbrief + passende Anbieter) · Echte Farbwahl
**Status:** Planung abgeschlossen – bereit zur Umsetzung · **Stand:** Juli 2026

## 1. Kritische Prüfung der Ideen

### 1.1 „Fragebogen als Schritt 1, danach beste Versicherung + passender Tarif"

**Gut daran:** Der Bedarfscheck (R4) hängt bisher an der Vergleichsseite – wer über die To-do-Liste kommt, verpasst ihn. Fragebogen als expliziter Schritt 1 jedes Versicherungs-Blocks ist der richtige Ort. Und „alle relevanten Fragen" statt 3–4 macht das Ergebnis substanziell.

**Wo die Idee bricht – und die Rettung:**

| Problem | Konsequenz |
|---|---|
| „Die beste Versicherung anzeigen" = Marktempfehlung → wie in R4: Nähe zur Versicherungsvermittlung (§ 34d GewO), Bruch des Neutralitätsversprechens, Haftung; unsere Richtwerte sind dafür zu grob. | **Entscheidung (Kira): Stufe „Steckbrief + passende Anbieter".** (a) **Tarif-Steckbrief**: konkrete persönliche Tarif-Anforderungen (Deckung, SB, Bausteine). (b) **Passende Anbieter**: alphabetische Liste der Katalog-Anbieter, deren *Richtwerte* alle prüfbaren Zielwerte erfüllen – als Information, nicht Empfehlung: gleichrangig, ohne Reihung, ohne Provision/Links, mit Disclaimer und „Richtwerte ungeprüft"-Kennzeichnung. Ein Tipp übernimmt den Anbieter in den Vergleich. |
| Fragebogen-Müdigkeit bei „allen relevanten Fragen". | Max. 6–7 Fragen je Modul (heute 3–4), Profil-Vorbelegung bleibt, Wizard bleibt. Neue Fragen nur, wenn sie Zielwerte/Bausteine/Hinweise erzeugen. |
| GKV (Krankenkasse) fehlt komplett, gehört aber zu „jedem Block". | Eigenes AP: Kategorie + Katalog + Check. Rechtlich entspannter: Krankenkassenwahl ist Sozialversicherung, keine § 34d-Vermittlung. |

### 1.2 „Farbe wirklich einstellbar (soll auch funktionieren)"

**Diagnose:** Die Technik aus R3 funktioniert – aber der Akzent färbt nur Garnitur (~160 kleine Stellen), während Wortmarke, Primär-Buttons, dunkle Flächen und der **hartkodiert olivgrüne PaperPlane-Held** unverändert bleiben. Der Wechsel ist real, aber unsichtbar. **Rettung = zwei Hebel:** (1) freie Farbwahl per Picker mit automatischer Abstufung, (2) Akzent-Reichweite massiv erhöhen (Hero-Grafik, Primär-Buttons, Fortschritt, Heatmap) + alle Hex-Bypässe tilgen.

### 1.3 Eigene Ideen, die einfließen
1. **Steckbrief druckbar** – der Tarif-Steckbrief nutzt den vorhandenen „Drucken / PDF"-Pfad (R5): mitnehmen zum Beratungsgespräch.
2. **„Passt nicht mehr"-Erkennung:** ändert Kira eine Profil-Antwort, die eine Check-Vorbelegung speist, zeigt die Vergleichsseite „Dein Bedarfscheck könnte veraltet sein – neu prüfen?".
3. **Kontrast-Automatik:** Bei freier Farbwahl entscheidet die Luminanz automatisch über helle/dunkle Schrift auf Akzentflächen (WCAG AA), zu blasse Farben bekommen einen sanften Warnhinweis.
4. **Live-Vorschau** im Profil: Mini-Preview-Karte (Button, Badge, Fortschrittsbalken) direkt unter dem Picker.

## 2. Architektur A: Fragebogen-First & passende Anbieter

### 2.1 Dateien
```
src/data/bedarf/types.ts        – BedarfsErgebnis + bausteine?: string[]
src/data/bedarf/haftpflicht.ts  – 3→6 Fragen (s. 4.1)
src/data/bedarf/hausrat.ts      – 4→7 Fragen (s. 4.2)
src/data/bedarf/kfz.ts          – 4→7 Fragen (s. 4.3)
src/data/bedarf/krankenkasse.ts – NEU (s. 4.4) + Registrierung in index.ts
src/data/vergleich.ts           – NEU Kategorie 'krankenkasse'; vergleichFuerTask + start:krankenkasse-check/-wechsel
src/data/anbieter.ts            – NEU Katalog 'krankenkasse' (~8 Kassen, geprueft: null)
src/lib/bedarfMatch.ts          – NEU passendeAnbieter(kategorieId, ergebnis)
src/pages/BedarfsCheck.tsx      – Ergebnis → „Dein Tarif-Steckbrief" + Anbieter-Sektion
src/pages/TaskDetail.tsx        – injizierter Schritt 1 mit Erledigt-Status
```

### 2.2 Passende Anbieter (Kern)
```ts
export type AnbieterMatch = { eintrag: AnbieterRichtwerte; erfuellt: number; pruefbar: number }
// Prüft jeden Katalog-Eintrag gegen die prüfbaren Zielwerte (z.pruefe auf eintrag.werte).
// Rückgabe NUR Einträge mit erfuellt === pruefbar (alle erfüllt), alphabetisch.
export function passendeAnbieter(kategorieId: string, ergebnis: BedarfsErgebnis): AnbieterMatch[]
```
Anzeige auf der Ergebnisseite: „**Diese Anbieter erfüllen deine Zielwerte** – laut unseren Richtwerten (Stand {MM/JJJJ}, ungeprüft): [+ Chip je Anbieter]". Tipp → `addMitRichtwerten` + Navigation zum Vergleich. Kein Treffer → ehrlicher Text („Keiner unserer Katalog-Anbieter erfüllt laut Richtwerten alle Ziele – vergleiche selbst, die Richtwerte sind grob."). Pflicht-Disclaimer darunter: „Alphabetisch, keine Empfehlung, keine Provision – Richtwerte ersetzen kein echtes Angebot."

### 2.3 Schritt 1 in der Aufgaben-Seite
Für Tasks mit `vergleichFuerTask`-Kategorie, die einen Check hat: vor `task.steps` ein visueller Schritt: Badge `1` (bzw. grünes ✓ wenn `useBedarf(katId).antworten != null`), Text „Fragebogen ausfüllen – zeigt dir, was DU brauchst (≈ 3 Min.)", Button → `/vergleich/{katId}/check`; danach Badges `{i + 2}`. Nach Abschluss zeigt die Zeile Stufe + Link „Ergebnis ansehen".

### 2.4 Steckbrief
`BedarfsErgebnis.bausteine?: string[]` (z. B. „Schlüsselverlust", „Elementarschäden"). Ergebnisseite gliedert neu: Stufe → **Tarif-Steckbrief** (Zielwerte + Bausteine als kompakte Karte, druckbar) → passende Anbieter → Hinweise.

## 3. Architektur B: Echte Farbwahl

### 3.1 Freie Farbe
- `Einstellungen`: `akzent` erhält zusätzlichen Wert `'eigene'`; neues Feld `akzentHex?: string`.
- `useSettings.anwenden()`: bei `eigene` → `--a-base/--a-soft/--a-deep` als Inline-Styles auf `<html>` (sonst entfernen). Ableitung in neuem `src/lib/farben.ts`: hex→HSL; soft = +12 % Helligkeit, deep = −12 %; `--t-on-akzent` per Luminanz (hell → dunkle Schrift `#283618`, sonst Creme). Export: `ableitungen(hex)`, `luminanz(hex)`.
- Pre-Paint-Script in `index.html` + `startklar-anzeige`-Spiegel: auch `akzentHex` speichern/anwenden (3 zusätzliche Zeilen).
- Dark-Mode: bestehendes `color-mix(var(--a-base), …)` greift automatisch auch für eigene Farben – keine Änderung.
- Profil → Darstellung: 4 Preset-Swatches + Swatch „Eigene" mit `<input type="color">`; darunter Live-Vorschau-Karte; Hinweis bei Luminanz > 0,75 („sehr hell – Kontrast leidet").

### 3.2 Sichtbare Wirkung (Hex-Tilgung + Reichweite)
| Stelle | Änderung |
|---|---|
| `src/components/PaperPlane.tsx` | Fills `#606C38/#7C8A4E/#4A5426` → `var(--t-akzent)/var(--t-akzent-soft)/var(--t-akzent-deep)` |
| `src/pages/Home.tsx` Flugpfad | `stroke` → `color-mix(in srgb, var(--t-akzent) 45%, transparent)` |
| `src/pages/Termine.tsx` | `accent-[#F47B5B]` → `accent-olive` (2×) |
| `src/pages/JourneyOverview.tsx` | `text-[#C9D3A0]` → `text-olive-soft` |
| `src/components/ui/Heatmap.tsx` | Stufen-Skala → `color-mix`-Stufen aus `var(--t-akzent)` |
| Primär-Buttons (Home-CTA, TaskDetail „Als erledigt markieren", Vergleich „+ Angebot", BedarfsCheck „Zum Vergleich") | `bg-pine`/`bg-coral` → `bg-olive hover:bg-olive-deep text-on-akzent` |
| Dashboard Fortschrittsring/-balken | an `--t-akzent` binden (falls noch pine) |

Ergebnis: Farbwechsel prägt Held, Buttons, Fortschritt, Chips – sofort sichtbar, hell wie dunkel.

## 4. Fragebogen-Erweiterungen (verbindlich)

### 4.1 Haftpflicht (3→6) – neu:
| key | Frage | Optionen → Wirkung |
|---|---|---|
| `haushalt` | Wohnst du mit Partner:in zusammen? | ja/nein → ja: Baustein „Partner mitversicherbar (Paar-Tarif prüfen)" |
| `ausland` | Länger im Ausland geplant (Auslandssemester, Work & Travel)? | ja/nein/vielleicht → Baustein „Weltweiter Schutz ≥ 1 Jahr" |
| `tiere` | Hund oder Pferd? | hund/pferd/nein → Hinweis „Braucht EIGENE Tierhalterhaftpflicht (für Hunde je nach Bundesland Pflicht) – Privathaftpflicht reicht nicht" |

### 4.2 Hausrat (4→7) – neu:
| key | Frage | Optionen → Wirkung |
|---|---|---|
| `lage` | Wo liegt die Wohnung? | EG-/Souterrain / oben / Haus → EG: Hinweis Einbruchschutz/Gitter, Baustein „einfacher Diebstahl prüfen" |
| `elementar` | Keller/Region mit Hochwasser-/Starkregenrisiko? | ja/nein/weiß nicht → Baustein „Elementarschäden" |
| `wertsachen` | Einzelne Sachen über 2.000 € (Schmuck, Kamera, Rechner)? | ja/nein → Hinweis „Wertsachengrenze der Police prüfen (oft 20–40 % der Summe)" |

### 4.3 Kfz (4→7) – neu:
| key | Frage | Optionen → Wirkung |
|---|---|---|
| `fahrer` | Wer fährt das Auto? | nur ich / ich + Eltern/Partner → Zielwert „Fahrerkreis korrekt angeben" (falsche Angabe = Regress) |
| `km` | Wie viel fährst du im Jahr? | < 6.000 / 6–12.000 / mehr → wenig: Hinweis „km-genauer Tarif lohnt" |
| `stellplatz` | Wo steht das Auto nachts? | Garage / Stellplatz / Straße → Garage: Hinweis „senkt den Beitrag – angeben!" |

### 4.4 Krankenkasse (NEU, 5 Fragen; Kategorie + Katalog + Check)
- **Kategorie `krankenkasse`** (`vergleich.ts`): Kriterien `zusatzbeitrag` (%, `niedriger-besser`), `zahnreinigung` (ja/Zuschuss), `bonusprogramm`, `digital` (App/online), `notizen`. Verknüpft mit `start:krankenkasse-check` und `start:krankenkassen-wechsel`.
- **Katalog** (~8, alphabetisch, `geprueft: null`, Stand-Datum): AOK (Hinweis: regional), Barmer, DAK, hkk, IKK classic, KKH, SBK, TK – Richtwerte: Zusatzbeitrags-Spanne, Zahnreinigungs-Zuschuss ja/nein, Bonusprogramm ja/nein, Digital-Angebot.
- **Check-Fragen:** `status` (familienversichert? – Vorbelegung aus Profil `krankenversicherung`), `wichtig` (Was zählt für dich? Beitrag / Zahnreinigung / Bonus / digitale Services), `sport` (Bonusprogramm-Typ), `wechselgrund` (nur bei -wechsel relevant: Beitrag gestiegen / Service schlecht / Leistung fehlt), `zahn` (professionelle Zahnreinigung nutzen?). Auswertung: familienversichert → „verzichtbar (noch)"; sonst „wichtig" + Zielwerte je Antwort (z. B. `zusatzbeitrag` ≤ 1,8 %, `zahnreinigung` = ja). GKV-Wahl ist keine § 34d-Vermittlung – die „passenden Kassen"-Liste ist hier unkritisch, gleiche Disclaimer-Mechanik trotzdem.

## 5. Arbeitspakete (Reihenfolge: AP1 → AP2 → AP3 ∥ AP4, dann AP5 → AP6, AP7)
| AP | Inhalt | Dateien (Kern) | Akzeptanz (Auszug) | Aufwand |
|---|---|---|---|---|
| AP1 | Fragebögen 6/7/7 + `bausteine` + Steckbrief-UI | bedarf/*, BedarfsCheck.tsx | Alle Alt-Antworten laden weiter (neue Fragen einfach unbeantwortet = im Wizard offen); Steckbrief druckt | 1,5 |
| AP2 | `passendeAnbieter` + Ergebnis-Sektion + Ein-Tipp-Übernahme | bedarfMatch.ts, BedarfsCheck.tsx | Nur Voll-Erfüller, alphabetisch; Kein-Treffer-Text; Disclaimer; Tipp → Vergleich mit ≈-Spalte | 1 |
| AP3 | Schritt 1 in TaskDetail (+ ✓-Status, „Ergebnis ansehen") | TaskDetail.tsx | 3 Versicherungs-Tasks zeigen Schritt 1; erledigt nach Check; andere Tasks unverändert | 0,5 |
| AP4 | Krankenkasse komplett (Kategorie, Katalog, Check, Task-Mapping) | vergleich.ts, anbieter.ts, bedarf/krankenkasse.ts | Beide KK-Tasks zeigen Schritt 1 + „Anbieter vergleichen"; Chips/Autofill funktionieren | 1,5 |
| AP5 | Freie Farbe: farben.ts, useSettings, Pre-Paint, Picker + Vorschau | farben.ts, useSettings.tsx, index.html, Profil.tsx | Eigene Farbe wirkt sofort + nach Reload ohne Flash; on-akzent-Kontrast automatisch; Dark komponiert | 1,5 |
| AP6 | Akzent-Reichweite: Hex-Tilgung + Primär-Buttons/Held/Heatmap | PaperPlane, Home, Termine, JourneyOverview, Heatmap, Buttons | Akzentwechsel färbt Held+CTAs+Fortschritt sichtbar; `grep '#[0-9a-fA-F]' src/` nur noch index.css/Profil-Swatches | 1 |
| AP7 | Klaro-FAQ (+3), README v6, `docs/konzept-r6.md`-Abgleich, Smoke-Tests | faq.ts, README | Build+Lint grün; Playwright-Smoke: neue Flows + Farbwechsel-Assertions (computed style von CTA ändert sich) | 0,5 |

## 6. Risiken & offene Punkte
| Punkt | Einschätzung |
|---|---|
| „Passende Anbieter" trotzdem als Empfehlung lesbar | Alphabetisch, gleichrangig, Voll-Erfüller-only, Disclaimer, keine Provision/Links, Richtwerte „ungeprüft". Bei Abschluss-Links später: anwaltlich prüfen. |
| Richtwerte tragen die Anbieter-Filterung | Nur `pruefe`-bare Zielwerte zählen; kfz ohne Beitrags-Richtwerte → dort filtern nur Schutz/SB. Kein-Treffer-Fall ehrlich formuliert. |
| Alte gespeicherte Check-Antworten | Neue Fragen sind schlicht unbeantwortet → Wizard zeigt sie beim „Antworten ändern"; `auswerten` behandelt fehlende Keys defensiv (heute schon so). |
| Zusatzbeiträge ändern sich jährlich | `stand`-Feld + 12-Monats-Warnung greifen; Pflege-Rhythmus wie Katalog. |
| Sehr helle eigene Farben | Luminanz-Automatik + Warnhinweis; Presets bleiben als sichere Wahl. |
| PaperPlane-Optikregression | Nur Fill-Werte → CSS-Vars, Geometrie unverändert; Sichtprüfung hell/dunkel/4 Presets/2 eigene Farben. |
