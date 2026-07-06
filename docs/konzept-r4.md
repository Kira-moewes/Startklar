# Startklar – Konzept Runde 4

**Thema:** Anbieter-Autofill im Vergleich + Bedarfscheck & Empfehlung je Versicherungsmodul
**Status:** Planung abgeschlossen – bereit zur Umsetzung
**Stand:** Juli 2026

Wie Runde 3 ist dieses Dokument so geschrieben, dass in der Code-Runde nur noch
implementiert werden muss: Jede Entscheidung ist getroffen, jedes Arbeitspaket
benennt Dateien, Datentypen und Akzeptanzkriterien.

---

## 1. Kritische Prüfung der Ideen

### 1.1 Idee: „Nutzer trägt nur den Anbieternamen ein, die App füllt den Rest aus"

**Was daran gut ist:** Das manuelle Abtippen von Tarifdaten ist die größte Hürde
der Vergleichsseite. Wer drei Angebote vergleichen will, muss heute ~15 Werte
aus PDFs und Websites zusammensuchen. Autofill senkt die Einstiegshürde massiv
– genau dort, wo die Zielgruppe abbricht.

**Wo die Idee in dieser Form nicht trägt – und wie wir sie retten:**

| Problem | Konsequenz für das Konzept |
|---|---|
| **Woher sollen die Daten kommen?** Es gibt keine offene Echtzeit-API für deutsche Versicherungstarife. Scraping ist rechtlich heikel und bricht ständig. Eine Cloud-KI würde plausibel klingende, aber falsche Beträge erfinden – das verletzt die Klaro-Regel „Erfinde NIEMALS konkrete Beträge" (Runde 3). | **Entscheidung (Rückfrage mit Kira): kuratierte lokale Datenbank.** Eine redaktionell gepflegte Liste bekannter Anbieter je Kategorie mit typischen Richtwerten, als statische TS-Datei. 100 % lokal, offline-fähig, kein Halluzinationsrisiko, kein Server. |
| **Exakte Preise kann niemand versprechen.** Beiträge hängen von Person, Region und Tarifvariante ab – bei Kfz extrem (Alter, SF-Klasse, Region ändern den Beitrag um Faktor 3+). Ein präziser vorbefüllter Betrag wäre irreführend. | Werte sind **Richtwerte** (Spannen wie „40–70 € / Jahr"), sichtbar markiert mit ≈-Präfix, Stand-Datum und Hinweis „beim Anbieter prüfen". **Bei Kfz wird der Beitrag grundsätzlich NICHT vorbefüllt** – nur Struktur-Fakten (Schutzvarianten, typische SB). Jeder Wert bleibt editierbar; sobald die Nutzer:in ihn anfasst, verschwindet die Richtwert-Markierung. |
| **Eine kuratierte Liste ist nie vollständig.** | Ehrlicher Fallback: Unbekannter Name → normales manuelles Angebot plus Hinweis „Kennen wir noch nicht – trag die Werte aus dem Angebot ein." Die App verspricht Starthilfe, keine Vollständigkeit. |
| **Neutralität:** `vergleich.ts` verspricht „Startklar nennt keine Anbieter". Eine Anbieter-Datenbank *nennt* Anbieter. | Die Grenze wird neu und schärfer gezogen: Startklar nennt Anbieter (sachliche Information), aber **bewertet, rankt und verlinkt sie nicht** und erhält keine Provision. Der Datei-Kopfkommentar und der Fußzeilen-Text der Vergleichsseite werden entsprechend angepasst (siehe 2.6). |

**Fazit:** Idee angenommen als *Autocomplete + Richtwert-Vorbefüllung aus
kuratiertem Katalog* – die App nimmt Tipparbeit ab, ohne Genauigkeit
vorzutäuschen oder das Gerät zu verlassen.

### 1.2 Idee: „Vor jedem Versicherungsmodul ein paar Fragen → Empfehlung für Anbieter/Angebot"

**Was daran gut ist:** Die Kernfrage der Zielgruppe ist nie „welcher Tarif hat
0 € Selbstbeteiligung?", sondern „**brauche ich das überhaupt – und worauf muss
ICH achten?**". Ein kurzer Bedarfscheck beantwortet genau das und macht die
Vergleichskriterien erst bedeutsam.

**Wo die Idee in dieser Form nicht trägt – und wie wir sie retten:**

| Problem | Konsequenz für das Konzept |
|---|---|
| **„Empfehlung für Versicherungsanbieter" bricht das Neutralitätsversprechen** und rückt die App in die Nähe der Versicherungsvermittlung (§ 34d GewO: wer Verbrauchern konkrete Versicherungsprodukte vermittelt/empfiehlt, braucht ggf. eine Erlaubnis). Ohne Registrierung wäre ein marktweites Anbieter-Ranking ein echtes Risiko. | **Entscheidung (Rückfrage mit Kira): Bedarfsermittlung + „Bestes aus DEINEM Vergleich".** Der Check ermittelt (a) ob die Versicherung für diese Person überhaupt nötig ist und (b) individuelle **Zielwerte** (z. B. „Deckungssumme mind. 50 Mio. €"). Ein „Empfehlungs"-Badge vergleicht ausschließlich die **von der Nutzer:in selbst eingetragenen Angebote** gegen diese Zielwerte – kein Marktranking, keine Anbieterbewertung, keine Provision. Das wird auch so beschriftet (siehe 3.6). |
| **Fragebogen-Müdigkeit:** Das Onboarding stellt schon 7 Fragen. Wer bei Hausrat erneut nach der Wohnsituation gefragt wird, fühlt sich nicht verstanden. | Jeder Check hat **max. 4 Fragen**, und Fragen, deren Antwort sich aus dem Profil ableiten lässt, werden **vorbelegt** (Antwort ist vorausgewählt, ein Tap bestätigt). Profil bleibt die eine Quelle für Lebenssituation; Checks fragen nur Versicherungs-Spezifisches. |
| **Empfehlungslogik als Blackbox zerstört Vertrauen.** | Jede Empfehlung nennt ihre Begründung in einem Satz („Weil dein Hausrat unter 5.000 € liegt …"). Regeln sind einfache, lesbare Funktionen – gleiche Philosophie wie `visibility.ts`, nur mit Zielwerten statt Sichtbarkeit als Ergebnis. |

**Fazit:** Idee angenommen als *Bedarfscheck mit Zielwerten + Best-Match-Badge
über die eigenen Angebote* – maximal hilfreich, rechtlich sauber, konsistent
mit dem Neutralitätsversprechen.

### 1.3 Weitere eigene Ideen, die einfließen

1. **„Dein Bedarf" als Referenzspalte:** Die Zielwerte aus dem Check erscheinen
   als erste Datenspalte der Vergleichstabelle – man vergleicht Angebote nicht
   mehr nur miteinander, sondern gegen den eigenen Bedarf.
2. **Erfüllungs-Ampel pro Zelle:** Wo ein Zielwert prüfbar ist, zeigt die
   Zelle ✓ (erfüllt) bzw. ⚠ (unter Zielwert). Unparsebare Freitexte bleiben
   neutral – die Ampel behauptet nie mehr, als sie weiß.
3. **Datenstand sichtbar machen:** Jeder Katalog-Eintrag trägt ein
   `stand`-Datum. Ist es älter als 12 Monate, zeigt die App „Richtwerte älter
   als ein Jahr – besonders kritisch prüfen". Das hält uns ehrlich, auch wenn
   die Pflege mal schleift.
4. **Generische Katalog-Struktur für alle 7 Kategorien:** Der Anbieter-Katalog
   ist nicht versicherungsspezifisch gebaut. Erstbefüllung nur für
   `haftpflicht`, `hausrat`, `kfz` (Kern-Scope), aber Strom/Internet/Girokonto/
   Handy können später ohne Strukturänderung folgen. Gleiches gilt für
   Bedarfschecks (z. B. später „Girokonto-Check").
5. **Klaro kennt den Check:** Fragt jemand Klaro „brauche ich eine
   Hausratversicherung?", verweist die lokale Antwort auf den Bedarfscheck –
   und wenn ein Ergebnis existiert, nennt sie es („Dein Check sagt: …").

---

## 2. Architektur A: Anbieter-Katalog & Autofill

### 2.1 Neue/geänderte Dateien

```
src/data/anbieter.ts            – NEU: Katalog-Typen, Erstbestand, Suchfunktion
src/data/vergleich.ts           – Kriterium um `richtung` erweitert; Kopfkommentar aktualisiert
src/hooks/useVergleich.ts       – Angebot um Richtwert-Marker; addMitRichtwerten()
src/pages/VergleichDetail.tsx   – Autocomplete-Eingabe, Richtwert-Badges, Disclaimer
src/lib/retrieval.ts            – unverändert; `normalisiere()` wird wiederverwendet
```

### 2.2 Datentypen (verbindlich für die Code-Runde)

```ts
// src/data/vergleich.ts – Erweiterung (abwärtskompatibel, optionales Feld)
export type Kriterium = {
  key: string
  label: string
  hinweis?: string
  typ: 'text' | 'euro'
  richtung?: 'niedriger-besser' | 'hoeher-besser'   // NEU: für Ampel & Best-Match
}
// Belegung: beitrag/gebuehr/preis/selbstbeteiligung → 'niedriger-besser';
// deckung/summe → 'hoeher-besser'; Rest ohne richtung (neutral).
```

```ts
// src/data/anbieter.ts – NEU
export type AnbieterRichtwerte = {
  name: string                      // offizieller Kurzname, z. B. 'HUK24'
  aliasse?: string[]                // Schreibvarianten: ['huk 24', 'huk']
  werte: Record<string, string>     // kriteriumKey → Richtwert-Text, z. B. beitrag: '40–70 €'
  stand: string                     // '2026-07' – Monat der Erhebung
  geprueft: string | null           // Datum redaktioneller Prüfung; null = ungeprüft
}

// kategorieId → Anbieterliste. Erstbestand: haftpflicht, hausrat, kfz.
export const anbieterKatalog: Record<string, AnbieterRichtwerte[]>

// Autocomplete: normalisierte Präfix-/Substring-Suche über name + aliasse.
// Nutzt normalisiere() aus src/lib/retrieval.ts. Max. 6 Treffer.
export function findeAnbieter(kategorieId: string, eingabe: string): AnbieterRichtwerte[]
```

```ts
// src/hooks/useVergleich.ts – Erweiterung
export type Angebot = {
  id: string
  anbieter: string
  werte: Record<string, string>
  favorit: boolean
  richtwert?: Record<string, true>  // NEU: Keys, die aus dem Katalog stammen
  richtwertStand?: string           // NEU: stand des Katalog-Eintrags
}
// Neue Funktion: addMitRichtwerten(eintrag: AnbieterRichtwerte) – legt Angebot
// mit vorbefüllten werte an, richtwert = alle übernommenen Keys.
// Geändert: setWert(id, key, wert) löscht zusätzlich richtwert[key]
// (Nutzer-Eingabe schlägt Richtwert – Marker verschwindet).
```

Alte gespeicherte `Angebot`-Objekte ohne die neuen Felder bleiben gültig
(Felder optional) – keine Migration nötig.

### 2.3 Erstbestand des Katalogs (redaktionell zu verifizieren, `geprueft: null`)

Je Kategorie ~10 in Deutschland verbreitete Anbieter, sachlich benannt
(reine Namensnennung, keine Logos, keine Bewertung, keine Links):

- **haftpflicht:** HUK24, HUK-COBURG, Allianz, AXA, CosmosDirekt, ERGO,
  Getsafe, VHV, ARAG, Die Bayerische. Befüllte Keys: `beitrag` (Spanne/Jahr,
  Single-Tarif), `deckung` (z. B. '50 Mio. €'), `selbstbeteiligung`
  (Standardtarif), `ausfalldeckung` ('ja'/'gegen Aufpreis').
- **hausrat:** HUK24, HUK-COBURG, Allianz, AXA, CosmosDirekt, ERGO, Getsafe,
  VHV, Gothaer, Die Bayerische. Befüllte Keys: `beitrag` (Spanne für ~40 m²),
  `summe` (typ. Pauschale pro m²), `selbstbeteiligung`, `fahrrad`
  ('gegen Aufpreis'/'bis X € inklusive').
- **kfz:** HUK24, HUK-COBURG, Allianz, AXA, CosmosDirekt, DEVK, LVM, VHV,
  R+V, Verti. Befüllte Keys: `schutz` (angebotene Varianten),
  `selbstbeteiligung` (übliche TK/VK-Kombis), `sf-klasse`
  (Hinweis auf Übernahme-/Zweitwagenregelung). **`beitrag` bleibt leer**
  (hochindividuell – Vorbefüllung wäre irreführend); das Eingabefeld zeigt
  stattdessen den Placeholder „individuell – Angebot einholen".
- `notizen` wird nie vorbefüllt.

### 2.4 UI-Verhalten in `VergleichDetail.tsx`

- Das bestehende „+ Angebot"-Eingabefeld wird zur **Combobox**: Ab 2 Zeichen
  erscheint eine Vorschlagsliste (`findeAnbieter`), Tastatur-navigierbar
  (`role="combobox"`/`aria-expanded`/`aria-activedescendant`, Pfeiltasten,
  Enter, Esc).
- **Vorschlag gewählt** → `addMitRichtwerten(eintrag)`: Spalte erscheint
  vorbefüllt. Einmaliger Toast/Zeile unter der Tabelle: „Richtwerte für
  {name} eingetragen (Stand {MM/JJJJ}) – bitte mit dem echten Angebot
  abgleichen."
- **Freitext ohne Treffer** → bisheriges `add(name)` + Inline-Hinweis:
  „Kennen wir noch nicht – trag die Werte aus deinem Angebot ein."
- **Richtwert-Zellen** zeigen den Wert mit `≈`-Präfix und gestricheltem
  Rahmen (`border-dashed`); `title`/`aria-description`: „Richtwert, Stand
  {MM/JJJJ} – vom Anbieter bestätigen lassen". Beim Editieren (→ `setWert`)
  fällt die Markierung weg, Zelle sieht aus wie manuelle Eingabe.
- Ist `richtwertStand` älter als 12 Monate (Vergleich gegen `new Date()`),
  erscheint über der Tabelle: „⚠ Die Richtwerte sind älter als ein Jahr –
  besonders kritisch prüfen."
- Fußzeile der Seite (bisher „Neutraler Vergleich: keine Werbung, keine
  Provision…") wird ergänzt: „Vorausgefüllte Werte sind unverbindliche
  Richtwerte, keine Angebote. Startklar bewertet keine Anbieter und erhält
  keine Provision."

### 2.5 Kopfkommentar `src/data/vergleich.ts` (neu formuliert)

„Neutraler Anbieter-Vergleich: Startklar nennt bekannte Anbieter mit
unverbindlichen Richtwerten als Starthilfe, bewertet und verlinkt sie aber
nicht und erhält keine Provision. Verglichen wird nur, was du selbst
einträgst oder übernimmst."

---

## 3. Architektur B: Bedarfscheck & Empfehlung

### 3.1 Neue/geänderte Dateien

```
src/components/FragenWizard.tsx    – NEU: generischer Ein-Frage-pro-Schritt-Wizard
src/pages/Onboarding.tsx           – refaktoriert auf FragenWizard (Verhalten identisch)
src/data/bedarf/types.ts           – NEU: BedarfsFrage, Zielwert, BedarfsErgebnis, BedarfsCheck
src/data/bedarf/haftpflicht.ts     – NEU: Fragen + Auswertung (siehe 4.1)
src/data/bedarf/hausrat.ts         – NEU: Fragen + Auswertung (siehe 4.2)
src/data/bedarf/kfz.ts             – NEU: Fragen + Auswertung (siehe 4.3)
src/data/bedarf/index.ts           – NEU: bedarfsChecks: Record<kategorieId, BedarfsCheck>
src/lib/bedarfMatch.ts             – NEU: Parsen + Zielwert-Prüfung + Best-Match
src/hooks/useBedarf.ts             – NEU: Antworten laden/speichern, Ergebnis ableiten
src/lib/stores.ts                  – bedarfStore + Eintrag in alleStores (Export/Import!)
src/pages/BedarfsCheck.tsx         – NEU: Seite, Route /vergleich/:kategorieId/check
src/App.tsx                        – Route ergänzen
src/pages/VergleichDetail.tsx      – Bedarfs-Panel, Referenzspalte, Ampel, Best-Match
src/pages/Vergleich.tsx            – Status-Chip „Bedarf geklärt ✓" je Versicherungskategorie
```

### 3.2 Wizard-Extraktion (`FragenWizard.tsx`)

Das komplette UI aus `Onboarding.tsx` (Papierflieger-Fortschritt, Frage,
Options-Buttons, Zurück/Später) zieht in eine generische Komponente:

```ts
export type WizardFrage = {
  key: string
  titel: string
  hinweis?: string
  optionen: { wert: string; label: string }[]
}
type Props = {
  fragen: WizardFrage[]
  initial?: Record<string, string>        // Vorbelegung (vorausgewählte Antwort)
  abschlussLabel?: string                 // Text „Später machen" überschreibbar
  onFertig: (antworten: Record<string, string>) => void
  onAbbruch: () => void
}
```

`Onboarding.tsx` mappt `fragen`/`Profile` auf dieses Interface (Feldnamen
`feld`→`key`); Optik und Verhalten bleiben pixelgleich – reiner Umzug.
Vorbelegte Fragen werden **nicht übersprungen**, sondern mit vorausgewählter
Option angezeigt (ein Tap bestätigt) – so bleibt die Nutzer:in Herr über
jede Antwort.

### 3.3 Datentypen (verbindlich für die Code-Runde)

```ts
// src/data/bedarf/types.ts
import type { Profile } from '../profile'

export type BedarfsFrage = WizardFrage & {
  vorbelegung?: (profil: Profile) => string | undefined  // Antwort aus Profil ableiten
}

export type ZielStatus = 'erfuellt' | 'nicht-erfuellt' | 'unklar'

export type Zielwert = {
  kriteriumKey?: string             // gesetzt → erscheint in der Tabellen-Referenzspalte
  label: string                     // z. B. 'Deckungssumme'
  ziel: string                      // menschenlesbar: 'mind. 50 Mio. €'
  pruefe?: (wert: string) => ZielStatus  // fehlt → nur Anzeige, keine Ampel
}

export type BedarfsErgebnis = {
  stufe: 'wichtig' | 'pruefen' | 'verzichtbar'
  titel: string                     // z. B. 'Wichtig für dich'
  begruendung: string               // ein Satz, nennt die ausschlaggebende Antwort
  zielwerte: Zielwert[]
  hinweise: string[]                // weitere Tipps ohne Kriterium-Bezug
}

export type BedarfsCheck = {
  kategorieId: string               // 'haftpflicht' | 'hausrat' | 'kfz'
  titel: string
  intro: string
  fragen: BedarfsFrage[]
  auswerten: (antworten: Record<string, string>, profil: Profile | null) => BedarfsErgebnis
}
```

**Persistenz:** Gespeichert werden **nur die Antworten** (`{ antworten, stand: ISO }`,
Key = `kategorieId` im neuen `bedarfStore`). Das Ergebnis wird bei jedem
Rendern per `auswerten()` neu abgeleitet – Regelverbesserungen wirken so
rückwirkend, und der Store bleibt trivial. `bedarfStore` wird in
`alleStores` registriert → Export/Import/Löschen aus Runde 3 erfassen ihn
automatisch.

```ts
// src/hooks/useBedarf.ts
export function useBedarf(kategorieId: string): {
  antworten: Record<string, string> | null   // null = Check noch nicht gemacht
  ergebnis: BedarfsErgebnis | null           // abgeleitet, wenn antworten vorhanden
  speichern: (antworten: Record<string, string>) => Promise<void>
  zuruecksetzen: () => Promise<void>
  loading: boolean
}
```

### 3.4 Zielwert-Prüfung & Best-Match (`src/lib/bedarfMatch.ts`)

```ts
export function parseEuro(text: string): number | null      // '1.200 €', '40–70 €' (nimmt Obergrenze), '35' → Zahl; sonst null
export function parseMillionen(text: string): number | null // '50 Mio. €', '10 Millionen' → 50 / 10
export function enthaeltJa(text: string): boolean | null    // 'ja', 'inkl.', 'enthalten' → true; 'nein' → false; sonst null

export type BestMatch = { angebotId: string; erfuellt: number; pruefbar: number }

// Regeln: nur ab 2 Angeboten und ≥1 prüfbarem Zielwert. Score = Anzahl
// 'erfuellt'. Gleichstand → niedrigerer parseEuro(beitrag|preis|gebuehr).
// Immer noch Gleichstand oder Beitrag unparsebar → null (kein Badge –
// lieber keine Empfehlung als eine willkürliche).
export function besteWahl(angebote: Angebot[], ergebnis: BedarfsErgebnis): BestMatch | null
```

Alle `pruefe`-Funktionen sind konservativ: Was nicht sicher parsebar ist,
ergibt `'unklar'` und zählt weder positiv noch negativ.

### 3.5 Seite `BedarfsCheck.tsx` (Route `/vergleich/:kategorieId/check`)

- Lädt den Check aus `bedarfsChecks[kategorieId]`; fehlt er (z. B. `/vergleich/strom/check`) → Redirect auf `/vergleich/:kategorieId`.
- `initial` für den Wizard: gespeicherte Antworten (erneuter Durchlauf) sonst `vorbelegung(profil)` je Frage.
- Nach `onFertig`: speichern, dann **Ergebnis-Ansicht** auf derselben Seite:
  Stufen-Karte (Farbe: wichtig = Coral-Akzent, pruefen = neutral,
  verzichtbar = Pine-Mist) mit `titel` + `begruendung`, Liste der Zielwerte,
  Hinweise, zwei Buttons: „Zum Vergleich →" (`/vergleich/:kategorieId`) und
  „Antworten ändern" (Wizard erneut, vorbefüllt).
- `onAbbruch` → zurück zur Vergleichsseite, nichts gespeichert.

### 3.6 Integration in `VergleichDetail.tsx`

- **Ohne Check-Ergebnis** (nur bei Kategorien mit Check): Karte über dem
  Angebots-Formular: „**Bevor du vergleichst:** 3–4 kurze Fragen zeigen dir,
  ob und wie viel {Titel} du brauchst." + Button „Bedarf checken" → `/check`.
- **Mit Ergebnis:** Kompaktes „Dein Bedarf"-Panel (Stufe, Begründung,
  Link „Antworten ändern"). In der Tabelle erscheint **vor** den Angeboten
  eine Referenzspalte „Dein Bedarf" (nicht editierbar, Pine-Mist-Hintergrund)
  mit `ziel` je Zielwert-Zeile.
- **Ampel:** Zellen, deren Kriterium einen prüfbaren Zielwert hat, zeigen
  rechts im Feld ✓ (erfuellt) bzw. ⚠ (nicht-erfuellt); `unklar` → nichts.
- **Best-Match-Badge:** Liefert `besteWahl()` ein Ergebnis, bekommt die
  Spalte den Kopf-Badge „Passt am besten zu deinem Bedarf (x von y Zielen)".
  Direkt darunter in Kleinschrift: „Bezieht sich nur auf deine eingetragenen
  Angebote – keine Markt- oder Anbieterempfehlung." Der Badge ist vom
  Favorit-Stern unabhängig (Empfehlung ≠ Entscheidung der Nutzer:in).
- `Vergleich.tsx` (Übersicht): Kategorien mit gemachtem Check zeigen einen
  Chip „Bedarf geklärt ✓", ohne Check (aber mit verfügbarem Check) „Bedarf
  checken" – nutzt `useBedarf`-Stores analog `useVergleichsUebersicht`.

---

## 4. Inhalte der drei Bedarfschecks (redaktionell, verbindlich)

Faustregeln (50 Mio. €, 650 €/m² …) folgen gängiger Verbraucherberatung
(z. B. Verbraucherzentrale), sind aber wie alle Fakten der App redaktionell
zu bestätigen – bis dahin gelten sie als ungeprüft im Sinne des
`fakten.ts`-Musters (Kommentar im Code, kein UI-Blocker).

### 4.1 Haftpflicht (`src/data/bedarf/haftpflicht.ts`) – 3 Fragen

| # | key | Frage | Optionen | Vorbelegung |
|---|---|---|---|---|
| 1 | `mitversichert` | Bist du noch über deine Eltern haftpflichtversichert? *(Hinweis: In der Erstausbildung bist du oft automatisch mitversichert – einmal nachfragen.)* | ja / nein / weiß nicht | – |
| 2 | `puffer` | Wie viel könntest du bei einem kleinen Schaden selbst zahlen? | fast nichts / bis 150 € / auch mehr | – |
| 3 | `risiko` | Trifft etwas davon auf dich zu? | leihe oft teure Sachen (Technik, Rad) / passe auf fremde Schlüssel auf (WG, Job) / beides / nichts davon | – |

**Auswertung:**
- `mitversichert=ja` **und** Profil-`status` ∈ {schueler, azubi, student, fsj} → **verzichtbar**: „Du bist vermutlich noch bei deinen Eltern mitversichert." Hinweis: „Das endet meist mit der ersten Berufstätigkeit oder dem Ende der Erstausbildung – mach den Check dann neu."
- `mitversichert=weiß nicht` → **pruefen**: „Frag zuerst deine Eltern – die Antwort spart dir womöglich den ganzen Beitrag."
- sonst → **wichtig**: „Die wichtigste freiwillige Versicherung überhaupt – ein Personenschaden kann sonst dein Leben lang kosten."
- **Zielwerte** (bei pruefen/wichtig): `deckung` ≥ 50 Mio. € (`parseMillionen ≥ 50`); `ausfalldeckung` = ja (`enthaeltJa`); `selbstbeteiligung` je `puffer`: fast nichts → „0 €", sonst → „bis 150 € ist ok und senkt den Beitrag" (`parseEuro ≤ 0` bzw. `≤ 150`).
- **Hinweise** aus `risiko`: leihen → „Achte darauf, dass geliehene/gemietete Sachen mitversichert sind."; Schlüssel → „Schlüsselverlust sollte eingeschlossen sein – gerade in der WG."

### 4.2 Hausrat (`src/data/bedarf/hausrat.ts`) – 4 Fragen

| # | key | Frage | Optionen | Vorbelegung |
|---|---|---|---|---|
| 1 | `wohnort` | Wohnst du (bald) in einer eigenen Wohnung oder WG? | eigene Wohnung / WG / noch bei den Eltern | aus `wohnsituation`: eltern→eltern, wg→WG, ausgezogen & auszug_geplant→eigene |
| 2 | `wert` | Was wären deine Sachen ungefähr wert, wenn du alles neu kaufen müsstest? *(Möbel, Technik, Kleidung, Rad – Neupreis)* | unter 5.000 € / 5.000–15.000 € / über 15.000 € / keine Ahnung | – |
| 3 | `flaeche` | Wie groß ist die Wohnung? | unter 30 m² / 30–60 m² / über 60 m² | – |
| 4 | `fahrrad` | Hast du ein Fahrrad oder E-Bike, das draußen oder im Keller steht? | ja, über 500 € wert / ja, günstiger / nein | – |

**Auswertung:**
- `wohnort=eltern` → **verzichtbar**: „Deine Sachen sind über die Hausratversicherung deiner Eltern mitversichert." Hinweis: „Beim Auszug wird das Thema neu – mach den Check dann noch mal."
- `wert=unter 5.000` → **verzichtbar**: „Bei wenig Besitz ersetzt du im Ernstfall günstiger selbst – steck das Geld lieber in die Haftpflicht."
- `wert=keine Ahnung` → **pruefen** + Hinweis „Geh im Kopf durch die Wohnung: Was hat mehr als 100 € gekostet? Das summiert sich schneller als gedacht."
- sonst → **wichtig**: „Dein Hausrat ist mehr wert, als du locker ersetzen könntest."
- **Zielwerte:** `summe` nach Faustregel 650 €/m²: unter 30 → „mind. 20.000 €", 30–60 → „mind. 40.000 €", über 60 → „Wohnfläche × 650 €" (`parseEuro`-Prüfung nur bei den festen Schwellen, sonst ohne `pruefe`); `fahrrad` bei „ja, über 500 €" → „Fahrraddiebstahl eingeschlossen" (`enthaeltJa`); `selbstbeteiligung` → „möglichst 0–150 €" (`parseEuro ≤ 150`).
- **Hinweise:** WG → „In der WG braucht meist jede:r eine eigene Police fürs eigene Zimmer – klärt, wem was gehört."; immer → „Unterversicherungsverzicht vereinbaren (Stichwort qm-Pauschale)."

### 4.3 Kfz (`src/data/bedarf/kfz.ts`) – 4 Fragen

| # | key | Frage | Optionen | Vorbelegung |
|---|---|---|---|---|
| 1 | `situation` | Wo stehst du gerade? | Auto ist schon da / Kauf ist geplant | aus `mobilitaet`: auto→da, auto_geplant→geplant |
| 2 | `alter` | Wie alt ist das Auto (oder dein Wunschauto)? | unter 3 Jahre / 3–8 Jahre / über 8 Jahre | – |
| 3 | `sf` | Können deine Eltern helfen – SF-Klasse übertragen oder dich als Zweitwagen mitversichern? | ja / nein / weiß nicht | – |
| 4 | `puffer` | Hättest du Rücklagen für eine Selbstbeteiligung im Schadensfall? | nein / ca. 150 € / 300 € oder mehr | – |

**Auswertung:**
- Stufe immer **wichtig**, `titel` „Pflicht – ohne läuft nichts": „Ohne Kfz-Haftpflicht bekommst du kein Kennzeichen."
- **Zielwerte:** `schutz` je `alter`: unter 3 → „Vollkasko sinnvoll", 3–8 → „Teilkasko meist ausreichend", über 8 → „Haftpflicht reicht oft; Teilkasko nur, wenn günstig" (Prüfung per Substring vollkasko/teilkasko, sonst `unklar`); `selbstbeteiligung` je `puffer`: nein → „0 € (kostet Beitrag)", 150 → „TK 150 € üblich", 300+ → „TK 150 € / VK 300 € drückt den Beitrag deutlich" (ohne `pruefe` – Freitext zu variabel); `sf-klasse` bei `sf=ja` → „Übernahme/Zweitwagen-Einstufung aktiv ansprechen" (ohne `pruefe`).
- **Hinweise:** `sf=weiß nicht` → „Ein Anruf bei deinen Eltern kann hunderte Euro im Jahr sparen."; immer → „Beiträge sind extrem individuell (Alter, Region, SF-Klasse) – hol dir echte Angebote, Richtwerte gibt es hier bewusst nicht."; `situation=geplant` → „Versicherung VOR dem Kauf klären – die eVB-Nummer brauchst du schon fürs Anmelden."

---

## 5. Arbeitspakete

Reihenfolge: **AP1 → (AP2 ∥ AP3) → AP4 → AP5.** Parallel (kein Code): redaktionelle Prüfung der Katalog-Richtwerte und Faustregeln. Schätzungen in Fokus-Sessions (½ Tag ≈ 1 Session).

### AP1 – Fundament: Wizard-Extraktion & Datenmodell (≈ 1 Session)
**Dateien:** neu `src/components/FragenWizard.tsx`, `src/pages/Onboarding.tsx` (Refactor), `src/data/vergleich.ts` (`richtung`), `src/hooks/useVergleich.ts` (Angebot-Felder, `addMitRichtwerten`, `setWert`-Änderung), `src/lib/stores.ts` (`bedarfStore` + `alleStores`)
**Akzeptanz:**
- [ ] Onboarding verhält sich pixel-/verhaltensgleich (7 Fragen, Fortschritt, Zurück, „Später machen")
- [ ] Bestehende gespeicherte Angebote laden fehlerfrei (optionale Felder)
- [ ] `setWert` auf eine Richtwert-Zelle entfernt deren Marker, andere Marker bleiben
- [ ] Datenexport (Runde 3) enthält den leeren `bedarf`-Store; Import-Roundtrip grün
- [ ] `npm run lint` + `npm run build` grün

### AP2 – Anbieter-Katalog & Autofill (≈ 1,5 Sessions)
**Dateien:** neu `src/data/anbieter.ts`, `src/pages/VergleichDetail.tsx` (Combobox, Badges, Toast, Fußzeile), `src/data/vergleich.ts` (Kopfkommentar)
**Akzeptanz:**
- [ ] Katalog: je 10 Anbieter für haftpflicht/hausrat/kfz, alle mit `stand`, `geprueft: null`; kfz ohne `beitrag`-Werte
- [ ] „huk" (2. Zeichen) zeigt HUK24 + HUK-COBURG; Auswahl per Maus und Tastatur (Pfeile/Enter/Esc) erstellt vorbefüllte Spalte
- [ ] Richtwert-Zellen zeigen ≈ + gestrichelten Rahmen + Screenreader-Beschreibung; nach Editieren normale Darstellung
- [ ] Unbekannter Name → manuelles Angebot + „Kennen wir noch nicht"-Hinweis
- [ ] Nicht-Versicherungs-Kategorien (z. B. strom) funktionieren unverändert (leerer Katalog → reine Freitext-Eingabe)
- [ ] `stand` > 12 Monate (im Test mocken) → Warnhinweis über der Tabelle

### AP3 – Bedarfscheck-Kern & Inhalte (≈ 2 Sessions)
**Dateien:** neu `src/data/bedarf/{types,haftpflicht,hausrat,kfz,index}.ts`, `src/lib/bedarfMatch.ts`, `src/hooks/useBedarf.ts`, `src/pages/BedarfsCheck.tsx`, `src/App.tsx` (Route)
**Akzeptanz:**
- [ ] Alle 3 Checks vollständig durchspielbar; Vorbelegung greift (Profil `wohnsituation='eltern'` → Hausrat-Frage 1 vorausgewählt)
- [ ] Jede Stufen-Kombination aus Abschnitt 4 manuell verifiziert (z. B. Haftpflicht ja+azubi → verzichtbar; Hausrat unter 5.000 → verzichtbar; Kfz immer wichtig)
- [ ] Antworten überstehen Reload; „Antworten ändern" startet vorbefüllt; `zuruecksetzen` entfernt den Eintrag
- [ ] `/vergleich/strom/check` leitet auf `/vergleich/strom` um
- [ ] `parseEuro('1.200 €')=1200`, `parseEuro('40–70 €')=70`, `parseMillionen('50 Mio. €')=50`, `enthaeltJa('inkl.')=true` (falls vitest eingeführt: als Unit-Tests, sonst manuell in der Konsole)

### AP4 – Integration in den Vergleich (≈ 1 Session)
**Dateien:** `src/pages/VergleichDetail.tsx` (Panel, Referenzspalte, Ampel, Best-Match), `src/pages/Vergleich.tsx` (Chips)
**Akzeptanz:**
- [ ] Ohne Check: Einladungskarte nur bei haftpflicht/hausrat/kfz; mit Ergebnis: „Dein Bedarf"-Panel + Referenzspalte
- [ ] Ampel: '60 Mio.' bei Ziel ≥ 50 Mio. → ✓; '10 Mio.' → ⚠; 'gute Frage' → nichts
- [ ] Best-Match-Badge erscheint erst ab 2 Angeboten, nennt „x von y Zielen", trägt den Nur-deine-Angebote-Disclaimer; bei Gleichstand ohne parsebaren Beitrag kein Badge
- [ ] Badge unabhängig vom Favorit-Stern; Favorit-Logik unverändert
- [ ] Übersicht zeigt „Bedarf geklärt ✓" nach Check, „Bedarf checken" davor

### AP5 – Klaro-Anbindung, Doku & Feinschliff (≈ 1 Session)
**Dateien:** `src/data/agent/faq.ts` (+3 Einträge), `src/data/agent/wissensbasis.ts` (Check-Routen), README (Abschnitt v4), PWA-Offline-Pass
**Inhalt:** FAQ: „Brauche ich Versicherung X?" → Route zum Check · „Woher kommen die vorausgefüllten Werte?" · „Was bedeutet ‚Passt am besten zu deinem Bedarf'?". Wissensbasis nimmt die drei Check-Seiten als Einträge auf (Titel + Intro + Fragen-Stichworte).
**Akzeptanz:**
- [ ] Klaro (lokal) beantwortet „brauche ich eine hausratversicherung" mit Link auf den Check
- [ ] Kompletter Flow offline: Check ausfüllen, Autofill, Best-Match – ohne Netz
- [ ] README beschreibt Neutralitäts-Grenze (nennen ja, bewerten nein) und Richtwert-Prinzip
- [ ] `npm run lint` + `npm run build` grün

---

## 6. Risiken & offene Punkte

| Punkt | Einschätzung / Entscheidung nötig |
|---|---|
| **Pflege des Anbieter-Katalogs** | Richtwerte veralten. Gegenmittel: `stand`-Feld + 12-Monats-Warnung im UI (automatisch), Pflege-Rhythmus 2×/Jahr als wiederkehrende Redaktionsaufgabe. Bewusst klein starten (10 Anbieter/Kategorie). |
| **Nennung realer Markennamen** | Sachliche Namensnennung ohne Logos, Bewertung oder Verlinkung ist markenrechtlich unkritisch; keine Vergleichswerbung, da Startklar selbst kein Anbieter ist. Kein Anbieter wird hervorgehoben – Reihenfolge im Katalog alphabetisch. |
| **Abgrenzung zur Versicherungsvermittlung (§ 34d GewO)** | Kein Marktranking, keine Produktempfehlung, kein Abschluss-Link, keine Provision; Best-Match bewertet nur Nutzereingaben gegen selbst ermittelte Zielwerte und sagt das dazu. Bei späterer Ausweitung (z. B. Abschluss-Links) neu bewerten – dann anwaltlich prüfen. |
| **Faustregeln sind ungeprüft** | 50 Mio. €, 650 €/m², SB-Üblichkeiten folgen Verbraucherberatungs-Konventionen, gelten aber bis zur redaktionellen Prüfung als ungeprüft (Code-Kommentar am jeweiligen Zielwert). Gleiches unabhängiges To-do wie bei `fakten.ts`. |
| **Kfz-Beiträge** | Bewusste Entscheidung: nie vorbefüllen (Faktor-3-Streuung). Der Check kompensiert mit dem eVB-/SF-Klassen-Hinweis. |
| **Kein Test-Framework** | Die Parser in `bedarfMatch.ts` sind reine Funktionen – idealer Erstkandidat für vitest (in Runde 3 bereits erwogen). Empfehlung: mit AP3 einführen, Aufwand ~15 min Setup. |
| **Erweiterung auf weitere Module** | Struktur ist generisch (Katalog + Checks als Records über `kategorieId`). Kandidaten für Runde 5+: Girokonto-Check, Handytarif-Check, neue Kategorie Rechtsschutz/BU. Nicht Teil dieser Runde. |

---

## 7. Was nach Umsetzung dieses Konzepts gilt

- Auf der Vergleichsseite reicht der Anbietername: Bekannte Anbieter werden
  beim Tippen vorgeschlagen und die Tabelle mit klar gekennzeichneten,
  editierbaren Richtwerten vorbefüllt – offline, ohne dass Daten das Gerät
  verlassen.
- Vor jedem Versicherungsvergleich beantworten Nutzer:innen 3–4 Fragen und
  erfahren, ob sie die Versicherung überhaupt brauchen und welche Zielwerte
  für sie gelten – bekannte Profil-Antworten sind vorausgewählt.
- Die Vergleichstabelle zeigt „Dein Bedarf" als Referenz, prüft Angebote per
  Ampel dagegen und markiert das Angebot, das am besten passt – ausdrücklich
  nur unter den eigenen Eingaben, ohne Marktempfehlung und ohne Provision.
- Das Neutralitätsversprechen ist präzisiert statt aufgeweicht: Startklar
  nennt Anbieter, bewertet sie aber nicht.
