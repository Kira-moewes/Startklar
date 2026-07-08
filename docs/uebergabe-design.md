# Übergabe / Handoff – Startklar (Design-/Redesign-Chat + Merge)

**Zweck:** Alles Nötige, um in einem anderen Chat *genau hier* weiterzumachen –
ohne den bisherigen Gesprächsverlauf dieses Design-Chats. Ergänzt
`docs/uebergabe.md` (Story-/Spiel-Chat); beide Arbeitsstränge sind bereits
zusammengeführt (siehe Abschnitt 6).

- **Repo:** `62nghwy7c9-maker/Startklar`
- **Arbeits-Branch dieses Chats:** `claude/install-skills-plugins-b3yt6t`
  (enthält jetzt **beides**: Design + Story-Welt)
- **Offener PR:** #7 (Vercel-Vorschau, **nicht mergen** ohne Ansage). Der PR #6
  des Story-Chats kann geschlossen werden – seine Arbeit steckt vollständig in #7.
- **Stack:** React 19, Vite 8, Tailwind 4 (CSS-first), react-router 7,
  localforage, vite-plugin-pwa, seit dem Merge Three.js + @react-three/fiber.
  Tests: Vitest (9 grün). Linter: oxlint.
- **Ton:** Deutsch, per du. Ehrliche Kritik vor Zustimmung.

---

## 1. Was dieser Chat gemacht hat

**a) Skills/Plugins installiert (committet, 148 Dateien unter `.claude/skills/`):**
- `frontend-design` (anthropics/skills) und die **ui-ux-pro-max**-Suite
  (via `npx ui-ux-pro-max-cli init --ai claude`): ui-ux-pro-max, design,
  design-system, ui-styling, brand, banner-design, slides.

**b) Bewegungs-/Design-System aufgebaut (neue, wiederverwendbare Bausteine):**
- `src/hooks/useInView.ts` – IntersectionObserver-Hook (einmalig sichtbar).
- `src/components/Reveal.tsx` – Scroll-Reveal (nur opacity/transform, gestaffelt,
  respektiert reduzierte Bewegung).
- `src/components/PageHead.tsx` – einheitlicher Seitenkopf (Eyebrow + Serifen-
  H1 mit Italic-Akzent + Intro), auf allen Unterseiten genutzt.
- `src/components/KlaroPlane.tsx` – der Papierflieger als **Charakter** mit
  Augen, die blinzeln und dem Cursor folgen (`--px/--py`).
- `src/components/StoryRail.tsx` – Kapitel-HUD am linken Rand (Klaro fliegt die
  Route entlang, geglättete Scroll-Physik). Liegt jetzt auf `/so-gehts`.
- `src/index.css` – Motion-Tokens `--ease-out`/`--ease-expo`, `.reveal`,
  `.magnet` (magnetische Buttons), `.nav-u` (Nav-Unterstrich), markenfarbener
  `:focus-visible`, Hero-/Finale-Keyframes.
- `src/hooks/useCountUp.ts` – um `start`-Parameter erweitert (zählt erst beim
  Scrollen ins Bild).

**c) Startseite neu aufgeteilt (Nutzerin fand sie zu vollgepackt):**
- `src/pages/Home.tsx` ist jetzt **schlank & luftig**: Video-Hero → großer
  „startklar"-Auftritt (Buchstaben-Stagger) → luftige Zahlenreihe → Bereiche
  (dunkles Band) → ruhiger Abschluss-CTA (adaptiv je Profil).
- `src/pages/SoGehts.tsx` (**neu**, Route `/so-gehts`): alles Erklärende mit viel
  Weißraum – 3 Schritte, ruhiges Kachel-Band, Vergleich-Showcase, Klaro-Showcase,
  Prinzipien, Finale mit Klaros Looping-Flug. Trägt die `StoryRail`.
- `src/components/MarqueeTiles.tsx` beruhigt (klare Linien-Icons, weiche Ränder,
  langsames Gleiten – statt sechs hektischer Einzelanimationen).
- `src/components/Hero.tsx` – Video-Hero mit wortweise gestaffelter Headline,
  Ken-Burns-Zoom, Fade in die Seitenfarbe, Scroll-Cue.

**d) Alle Unterseiten auf dieselbe Design-Sprache gebracht:**
Dashboard, Onboarding (Klaro-Flieger mit Augen als Fortschrittsmarker),
Vergleich, Termine, Suche, Profil, VergleichDetail, Impressum, Datenschutz.
Layout: Nav-Unterstrich, „So geht's"-Menüpunkt, sanfter Seitenwechsel-Fade,
erweiterter Footer mit Markenblock + Sitemap.

---

## 2. Design-System (damit neue Seiten den Look treffen)

- **Schriften:** Instrument Serif (Überschriften + *kursive* Akzente),
  Instrument Sans (Fließtext).
- **Farb-Tokens:** `olive` (Akzent), `pine` (Text), `cream`/`cream-card`
  (Flächen), `band` (dunkelgrüne Sektionen), `paper` (helle Schrift auf dunkel),
  `on-akzent`. Hell/Dunkel + 4 Akzentfarben + freier Picker bleiben erhalten.
- **Muster:**
  - Seitenkopf: `<PageHead eyebrow=… title=… intro=… />`.
  - Karten: `rounded-[18–26px] border-pine/14 bg-cream-card`, Hover
    `-translate-y` + Schatten + Akzent, Pfeil `group-hover:translate-x-1`.
  - Scroll-Eintritt: `<Reveal delay={i*80}>…</Reveal>`.
  - Primär-CTAs magnetisch (`.magnet`, `onMouseMove`/`onMouseLeave`-Helper).
  - Gemeinsame Kurven: `var(--ease-out)`, `var(--ease-expo)`.

---

## 3. Getroffene Entscheidungen (bei Bedarf revidierbar)

- **„Post" NICHT im oberen Menü** (schon 7 Punkte, sollte luftig bleiben) –
  erreichbar über Route `/post` und die Spielwelt. Bei Bedarf ins Menü aufnehmen.
- **README:** r7/r8-Konzeptabschnitte behalten, Deployment-Überschrift = Vercel
  (main läuft auf Vercel).
- **Story-Content-Seiten (Post, Sammlung)** nur *poliert* (Hover, Reveals) –
  sie waren schon auf demselben Design-System. **Spiel-Flächen (Himmel, Intro)**
  behalten bewusst ihre eigene Bildsprache.

---

## 4. Starten / Testen

```bash
npm install          # nach dem Merge nötig (three, @react-three/fiber)
npm run build        # muss grün sein
npm run lint         # oxlint (nur Warnungen ok)
npm test             # vitest run (9 grün)
npm run preview -- --port 4173 --strictPort   # lokale Vorschau
```
- E2E/Screenshots optional mit `playwright-core` + Chromium unter
  `/opt/pw-browsers/chromium`; für WebGL (3D) Flags
  `--use-angle=swiftshader --enable-unsafe-swiftshader`.

---

## 5. Offene nächste Schritte

1. **Post im Menü?** – mit Kira klären.
2. **Story-Seiten weiter angleichen**, falls gewünscht (Himmel/Intro bleiben
   bewusst eigenständig).
3. **Storyline weben:** die Figuren (Fiete + Klaro) stärker durch die
   klassischen Seiten ziehen, wenn Kira das will.
4. **Barrierefreiheit/QA:** reduzierte Bewegung, Dynamic Type, Dark-Mode-Kontrast
   auf den neuen Seiten final prüfen.

---

## 6. Merge-Status & Branch-Koordination

- **Bereits zusammengeführt:** `origin/claude/startklar-app-strategy-cq0dd4`
  (Story-Welt „Über dem Nebel") wurde in
  `claude/install-skills-plugins-b3yt6t` gemergt.
- **4 Konflikte gelöst:** `src/App.tsx` (Routing – `StartRoute` zeigt für Profile
  mit `startseite==='spiel'` die Himmelskarte, sonst die klassische Home; plus
  `/so-gehts`, `/himmel`, `/intro`, `/post`, `/sammlung`), `src/components/Layout.tsx`
  (Menü), `src/index.css` (beide Animations-Sets nebeneinander), `src/pages/Profil.tsx`
  (PageHead + Spiel-Einstellungen).
- **Ergebnis:** eine App, beide Welten, Umschalter „Spiel/Klassisch" im Profil.
  Build grün, 9 Tests grün, kein horizontaler Überlauf.
- **Achtung Snapshot:** Es wurde ein Stand des Story-Branches gemergt. Wenn der
  Story-Chat *danach* weiter pusht, erneut mergen (Überschneidung ist winzig →
  einfach). Vor Weiterarbeit `git fetch` + `git log origin/<branch>` prüfen.
- **Skills/Plugins:** Der Story-Branch hatte **keine** `.claude/`-Dateien
  eingecheckt. Falls der Story-Chat Skills installiert, aber nicht committet hat,
  gehen sie beim Container-Neustart verloren → committen. Dieser Branch bringt die
  148 Skill-Dateien mit.

---

## 7. Kurz-Prompt zum Einfügen in den anderen Chat

> Arbeite am Repo `62nghwy7c9-maker/Startklar`, Branch
> `claude/install-skills-plugins-b3yt6t` (nicht main). Lies zuerst
> `docs/uebergabe-design.md` vollständig (Design-/Redesign-Arbeit + bereits
> erfolgter Merge der Story-Welt), dann bei Bedarf `docs/uebergabe.md`,
> `docs/konzept-r7-strategie.md`, `docs/konzept-r8-himmel-papierflieger.md`.
> Der Branch enthält beide Welten (klassisch + „Über dem Nebel"), umschaltbar im
> Profil. `npm install` (three/r3f kamen dazu), dann `npm run build`/`npm test`
> müssen grün sein. Ton: Deutsch, per du – ehrliche Kritik vor Zustimmung.
> Stimm die nächste Richtung mit mir ab (siehe Abschnitt 5).
