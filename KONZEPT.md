# Startklar – Konzept Runde 2 (vollständige Spezifikation)

> Stand: Juli 2026. Dieses Dokument ist die code-fertige Ausarbeitung von Runde 2.
> Jeder Abschnitt enthält Ziel, Seitenaufbau, Datenmodell, Speicherung, Routen,
> Beispieltexte und Akzeptanzkriterien.
>
> **Status: vollständig umgesetzt** (in diesem Branch) – alle Abschnitte 1–8
> sind implementiert, siehe Abschnitt 9. Offen bleibt nur die redaktionelle
> Arbeit (Abschnitt 10, Punkt „Redaktion").

---

## 1. Produktvision & Geschäftsmodell

**Startklar** begleitet junge Menschen (16–27) bei den ersten Behörden-, Geld-
und Wohnungs-To-dos – verständlich, Schritt für Schritt, ohne erhobenen
Zeigefinger. Runde 2 erweitert die App von einem reinen Begleiter zu einer
Plattform, über die man die nötigen Verträge auch **direkt abschließen** kann.

**Geschäftsmodell (Entscheidung Runde 2): transparente Provision.**

- Für Nutzer:innen bleibt alles kostenlos.
- Schließt jemand über Startklar einen Vertrag ab (Strom, Versicherung, Konto,
  Handy …), zahlt der **Anbieter** eine Vermittlungsprovision an Startklar –
  dasselbe Modell, mit dem sich Check24 und Verivox finanzieren.
- Der Hinweis steht sichtbar an jedem Abschluss-Button:
  > „Kostenlos für dich – Startklar erhält bei Abschluss eine Provision vom Anbieter."
- Redaktionelle Inhalte (Kriterien, Tipps, Reihenfolge der Angebote) bleiben
  unabhängig von der Provisionshöhe. Sortierung ist immer nachvollziehbar
  (Preis, Testurteil, Beliebtheit) und nie „gesponsert".

**Zu ändernde Bestandstexte** (bei Umsetzung von Abschnitt 4):

| Ort | Alt | Neu |
|---|---|---|
| `src/data/vergleich.ts` (Kopfkommentar) | „bekommt keine Provision" | Provisions­modell dokumentieren |
| `src/pages/Vergleich.tsx` („So funktioniert's") | „Keine Werbung, keine Provision" | „Kostenlos für dich – Startklar erhält bei Abschluss eine Provision vom Anbieter. Kriterien und Tipps bleiben redaktionell unabhängig." |
| `src/pages/VergleichDetail.tsx` | Neutralitätshinweis | Provisionshinweis unter den Abschluss-Buttons |
| `README.md` | „Keine Werbung, keine Provision" | angepasst |

---

## 2. Informationsarchitektur & Navigation

Neue Hauptnavigation (Desktop-Reihenfolge; mobil identisch, umbricht):

```
Start · Dashboard · Vergleich · Dokumente · Termine · Wallet · 🔍 Suche
```

Routenübersicht nach Runde 2 (neu = fett):

| Route | Seite |
|---|---|
| `/` | Start (Themenblöcke + Journeys) |
| `/dashboard` (Alias `/fortschritt`) | Dashboard |
| **`/thema/:themaId`** | Aufgabenliste eines Oberthemas |
| `/journey/:journeyId`, `/journey/:journeyId/task/:taskId` | wie bisher |
| `/vergleich`, `/vergleich/:kategorieId` | Vergleich (mit Anbieter-Angeboten) |
| **`/vergleich/:kategorieId/abschluss/:angebotId`** | Checkout (3 Schritte) |
| **`/dokumente`**, **`/dokumente/:themaId`** | Dokumentenablage |
| **`/wallet`** | Wallet & Abschlüsse |
| `/termine`, `/suche`, `/onboarding`, `/profil`, `/impressum`, `/datenschutz` | wie bisher |

---

## 3. Themenblöcke (Oberthemen) auf der Startseite

**Ziel:** Übersichtliche Einstiegsblöcke nach Lebensbereichen („Finanzen",
„Wohnen" …), zusätzlich zu den geführten Journeys.

**Datenmodell** – neues `src/data/themen.ts`:

```ts
import type { TaskCategory } from './types'

export type Thema = {
  id: string            // 'finanzen', 'wohnen', ...
  titel: string
  icon: string          // Emoji, z. B. '💶'
  beschreibung: string  // 1 Satz für die Karte
  kategorien: TaskCategory[]  // welche Task-Kategorien gehören dazu
  unterordner: string[] // für die Dokumentenablage (Abschnitt 6)
}

export const themen: Thema[] = [
  { id: 'finanzen',       titel: 'Finanzen',            icon: '💶', kategorien: ['finanzen'],            unterordner: ['Verträge', 'Bescheide', 'Nachweise', 'Korrespondenz'], beschreibung: 'Konto, Steuer, Sparen – dein Geld im Griff.' },
  { id: 'wohnen',         titel: 'Wohnen',              icon: '🏠', kategorien: ['wohnen'],              unterordner: ['Mietvertrag', 'Nebenkosten', 'Übergabe & Protokolle', 'Korrespondenz'], beschreibung: 'Alles rund um die erste eigene Wohnung.' },
  { id: 'amt-recht',      titel: 'Amt & Recht',         icon: '🏛️', kategorien: ['amt', 'recht'],        unterordner: ['Ausweise', 'Bescheide', 'Anmeldungen', 'Sonstiges'], beschreibung: 'Anmeldung, Ausweis, deine Rechte ab 18.' },
  { id: 'versicherungen', titel: 'Versicherungen',      icon: '🛡️', kategorien: ['versicherung'],        unterordner: ['Policen', 'Schadensfälle', 'Korrespondenz'], beschreibung: 'Was du wirklich brauchst – und was nicht.' },
  { id: 'mobilitaet',     titel: 'Mobilität',           icon: '🚗', kategorien: ['mobilitaet'],          unterordner: ['Führerschein', 'Fahrzeug', 'Versicherung', 'Tickets'], beschreibung: 'Führerschein, erstes Auto, unterwegs sein.' },
  { id: 'gesundheit',     titel: 'Gesundheit',          icon: '🩺', kategorien: ['gesundheit'],          unterordner: ['Krankenkasse', 'Befunde', 'Impfungen & Ausweise'], beschreibung: 'Krankenkasse, Arzttermine, Vorsorge.' },
  { id: 'arbeit',         titel: 'Arbeit & Ausbildung', icon: '💼', kategorien: ['arbeit'],              unterordner: ['Verträge', 'Lohnabrechnungen', 'Bewerbungen', 'Zeugnisse'], beschreibung: 'Bewerbung, Ausbildung, erste Gehaltsabrechnung.' },
]

// Alle für das Profil relevanten Aufgaben eines Themas, über alle Journeys.
export function tasksFuerThema(themaId: string, profile: Profile | null):
  Array<{ journeyId: string; task: Task }>
```

**Startseite (`Home.tsx`)** – neuer Aufbau von oben nach unten:

1. Begrüßung/Intro (bestehend).
2. **„Deine Themen"** – Grid `grid-cols-2 md:grid-cols-3 gap-4`, eine Karte je
   Thema (nur Themen mit ≥ 1 relevanter Aufgabe). Karte: Icon, Titel,
   Beschreibung, Mini-Fortschritt („3 von 7 erledigt" + schmaler Balken),
   verlinkt auf `/thema/:themaId`.
3. **„Geführte Wege"** – die bestehenden Journey-Karten (unverändert darunter).

**Themenseite (`/thema/:themaId`, neue Seite `Thema.tsx`):** gleicher Aufbau
wie `JourneyOverview` (Fortschrittsbalken oben, Aufgabenliste mit
Erledigt-Häkchen), aber Aufgaben aus **allen** Journeys, gefiltert nach
`thema.kategorien` und Profil-Relevanz. Jede Zeile zeigt zusätzlich klein den
Journey-Namen und – falls vorhanden – den Vergleichs-Chip (Abschnitt 7).

**Akzeptanzkriterien**

- [ ] Jede Aufgabe erscheint in genau einem Themenblock (Kategorie→Thema ist eindeutig).
- [ ] Themen ohne relevante Aufgaben werden ausgeblendet.
- [ ] Fortschritt im Themenblock = Summe über alle enthaltenen Aufgaben (nutzt `useAllProgress`).
- [ ] Erledigt-Status ist überall derselbe (gleicher `progress`-Store, Schlüssel `journeyId:taskId`).

---

## 4. Vergleich v2 – konkrete Anbieter-Angebote

**Ziel:** Die Vergleichsseite stellt pro Kategorie sofort **konkrete, kuratierte
Angebote echter Anbieter** vor. Eigene Angebote eintragen (Bestandsfeature)
bleibt möglich.

**Datenmodell** – neues `src/data/anbieter.ts`:

```ts
export type AnbieterAngebot = {
  id: string                 // 'strom-tibber'
  kategorieId: string        // referenziert vergleichsKategorien
  anbieter: string           // 'Tibber'
  logoEmoji: string          // '⚡' (bis echte Logos lizenziert sind)
  preisAb: string            // '5,99 € / Monat + Börsenpreis'
  kurzFeatures: [string, string, string]
  zielgruppe?: string        // 'Gut, wenn du eine App-Lösung willst'
  werte: Record<string, string>  // füllt die bestehenden Kriterien-Spalten
  abschluss: 'app' | 'extern'    // App-Checkout möglich oder nur externer Link
  url: string                // Anbieter-Website (für 'extern')
  standDaten: string         // '2026-07' – wann redaktionell geprüft
}
```

**Kuratierte Startdaten** (Web-Recherche 07/2026 – vor Launch redaktionell
verifizieren, Preise sind Richtwerte):

| Kategorie | Anbieter | Eckdaten |
|---|---|---|
| Strom | **Tibber** | dyn. Tarif, ~5,99 €/Mon. Grundgebühr + Börsenpreis, beste App |
| Strom | **Ostrom** | digital, monatlich kündbar, ~6 €/Mon. Grundgebühr |
| Strom | **Rabot Charge** | dyn. Tarif, funktioniert auch ohne Smart Meter |
| Strom | **Octopus Energy** | fairer Fixtarif, guter Kundenservice |
| Girokonto | **Trade Republic** | 0 € Konto, ~2,25 % Zinsen auf Guthaben, Karte inkl. |
| Girokonto | **finanzen.net zero** | 0 € Depot-Kombi, Orders ab 500 € kostenlos |
| Girokonto | **Scalable Capital** | ~2,5 % Zinsen, Depot integriert |
| **Depot (neu)** | Trade Republic / finanzen.net zero / Scalable | 1 €- bzw. 0 €-Orders, ETF-Sparpläne kostenlos |
| Haftpflicht | **HUK24** | ab ~3 €/Mon., Stiftung Warentest „sehr gut" |
| Haftpflicht | **Getsafe** | App-first, monatlich kündbar |
| Hausrat | **HUK24** | Kombi mit Haftpflicht möglich, ab ~26 €/Jahr |
| Hausrat | **Lemonade** | digital, Abschluss in Minuten |
| Handy | **fraenk** | 10 €/30 GB, Telekom-Netz, monatlich kündbar |
| Handy | **congstar Young** | unter 28 J. doppeltes Datenvolumen |
| Internet | **congstar Zuhause** | ~36 €/Mon., flexibel, auch Glasfaser |
| Internet | **o2 / 1&1** | Alternativen je nach Verfügbarkeit |
| Kfz | **HUK24** | günstiger Direktversicherer |
| Kfz | **Verti** | Direktversicherer, oft günstig für Fahranfänger:innen |

Quellen (redaktionelle Basis): strom-report.com, finanztip.de, zendepot.de,
kritische-anleger.de, sicherheitsanker.de, handyhase.de, dslweb.de,
balkonkraftwerk-kompendium.de.

**Neues Vergleichsmodul `depot`** in `vergleichsKategorien` (Kriterien:
Orderkosten, Sparplan-Kosten, Zinsen auf Guthaben, Mindestrate, Notizen) –
verknüpft mit `finanzen:depot-etf` (Abschnitt 7).

**Detailseite (`VergleichDetail.tsx`) – neuer Aufbau:**

1. Intro + Tipps (bestehend).
2. **„Angebote für dich"**: Karten-Grid der kuratierten Angebote. Karte:
   Logo-Emoji, Anbieter, `preisAb` groß, 3 Kurz-Features, Badge „Stand 07/2026".
   Primär-Button je nach `abschluss`:
   - `app` → **„Über Startklar abschließen"** → Checkout (Abschnitt 5)
   - `extern` → **„Zum Anbieter →"** (öffnet `url`, `rel="sponsored noopener"`)
   Darunter klein der Provisionshinweis (Abschnitt 1).
3. **Vergleichstabelle** (bestehend): kuratierte Angebote erscheinen als
   vorbefüllte Spalten (aus `werte`, nicht editierbar, mit „Startklar"-Badge),
   eigene Angebote weiterhin editierbar. Favorit-Stern für beide Arten.

**Akzeptanzkriterien**

- [ ] Jede Kategorie zeigt 2–4 kuratierte Angebote mit Stand-Datum.
- [ ] Kuratierte Werte sind nicht editierbar, eigene Angebote schon.
- [ ] Provisionshinweis an jedem Abschluss-/Anbieter-Button sichtbar.
- [ ] Externe Links mit `rel="sponsored noopener"` und `target="_blank"`.

---

## 5. Wallet & Abschluss-Flow (Provisionsabwicklung)

**Ziel:** Käufe/Vertragsabschlüsse so unkompliziert wie möglich – Daten einmal
hinterlegen, mit zwei Bestätigungen abschließen. Provisionen wickelt Startklar
mit dem Anbieter ab; Nutzer:innen zahlen nie etwas an Startklar.

**Scope Runde 2/3:** UI + lokale Datenhaltung vollständig; die tatsächliche
Anbindung von Anbietern/Zahlungsdiensten ist ein Backend-Thema späterer Runden.
Der Flow wird so gebaut, dass ein Backend später nur die `status`-Übergänge
liefert.

**Neue Seite `/wallet` (`Wallet.tsx`)** – drei Abschnitte:

1. **Zahlungsmittel & Daten**
   - Karten-Liste der hinterlegten Zahlungsmittel, „+ Hinzufügen" öffnet Formular
     (Typ: SEPA-Lastschrift [IBAN + Name], PayPal [E-Mail], Karte [Nr./Ablauf –
     nur maskiert gespeichert]).
   - Hinweis: „Deine Daten bleiben auf deinem Gerät und werden nur beim
     Abschluss an den jeweiligen Anbieter übertragen."
2. **Deine Abschlüsse** – Liste aller über Startklar abgeschlossenen Verträge
   (Anbieter, Kategorie, Datum, Status-Badge: Eingereicht → Bestätigt → Aktiv),
   je mit Link zum automatisch abgelegten Dokument (Abschnitt 6).
3. **Verlauf** – chronologische Ereignisliste (abgeschlossen, gekündigt, Dokument erhalten).

**Datenmodell** – `src/hooks/useWallet.ts`, localforage-Store
`{ name: 'startklar', storeName: 'wallet' }`:

```ts
export type Zahlungsmittel = {
  id: string
  typ: 'sepa' | 'paypal' | 'karte'
  label: string        // 'SEPA · DE89 **** 3000'
  details: Record<string, string> // maskiert gespeichert
}

export type Abschluss = {
  id: string
  angebotId: string    // AnbieterAngebot.id
  kategorieId: string
  anbieter: string
  datum: string        // ISO
  status: 'eingereicht' | 'bestaetigt' | 'aktiv' | 'gekuendigt'
  zahlungsmittelId?: string
  dokumentId?: string  // Bestätigungsdokument (Abschnitt 6)
}
```

**Checkout-Flow** (`/vergleich/:kategorieId/abschluss/:angebotId`,
`Checkout.tsx`, 3 Schritte mit Fortschrittsanzeige oben):

1. **Angebot prüfen** – Zusammenfassung der Angebotskarte + Kriterienwerte.
2. **Daten bestätigen** – Formular, vorbefüllt aus Profil (Name) und Wallet
   (Zahlungsmittel-Auswahl); Pflichtfelder: Name, Adresse, Geburtsdatum,
   Zahlungsmittel. Alles editierbar. Fehlende Angaben werden inline ergänzt und
   optional ins Profil/Wallet zurückgespeichert („Für nächstes Mal merken").
3. **Abschließen** – Checkbox „Ich habe die Vertragsbedingungen des Anbieters
   gelesen", Provisionshinweis, Button **„Jetzt kostenpflichtig abschließen"**.

**Nach dem Abschluss (Bestätigungsseite):**

- `Abschluss` wird mit Status `eingereicht` gespeichert.
- Bestätigungs-PDF-Ersatz (in Runde 2: generiertes Text-Dokument) landet
  automatisch im richtigen Themenordner der Dokumentenablage.
- Vorschlags-Karte: „📅 Erinnerung anlegen: alten Vertrag kündigen?" → prefillt
  `/termine?neu=1&titel=…`.
- Vorschlags-Karte: „✓ Aufgabe ‚{Task-Titel}' als erledigt markieren?" – wenn
  die Kategorie über `vergleichFuerTask` mit einer offenen Aufgabe verknüpft ist.

**Akzeptanzkriterien**

- [ ] Kompletter Abschluss mit hinterlegtem Wallet in < 60 Sekunden / max. 3 Screens.
- [ ] Ohne Wallet-Daten funktioniert der Flow ebenfalls (alles im Schritt 2 eintragbar).
- [ ] Abschluss erzeugt automatisch: Wallet-Eintrag + Dokument + optional Termin + Task-Vorschlag.
- [ ] Sensible Daten werden nur maskiert angezeigt; Löschen einzelner Zahlungsmittel möglich.

**Rechtliche Prüfpunkte (offen, vor Live-Gang klären):**

- Versicherungsvermittlung erfordert Erlaubnis nach **§ 34d GewO** (bzw.
  Kooperation mit lizenziertem Makler).
- Zahlungsabwicklung ggf. über lizenzierten Zahlungsdienstleister (ZAG/PSD2) –
  in Runde 2 fließt kein echtes Geld.
- Provisionstransparenz nach § 6a UWG / Impressumspflichten („Werbung"-Kennzeichnung).

---

## 6. Dokumente – automatische Ablage nach Themenbereich

**Ziel:** Alle Unterlagen sind ohne eigenes Zutun optimal sortiert und in
Sekunden auffindbar. Gleiches Blockprinzip wie die Startseite: erst Thema,
im Ordner dann Unterordner.

**Neue Seite `/dokumente` (`Dokumente.tsx`):**

1. **Themen-Grid** (identische Karten-Optik wie Startseite): je Thema Icon,
   Titel, Anzahl Dokumente, zuletzt hinzugefügt. Klick → `/dokumente/:themaId`.
2. **„+ Dokument hinzufügen"** (prominent oben): Datei wählen (PDF/Bild) →
   **Auto-Einsortierung**: Startklar schlägt Thema + Unterordner vor, per
   Schlüsselwort-Erkennung in Dateiname und eingegebenem Titel
   (z. B. „mietvertrag" → Wohnen/Mietvertrag, „police|haftpflicht" →
   Versicherungen/Policen, „lohn|gehalt" → Arbeit/Lohnabrechnungen).
   Vorschlag ist per Dropdown änderbar → Speichern.
3. **Ordneransicht `/dokumente/:themaId`**: Unterordner als Abschnitte
   (aus `thema.unterordner`), darin Dokument-Zeilen (Icon nach Dateityp, Titel,
   Datum, Quelle-Badge, Aktionen: Öffnen/Herunterladen, Verschieben, Löschen).
4. **Suchfeld** oben (nutzt dieselbe `normalisiere`/Token-Logik wie die Suche).

**Automatische Zuflüsse:**

- Jeder **Abschluss** (Abschnitt 5) legt seine Bestätigung selbst ab
  (`quelle: 'abschluss'`).
- **Zielbild** (spätere Runde, im Konzept festgehalten): Institutionen
  (Krankenkasse, Amt, Anbieter) liefern Dokumente direkt bei Erhalt über eine
  Schnittstelle zu (`quelle: 'institution'`) – die Datenstruktur ist dafür
  bereits ausgelegt, es fehlt nur der Transportweg (Backend/Postbox-API).

**Datenmodell** – `src/hooks/useDokumente.ts`, Store
`{ name: 'startklar', storeName: 'dokumente' }` (Blobs in IndexedDB sind über
localforage problemlos möglich):

```ts
export type Dokument = {
  id: string
  titel: string
  themaId: string       // referenziert themen (Abschnitt 3)
  unterordner: string
  quelle: 'upload' | 'abschluss' | 'institution'
  mimeType: string
  datum: string         // ISO, Eingangsdatum
  dateiName: string
  blob: Blob
}
```

Auto-Einsortierung – neues `src/data/dokumentRegeln.ts`:

```ts
export type DokumentRegel = { muster: string[]; themaId: string; unterordner: string }
export const dokumentRegeln: DokumentRegel[] = [
  { muster: ['mietvertrag', 'miete'], themaId: 'wohnen', unterordner: 'Mietvertrag' },
  { muster: ['nebenkosten', 'betriebskosten'], themaId: 'wohnen', unterordner: 'Nebenkosten' },
  { muster: ['police', 'haftpflicht', 'hausrat', 'versicherungsschein'], themaId: 'versicherungen', unterordner: 'Policen' },
  { muster: ['lohn', 'gehalt', 'entgelt'], themaId: 'arbeit', unterordner: 'Lohnabrechnungen' },
  { muster: ['steuer', 'bescheid'], themaId: 'finanzen', unterordner: 'Bescheide' },
  { muster: ['kontoauszug', 'depot'], themaId: 'finanzen', unterordner: 'Nachweise' },
  { muster: ['impf', 'befund'], themaId: 'gesundheit', unterordner: 'Befunde' },
  { muster: ['fuehrerschein', 'zulassung'], themaId: 'mobilitaet', unterordner: 'Führerschein' },
  // Fallback: themaId nach Wahl, Unterordner 'Sonstiges'
]
```

**Akzeptanzkriterien**

- [ ] Upload → Vorschlag → Speichern in ≤ 3 Interaktionen.
- [ ] Falsch einsortierte Dokumente lassen sich per „Verschieben" umhängen.
- [ ] Abschluss-Bestätigungen erscheinen ohne Nutzeraktion im richtigen Ordner.
- [ ] Alles bleibt lokal (IndexedDB); Export einzelner Dateien per Download-Button.
- [ ] Dashboard-Widget „Dokumente" zeigt Gesamtzahl + letzte 2 Neuzugänge.

---

## 7. Deep-Links: To-do → passendes Vergleichsmodul

**Ziel:** Wer in einer Aufgabe steht („Such dir einen Stromanbieter aus"),
kommt mit einem Klick genau ins passende Vergleichsmodul.

**Bestand:** `vergleichFuerTask` in `src/data/vergleich.ts` verknüpft bereits
6 Aufgaben; `TaskDetail` zeigt dafür eine CTA-Karte.

**Ausbau:**

1. Mapping vervollständigen:
   ```ts
   export const vergleichFuerTask: Record<string, string[]> = {
     'erste-wohnung:strom-internet': ['strom', 'internet'],
     'erste-wohnung:hausrat': ['hausrat'],
     'finanzen:girokonto': ['girokonto'],
     'finanzen:haftpflicht': ['haftpflicht'],
     'finanzen:depot-etf': ['depot'],          // neu (Modul aus Abschnitt 4)
     'finanzen:haushaltsbudget': ['girokonto'],// neu
     'mobilitaet:kfz-versicherung': ['kfz'],
     'mobilitaet:kfz-anmelden': ['kfz'],       // neu
     'start:vertraege': ['handy'],
     'start:krankenkassen-wechsel': [],        // bewusst leer: kein Modul
   }
   ```
2. **Chip in Aufgabenlisten** (`JourneyOverview.tsx`, neue `Thema.tsx`,
   Dashboard-Widget „Nächste Schritte"): Aufgaben mit Mapping bekommen rechts
   einen kleinen Pill-Link „Vergleich →" (`bg-pine-mist text-pine`,
   `hover:bg-coral hover:text-white`), der direkt auf
   `/vergleich/:kategorieId` führt – ohne die Aufgabe öffnen zu müssen.
3. **Im Aufgabentext:** Schritte, die auf einen Vergleich hinweisen, erhalten
   ein optionales Feld im Task-Typ:
   ```ts
   interface Task {
     // ... bestehend
     vergleichAbSchritt?: number // ab diesem Schritt den Vergleichs-Chip inline zeigen
   }
   ```
   (bewusst minimal – kein Link-Parsing in Strings.)

**Akzeptanzkriterien**

- [ ] Jede Aufgabe, zu der ein Vergleichsmodul existiert, ist verlinkt (Liste + Detail).
- [ ] Chips öffnen das Modul direkt; zurück führt der Browser-Back sauber zur Liste.

---

## 8. Dashboard-Ausbau (nach Runde 2)

Das Widget-Grid (bereits umgesetzt, Abschnitt 9) bekommt mit den neuen Modulen
zwei zusätzliche Kacheln:

- **Wallet-Widget** (1×1): Anzahl aktiver Abschlüsse + Status des jüngsten
  („Strom · Tibber · Bestätigt"), Link `/wallet`.
- **Dokumente-Widget** (1×1): Gesamtzahl + letzter Neuzugang, Link `/dokumente`.

Beide ersetzen keine bestehenden Kacheln, sondern füllen die Reihe unter den
Stat-Kacheln (Desktop) bzw. reihen sich mobil ein.

---

## 9. In diesem Branch umgesetzt (Referenz)

| Änderung | Dateien |
|---|---|
| **Suche v2**: Token-Suche mit UND-Logik statt Exakt-Substring; Satzzeichen/Bindestriche normalisiert („kfz versicherung" findet „KFZ-Versicherung"); Synonym-Wörterbuch („GEZ"→Rundfunkbeitrag, „Auto"→KFZ …); Vergleichs-Suche durchsucht auch Kriterien-Labels; Titel-Treffer ranken höher | `src/pages/Suche.tsx`, `src/data/synonyme.ts`, `src/data/suchen.ts` |
| **Panik-Satz entfernt** („Kein Grund zur Panik …") | `src/pages/TaskDetail.tsx` |
| **Pfeil-Buttons entfernt** (unten in der Aufgabe); stattdessen nach „Erledigt" ein dezenter Textlink „Nächster Schritt: … →" zum nächsten offenen Schritt | `src/pages/TaskDetail.tsx` |
| **Dashboard**: Fortschrittseite heißt jetzt „Dashboard" (Nav + `/dashboard`, `/fortschritt` bleibt Alias) und ist ein responsives Widget-Grid: dunkle Hero-Kachel mit Fortschritts-Ring, 4 Stat-Kacheln (Erledigt/Offen/Bereiche/Aktive Tage), Wallet- und Dokumente-Widget, Bereichs-Balken, Aktivitäts-Heatmap, nächste Schritte, Termine, zuletzt erledigt | `src/pages/Dashboard.tsx`, `src/components/Layout.tsx`, `src/components/ui/*` |
| **Themenblöcke (§3)**: 7 Oberthemen mit Karten-Grid auf der Startseite (Mini-Fortschritt je Block) + Themenseite `/thema/:themaId` mit journey-übergreifender Aufgabenliste | `src/data/themen.ts`, `src/pages/Home.tsx`, `src/pages/Thema.tsx`, `useTaskListProgress` in `src/hooks/useProgress.ts` |
| **Vergleich v2 (§4)**: kuratierte Anbieter-Angebote als Karten + vorbefüllte, nicht editierbare Tabellenspalten („Startklar-Angebot"), neues Modul `depot`, Favorit über kuratierte und eigene Angebote hinweg, Provisionstexte statt Neutralitäts-Claim | `src/data/anbieter.ts`, `src/data/vergleich.ts`, `src/pages/Vergleich.tsx`, `src/pages/VergleichDetail.tsx`, `src/hooks/useVergleich.ts` |
| **Wallet & Checkout (§5)**: `/wallet` (Zahlungsmittel maskiert, Abschlüsse mit Status, Verlauf), 3-Schritt-Checkout `/vergleich/:kategorieId/abschluss/:angebotId` mit Vorbefüllung aus Profil/Wallet; nach Abschluss automatisch: Bestätigungs-Dokument, Termin-Vorschlag („alten Vertrag kündigen"), Aufgabe-erledigt-Vorschlag | `src/hooks/useWallet.ts`, `src/pages/Wallet.tsx`, `src/pages/Checkout.tsx` |
| **Dokumente (§6)**: `/dokumente` (Themenordner-Grid, Upload mit Auto-Einsortierung per Schlüsselwort-Regeln, Suche) + `/dokumente/:themaId` (Unterordner, Herunterladen/Verschieben/Löschen, Quelle-Badges); Abschluss-Bestätigungen landen automatisch im richtigen Ordner | `src/hooks/useDokumente.ts`, `src/data/dokumentRegeln.ts`, `src/pages/Dokumente.tsx`, `src/pages/DokumenteThema.tsx` |
| **Deep-Links (§7)**: `vergleichFuerTask` vervollständigt (inkl. `depot`), Chip-Komponente in Aufgabenlisten (Journey, Thema, Dashboard) und inline in der Schritt-Anleitung (`Task.vergleichAbSchritt`) | `src/components/VergleichChip.tsx`, `src/pages/JourneyOverview.tsx`, `src/data/journeys/*` |
| **Fakten-Renderer (§B7)**: `mitFakten()` ersetzt `{PLATZHALTER}` in Aufgabentexten; ungeprüfte Werte erscheinen als „wird geprüft" statt als rohes Token | `src/data/fakten.ts`, `src/pages/TaskDetail.tsx`, `src/pages/JourneyOverview.tsx` |
| **Navigation**: Start · Dashboard · Vergleich · Dokumente · Termine · Wallet · Suche | `src/components/Layout.tsx`, `src/App.tsx` |
| **Design-Fix**: fehlendes Farb-Token `--color-pine-soft` ergänzt (Versicherung-Badge hatte keinen Hintergrund); Ring-Label nicht mehr mitrotiert | `src/index.css`, `src/components/ui/Ring.tsx` |

---

## 10. Verbleibende Arbeit (Redaktion & spätere Runden)

- **Redaktion**: Anbieterdaten in `anbieter.ts` verifizieren (Preise/Konditionen),
  `fakten.ts`-Platzhalter mit geprüften Werten füllen und `geprueft`-Datum setzen –
  der Substitutions-Renderer zeigt sie dann automatisch an.
- **Backend-Themen** (spätere Runde): echte Anbieter-/Zahlungsanbindung für den
  Checkout, Institutionen-Zulieferung für Dokumente (`quelle: 'institution'`),
  rechtliche Klärung (§ 34d GewO, ZAG) vor Live-Gang.
- **Runde 3 (geplant)**: Provisions-Partner mit Affiliate-Netzwerken,
  Slot-Modell (Partner + provisionsfreie Alternative), rechtssichere
  Tippgeber-Links für Versicherungen, Transparenzseite und Lern-Modul –
  vollständige Planung in `KONZEPT-PROVISIONEN.md`.

Keine Migration nötig: nur neue localforage-Stores `wallet`, `dokumente`;
bestehende Schlüssel bleiben unberührt.
