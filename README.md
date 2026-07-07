# Startklar

Erwachsenwerden – aber machbar. Startklar begleitet junge Menschen bei den
ersten Behörden-, Geld- und Wohnungs-To-dos: verständlich, neutral und ohne
erhobenen Zeigefinger.

## Konzept v3 (umgesetzt)

Runde 3 ist geplant ([docs/konzept-r3.md](docs/konzept-r3.md)) und vollständig
umgesetzt:

- **Klaro, der Assistent** – schwebender Button auf jeder Seite. Antwortet
  standardmäßig komplett lokal (Intents + Suche über alle Schritte, Vergleiche
  und eine App-Hilfe-FAQ, kennt Profil/Fortschritt/Termine) und verlinkt immer
  die passende Stelle in der App. Kann mit Bestätigung Aktionen ausführen
  (Termin vorbereiten, Schritt abhaken, Navigation). Optionaler **KI-Modus**
  (Opt-in in den Einstellungen): schickt die Frage an eine Serverless Function
  (`netlify/functions/agent.mts` bzw. `api/agent.ts`), die die Claude-API
  nutzt – mit Guardrails, Rate-Limit und lokalem Fallback.
- **Profilseite** (`/profil`) – alle 7 Onboarding-Antworten einzeln änderbar,
  mit Live-Vorschau, wie viele Schritte sich dadurch ändern.
- **Einstellungen** – Hell/Dunkel/System, 4 Akzentfarben, Schriftgröße,
  weniger Animationen, KI-Schalter sowie Datenexport/-import als JSON und
  „Alles löschen" (Datenhoheit, alles bleibt lokal).

## Konzept v4 (umgesetzt)

Runde 4 ist geplant ([docs/konzept-r4.md](docs/konzept-r4.md)) und umgesetzt –
zwei Erweiterungen des Vergleichs:

- **Anbieter-Autofill** – im Vergleich reicht der Anbietername: Bei bekannten
  Anbietern (Erstbestand für Haftpflicht, Hausrat, Kfz) schlägt die App welche
  vor und füllt die Kriterien mit **Richtwerten** aus einem kuratierten lokalen
  Katalog vor. Richtwerte sind mit ≈ markiert, editierbar und tragen ein
  Stand-Datum; nach 12 Monaten warnt die App. Grenze der Neutralität neu
  gezogen: Startklar **nennt** Anbieter (sachliche Info, keine Provision, keine
  Links), **bewertet** sie aber nicht.
- **Bedarfscheck je Versicherung** – vor dem Vergleich beantwortest du 3–4
  kurze Fragen (Wizard, bekannte Profil-Antworten sind vorausgewählt). Daraus
  ergibt sich, ob und wie viel du brauchst (Stufe + Zielwerte). In der
  Vergleichstabelle erscheinen die Zielwerte als Referenzspalte „Dein Bedarf",
  eine Ampel prüft die Angebote dagegen, und das am besten passende **eigene**
  Angebot wird markiert – ausdrücklich nur unter deinen Eingaben, kein
  Marktranking. Alles bleibt lokal; Export/Import erfasst den Check automatisch.

## Konzept v5 (umgesetzt)

Runde 5 ([docs/konzept-r5.md](docs/konzept-r5.md)) baut den Vergleich weiter aus:

- **Anbieter-Chips** – die bekannten Anbieter stehen direkt als „+ Anbieter"-
  Buttons auf der Vergleichsseite: ein Tipp, und die Spalte ist mit
  Richtwerten vorbefüllt. Kein Tippen nötig.
- **Deine Unterlagen** – auf jeder Aufgaben-Seite und in jedem Vergleich
  lassen sich Dokumente (PDF oder Foto, max. 4 MB) lokal ablegen, ansehen und
  löschen. Sie bleiben auf dem Gerät und wandern mit in den Daten-Export;
  das Profil zeigt die Speichernutzung.
- **Drucken / PDF** – Vergleichstabelle und Bedarfscheck-Ergebnis lassen sich
  über den Druckdialog des Browsers als PDF sichern (ohne Zusatz-Bibliothek).

## Konzept v6 (umgesetzt)

Runde 6 ([docs/konzept-r6.md](docs/konzept-r6.md)):

- **Fragebogen-First** – bei jeder Versicherungs-Aufgabe (Haftpflicht, Hausrat,
  Kfz, neu: Krankenkasse) ist der Bedarfscheck jetzt sichtbarer Schritt 1 der
  Anleitung, mit Häkchen nach dem Ausfüllen. Die Fragebögen wurden auf 5–7
  Fragen erweitert und erzeugen einen druckbaren **Tarif-Steckbrief**
  (Zielwerte + empfohlene Bausteine) sowie die alphabetische Liste der
  Katalog-Anbieter, deren Richtwerte alle Zielwerte erfüllen – Information,
  keine Empfehlung: gleichrangig, ohne Provision, Richtwerte ungeprüft.
- **Echte Farbwahl** – neben den vier Vorgaben gibt es einen freien Farbwähler
  (Profil → Darstellung); die App leitet Abstufungen und kontrastsichere
  Schrift automatisch ab. Die Akzentfarbe prägt jetzt wirklich das Bild:
  Papierflieger, Primär-Buttons, Fortschritt, Heatmap und Checkboxen folgen
  ihr – hell wie dunkel, ohne Farb-Flash beim Laden.

## Konzept v7 (Strategie, geplant)

Runde 7 ([docs/konzept-r7-strategie.md](docs/konzept-r7-strategie.md)) ist
eine Strategierunde statt einer Umsetzungsrunde: psychologisches Fundament
(Angst/Ambiguität statt Langeweile als Kern-Diagnose), Gamification-Engine
mit Core Loop und Anti-Dark-Pattern-Leitplanken, drei Marken-/Design-
Richtungen, Monetarisierung ohne Provision (Förderung → Piloten → B2G) und
Roadmap mit Experimenten. Grundlage für r8 (Design-Deep-Dive) und r9
(MVP-Umbau).

## Deployment mit Netlify

1. Repo bei [Netlify](https://app.netlify.com) verbinden („Import from Git") –
   Build-Kommando und Publish-Verzeichnis kommen aus `netlify.toml`, jeder
   Push deployt automatisch.
2. Optional für den KI-Modus: In den Site-Settings die Umgebungsvariable
   `ANTHROPIC_API_KEY` setzen. Ohne Key funktioniert die App vollständig –
   Klaro antwortet dann ausschließlich lokal.

Alternativ funktioniert Vercel unverändert (`vercel.json` + `api/agent.ts`).

## Module (Planungskonzept v2)

- **Onboarding & Personalisierung** – 7 Fragen, danach werden nur relevante
  Bereiche und Schritte angezeigt (`src/data/profile.ts`, `src/data/visibility.ts`).
- **Bereiche & Aufgaben** – Journeys wie „Erste Wohnung", „Finanzen",
  „Mobilität" mit Schritt-für-Schritt-Anleitungen und Fristen (`src/data/journeys/`).
- **Suche** – Volltextsuche über alle Schritte inkl. Kategorie-Filter und
  Treffer in den Vergleichen (`/suche`).
- **Anbieter-Vergleich** – neutrale Vergleichstabellen (Strom, Internet,
  Haftpflicht, Hausrat, Girokonto, Kfz, Handy). Kriterien kommen von Startklar,
  Angebote trägt man selbst ein, Favorit markierbar. Keine Werbung, keine
  Provision (`/vergleich`).
- **Fortschritt** – Gesamt-Ring, Fortschritt je Bereich, Aktivitäts-Heatmap
  aus echten Erledigt-Daten, zuletzt erledigte und nächste Schritte
  (`/fortschritt`).
- **Termine/Agenda** – Termine anlegen (auch direkt aus einer Aufgabe),
  Gruppierung in Überfällig/Heute/Nächste 7 Tage/Später, ICS-Export für den
  Kalender (`/termine`).

Alle Nutzerdaten bleiben lokal auf dem Gerät (IndexedDB via localforage).

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Type-Check + Produktions-Build (inkl. PWA)
npm run lint     # oxlint
npm run preview  # Build lokal testen
```

Stack: React 19, TypeScript, Vite 8, Tailwind CSS 4, react-router 7,
localforage, vite-plugin-pwa. Deployment wahlweise via Vercel (`vercel.json`)
oder Netlify (`netlify.toml`) – beide leiten alle Routen als SPA-Fallback auf
`index.html`, damit react-router auch bei direktem Aufruf von Unterseiten greift.

Hinweis: Inhalte sind keine Rechtsberatung; Beträge und Fristen stehen als
`{PLATZHALTER}` in `src/data/fakten.ts`, bis sie redaktionell geprüft sind.
