# Startklar

Erwachsenwerden – aber machbar. Startklar begleitet junge Menschen bei den
ersten Behörden-, Geld- und Wohnungs-To-dos: verständlich, neutral und ohne
erhobenen Zeigefinger.

## Module (Konzept Runde 2, umgesetzt)

- **Onboarding & Personalisierung** – 7 Fragen, danach werden nur relevante
  Bereiche und Schritte angezeigt (`src/data/profile.ts`, `src/data/visibility.ts`).
- **Themenblöcke** – 7 Oberthemen (Finanzen, Wohnen, Amt & Recht, …) als
  Karten-Grid auf der Startseite mit Mini-Fortschritt; Themenseiten bündeln
  Aufgaben journey-übergreifend (`src/data/themen.ts`, `/thema/:themaId`).
- **Bereiche & Aufgaben** – Journeys wie „Erste Wohnung", „Finanzen",
  „Mobilität" mit Schritt-für-Schritt-Anleitungen und Fristen (`src/data/journeys/`);
  Aufgaben mit passendem Vergleichsmodul verlinken direkt dorthin.
- **Suche** – tokenbasierte Volltextsuche (UND-Logik, Bindestrich-tolerant,
  Synonyme wie „GEZ"→Rundfunkbeitrag in `src/data/synonyme.ts`) über alle
  Schritte inkl. Kategorie-Filter und Treffer in den Vergleichen (`/suche`).
- **Anbieter-Vergleich mit Slot-Modell** – pro Kategorie max. zwei
  Partner-Angebote (gekennzeichnet „Anzeige · Partner-Link", z. B. C24,
  comdirect, Tarifcheck, Verivox, Taxfix, bonify) plus immer eine Empfehlung
  „Ohne Provision" (Tibber, Trade Republic, HUK24, ELSTER, DSGVO-Datenkopie …)
  und eigene Einträge. Kategorien: Strom, Internet, Haftpflicht, Hausrat,
  Girokonto, Depot, Steuer-Software, SCHUFA & Bonität, Altersvorsorge, Kfz,
  Handy. Versicherungen laufen rechtssicher als Tippgeber-Link (§ 34d GewO),
  nie über einen In-App-Abschluss (`/vergleich`, `src/data/anbieter.ts`).
- **Wallet & Partner-Link-Flow** – Klick auf einen Partner-Link merkt sich
  eine Vormerkung; die App fragt nach („Hast du abgeschlossen?") und löst bei
  Ja die Automatik aus: Kündigungs-Erinnerung, Jahres-Preis-Check nach 11
  Monaten, Dokument-Upload-Hinweis, Aufgabe-erledigt-Vorschlag, Boni-Zähler
  (`/wallet`, `src/components/NachfrageKarte.tsx`).
- **Transparenz & Lernen** – `/transparenz` erklärt das Provisionsmodell und
  den Qualitäts-Check; `/lernen` liefert eigene provisionsfreie Kurz-Guides
  (Lohnabrechnung, SCHUFA, ETF, Brutto/Netto, Vergleichsportale) inkl.
  „Wusstest du?"-Widget im Dashboard (`src/data/lernen.ts`).
- **Dokumente** – Ablage mit automatischer Einsortierung nach Thema und
  Unterordner (Schlüsselwort-Regeln), Suche, Verschieben, Download
  (`/dokumente`, `src/data/dokumentRegeln.ts`).
- **Dashboard** – Widget-Grid mit Gesamtfortschritts-Ring, Stat-Kacheln,
  Fortschritt je Bereich, Aktivitäts-Heatmap aus echten Erledigt-Daten,
  Termin-Vorschau sowie nächsten und zuletzt erledigten Schritten
  (`/dashboard`, Alias `/fortschritt`).
- **Termine/Agenda** – Termine anlegen (auch direkt aus einer Aufgabe),
  Gruppierung in Überfällig/Heute/Nächste 7 Tage/Später, ICS-Export für den
  Kalender (`/termine`).

Alle Nutzerdaten bleiben lokal auf dem Gerät (IndexedDB via localforage).

Die vollständige Spezifikation für Runde 2 (Themenblöcke, Wallet & Checkout,
Dokumentenablage, Vergleich mit konkreten Anbietern, Deep-Links) steht in
`KONZEPT.md`. Die Planung für Runde 3 (Provisions-Partner, Affiliate-Recht,
Slot-Modell, Transparenzseite, Lern-Modul) steht in `KONZEPT-PROVISIONEN.md`.

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
