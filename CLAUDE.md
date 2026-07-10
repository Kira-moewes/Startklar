# CLAUDE.md — Leitfaden & Nordstern für Startklar

Dieses Dokument ist für jeden Chat/Agenten, der an Startklar arbeitet. Es sagt,
**was** die App ist, **wohin** sie sich entwickelt (3D-Richtung) und **welche
Regeln nicht verhandelbar** sind. Sprache im Repo & mit Kira: **Deutsch, per du.**

---

## Was Startklar ist

Eine Webapp, die jungen Erwachsenen — besonders **Care-Leavern und Menschen ohne
Familien-Backup** — beim „Erwachsen werden" hilft (Behörden, Geld, Wohnung).
Kernhaltung (r7): **Selbstwirksamkeit stärken**, schamfrei, ruhig, **niemals
manipulieren**. Alles lokal (localforage), kein Konto nötig, PWA.

Zwei Ansichten, im Profil umschaltbar (**Spiel / Klassisch**):
- **Klassisch:** nüchterne, editoriale Aufgaben-/Fortschrittsansicht (`Home`,
  `Dashboard`/„Fortschritt", Journeys, Aufgaben).
- **Spiel „Über dem Nebel":** dieselben echten Aufgaben als Reise — man bewegt
  sich über einer Nebeldecke (= Überforderung) und gewinnt **Überblick**.
- **Brief-Pfad (`/post`):** der emotionale Kern — der Brief-Entschlüsseler nimmt
  angsteinflößender Behördenpost die Wucht (ruhig, „schon zu spät?"-Zweig,
  „Mach's allein"-Skript, Krisen-Weiche). Der Higgsfield-Trailer und das Spiel
  sind Beiwerk; **dieser Pfad ist Kern.**

---

## Nordstern (r9+): menschliche 3D-Figuren & begehbare 3D-Welt

Kira richtet die **Spiel-Ebene** neu aus. Ziel:

1. **Menschliche Hauptfiguren statt Tier-Maskottchen.** Der bisherige Held Fiete
   (Papierflieger-**Katze**) ist **nicht** mehr die Hauptfigur. Stattdessen: die
   Nutzerin als **realistischer, selbst gestaltbarer Mensch** — ein
   **Videospiel-Charakter, den man designt/anpasst** (Hautton, Haare, Gesicht,
   Outfit …).
2. **Begehbare 3D-Welt.** Statt einer statischen Insel-Liste eine **3D-Welt, in
   der man sich bewegt** und Inseln/Bereiche erkundet.
3. **Klaro bleibt als kleiner Begleiter** (Charme + Kontinuität), nicht als Held.
   Fiete/Papierflieger höchstens als Nebenmotiv.
4. **Higgsfield-Video bleibt der Trailer.** Liegt auf der Home als Hero
   (`src/components/Hero.tsx`, `public/hero.mp4`) und **bleibt dort**. Es wirkt
   wie ein Trailer und leitet in die App.
5. **Die aktuell „animierten Inseln"** (`FlugWeltHero`/`FlugWelt3D`, heute oben
   auf `/himmel`) **sollen woanders hin** — nicht mehr als zweiter „Hero" mit dem
   Video konkurrieren. (Genaues Ziel mit Kira klären; sie werden ohnehin von der
   echten 3D-Welt abgelöst.)

**Kunst-Richtung:** realistisch, **erwachsen — nicht kindisch** (r7-Prinzip). Zur
ruhigen, cremig-erdigen Markenwelt passen (Tokens `olive`/`pine`/`cream`/`band`,
Instrument Serif/Sans). **Repräsentation zuerst** (diverse Hauttöne, Haartypen,
Kopftuch, Rollstuhl, Brille … als gleichwertige Bausteine).

### Zwei Umsetzungswege — **empfohlen: Weg A**

- **Weg A (empfohlen): in-app mit react-three-fiber** (Three.js + @react-three/fiber
  sind **bereits im Stack**). Die 3D-Welt und die Avatare leben **in** Startklar
  (z.B. an `/himmel`). 3D-Charaktermodelle als **GLB** — Assets können via
  **Higgsfield** entstehen (`generate_image` für Konzepte, `generate_3d` für
  GLB-Meshes). Vorteil: eine App, PWA, lokale Daten, direkt an die echten Aufgaben
  gekoppelt, Anti-Dark-Pattern-Regeln greifen weiter.
- **Weg B (nur für ein separates Showcase): game-studio/Higgsfield-Pipeline.** Die
  von Kira hochgeladene `game-studio`-Skill baut ein **eigenständiges, deploytes
  Browser-Game** (eher Arcade/Multiplayer) über die Higgsfield-Spiel-Pipeline —
  mit **Pflicht-Interview** und Credits/Deploy. Das ist gut für ein separates
  „Trailer-Game", aber **nicht** für die in die App integrierte, an echte Aufgaben
  gebundene Task-Welt. Nicht ohne ausdrückliche Ansage von Kira starten (Kosten +
  Interview-Gate laut Skill).

Details & Storyline: **`docs/konzept-r9-menschen-avatar.md`** (Konzept, Cast, Phasen).
Higgsfield ist von Kira verknüpft (MCP-Tools `generate_image`, `generate_video`,
`generate_3d`, `show_characters` …).

---

## Nicht verhandelbar (r7)

- **Anti-Dark-Pattern:** keine Streaks-Schuld, kein künstlicher Druck, keine
  Verknappung. Fortschritt = echte erledigte Aufgaben. Avatar-Kosmetik nur an
  echten Fortschritt gekoppelt, nie an „täglich einloggen".
- **Spiel ist optional** und blockiert **nie** die echte Hilfe — Klassisch-Modus
  bleibt vollwertig.
- **Erwachsen, nicht kindisch.** Ton ruhig, respektvoll, schamfrei.
- **Lokal & privat** (localforage), kein Tracking.
- **Barrierefreiheit:** `prefers-reduced-motion` respektieren (Einstellung
  `wenigerAnimation`), Kontrast hell/dunkel prüfen.

---

## Stack & Konventionen

- React 19, Vite 8, **Tailwind 4 (CSS-first)**, react-router 7, localforage,
  vite-plugin-pwa, **Three.js + @react-three/fiber**. Tests: **Vitest**. Linter:
  **oxlint**.
- **Design-Tokens** (siehe `src/index.css` & `docs/uebergabe-design.md` Abschnitt 2):
  `olive` (Akzent), `pine` (Text), `cream`/`cream-card` (Flächen), `band` (dunkle
  Sektionen), `on-akzent`. Schriften: Instrument Serif (Überschriften/Kursiv),
  Instrument Sans (Text). Muster: `<PageHead>`, `<Reveal>`, magnetische CTAs.
- **Story als Daten**, nicht im Code: `src/data/story.ts` (Kira kann Texte selbst
  anpassen).

## Bauen / Testen

```bash
npm install
npm run build   # muss grün sein
npm test        # vitest run (aktuell 17 grün)
npm run lint    # oxlint (nur Warnungen ok)
npm run preview -- --port 4173 --strictPort
```

## Branch-Regel (wichtig)

- **Nur EIN Chat pro Branch** gleichzeitig pushen, sonst überschreiben sich die
  Stände. Kanonischer Branch aktuell: `claude/install-skills-plugins-b3yt6t` (PR
  #7) — enthält Design + Story-Welt + 3D + Brief-Pfad. Neue Feature-Arbeit einen
  **eigenen** Branch geben (von dort oder von `main` abzweigen).

## Wichtige Dateien (Karte)

- Spiel-Welt: `src/pages/Himmel.tsx`, `src/components/spiel/` (`FlugWelt3D.tsx`,
  `FlugWeltHero.tsx`, `Flieger.tsx`, `Charakter.tsx` = Fiete/Klaro,
  `HimmelsTour.tsx`), `src/pages/Intro.tsx`, `src/data/story.ts`.
- Spiel-Logik/State: `src/lib/spiel.ts`, `src/hooks/useSpiel.ts`,
  `src/hooks/useSettings.tsx` (u.a. `welt`, `startseite`, `ausruestung`,
  `introGesehen`, `tourGesehen`, `wenigerAnimation`).
- Klassisch: `src/pages/Home.tsx`, `src/pages/Dashboard.tsx`, `src/data/journeys/`.
- Brief-Pfad: `src/pages/Post.tsx`, `src/data/briefe.ts`.
- Trailer: `src/components/Hero.tsx` (+ `public/hero.mp4`).

## Weiterführend

`docs/konzept-r9-menschen-avatar.md` (3D-Figuren/Welt-Konzept),
`docs/konzept-r7-strategie.md` (Warum/Haltung), `docs/konzept-r8-himmel-papierflieger.md`
(Spiel-Ebene), `docs/uebergabe.md` & `docs/uebergabe-design.md` (Stände/Handoff).
