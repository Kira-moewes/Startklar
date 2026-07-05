# Startklar

Erwachsenwerden – aber machbar. Startklar begleitet junge Menschen bei den
ersten Behörden-, Geld- und Wohnungs-To-dos: verständlich, neutral und ohne
erhobenen Zeigefinger.

## Module (Planungskonzept v2)

- **Onboarding & Personalisierung** – 7 Fragen, danach werden nur relevante
  Bereiche und Schritte angezeigt (`src/data/profile.ts`, `src/data/visibility.ts`).
- **Bereiche & Aufgaben** – Journeys wie „Erste Wohnung", „Finanzen",
  „Mobilität" mit Schritt-für-Schritt-Anleitungen und Fristen (`src/data/journeys/`).
- **Suche** – tokenbasierte Volltextsuche (UND-Logik, Bindestrich-tolerant,
  Synonyme wie „GEZ"→Rundfunkbeitrag in `src/data/synonyme.ts`) über alle
  Schritte inkl. Kategorie-Filter und Treffer in den Vergleichen (`/suche`).
- **Anbieter-Vergleich** – Vergleichstabellen (Strom, Internet, Haftpflicht,
  Hausrat, Girokonto, Kfz, Handy). Kriterien kommen von Startklar, Angebote
  trägt man selbst ein, Favorit markierbar (`/vergleich`). Runde 2 sieht
  kuratierte Anbieter-Angebote mit transparentem Provisionsmodell vor –
  siehe `KONZEPT.md`.
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
`KONZEPT.md`.

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
