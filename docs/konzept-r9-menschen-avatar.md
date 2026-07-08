# Konzept r9 — Menschliche Figuren & eigener Avatar in der Flug-Welt „Über dem Nebel"

> **Zweck dieses Dokuments:** Handoff für einen *anderen* Chat, in dem die
> Storyline weitergeplant und umgesetzt wird. Es fasst die kreative Richtung
> **und** alles technisch Nötige zusammen, ohne den bisherigen Gesprächsverlauf.
> Lies zum „Warum" zusätzlich `docs/konzept-r7-strategie.md`,
> `docs/konzept-r8-himmel-papierflieger.md`, `docs/uebergabe-design.md`.
>
> **Update (verbindlich):** Kira hat **Weg A** gewählt — realistische **3D**-Figuren
> + begehbare **3D-Welt in-app via react-three-fiber**, die animierten Inseln an
> `/himmel` werden dadurch ersetzt. Die 2D-SVG-Empfehlungen weiter unten sind durch
> den 3D-Ansatz überholt; maßgeblich sind `CLAUDE.md` und der aktuelle Umsetzungsplan.

---

## Kontext (warum diese Änderung)

Startklar hilft jungen Erwachsenen — besonders Care-Leavern und Menschen **ohne
Familien-Backup** — beim „Erwachsen werden" (Behörden, Geld, Wohnung). Leitplanken
aus r7: **Selbstwirksamkeit**, schamfrei, ruhig, **keine Dark Patterns**. r8 hat
eine **optionale, umschaltbare Spiel-Ebene** ergänzt (Profil: „Spiel/Klassisch"):
die Welt **„Über dem Nebel"** — man fliegt über einer Nebeldecke (= Überforderung)
von Insel zu Insel (= Lebensbereiche) und gewinnt so **Überblick**. Bisherige
Figuren waren **Tier-Maskottchen**: Fiete (Papierflieger-Kater, das Fluggerät) und
Klaro (Eule, die warme Begleiter-Stimme).

**Die Neuausrichtung (von Kira entschieden):** weg vom Tier-Maskottchen als
Hauptfigur, hin zu **menschlichen Hauptfiguren** mit einem **selbst gestalteten
Avatar**. Grund: Für diese Zielgruppe (Identitätsaufbau, oft marginalisiert) ist
eine *kompetente Figur, die aussieht wie ich und die ich selbst gestaltet habe*,
ein direkteres Selbstwirksamkeits-Signal als ein Maskottchen — plus echte
**Repräsentation** (Hautton, Haare, Kopftuch, Rollstuhl, Stil). Gewünschtes
Ergebnis: dieselbe hilfreiche App, aber die Spiel-Ebene erzählt sie **mit** und
**durch** die Nutzerin als menschliche Heldin ihrer eigenen Geschichte.

---

## Bestätigte Entscheidungen (Kira)

1. **„Designer-Charakter" = selbst gestalteter Avatar** (Charakter-Editor; die
   Nutzerin designt ihre eigene Hauptfigur).
2. **Welt-Metapher bleibt Himmel/Flug** — die bestehende 3D-Flugwelt wird
   *weiterverwendet*, nur mit **menschlicher Pilotin** statt Papierflieger als
   Held. (Kein Wegwerfen der Three.js-Arbeit.)
3. **Fiete & Klaro bleiben als kleine Begleiter** — nicht mehr Hauptfiguren, aber
   als Charme + Kontinuität. Klaro behält seine warme „Ich glaube an dich"-Stimme
   an der Seite des menschlichen Avatars; Fiete wird zum Fluggerät/Begleiter.
4. **Avatar = modularer Editor** als Ziel (Hautton / Haare / Outfit / Accessoire
   aus Layer-Bausteinen). Darf in Version 1 klein starten.

---

## Storyline / Narrativ

**Rahmen:** Du steigst über die Nebeldecke auf — anfangs etwas verloren. Klaro
(Begleiter) empfängt dich: *„Hier kommt niemand fertig an."* Als Erstes
**gestaltest du, wer du bist** (Avatar-Erstellung, ersetzt/bereichert das bisherige
Onboarding). Dann setzt du Kurs auf die erste Insel.

**Bogen:** Jede Insel = ein echter Lebensbereich (Wohnung, Geld, Behörden …). Du
„erkundest" sie, indem du **echte Aufgaben** erledigst. Jede erledigte Aufgabe
**lichtet den Nebel** und lässt Teile der Insel/Karte auftauchen → sichtbar mehr
Überblick → „Ich hab's in der Hand". **Kein Gewinnen**, sondern *Überblick
gewinnen*. Der **Brief-Entschlüsseler** (heute `/post`) wird erzählerisch zum
**Leuchtturm** jeder Insel — das Ding, das die bedrohliche Post lesbar macht.

**Avatar als Kompetenz-Spiegel:** Die Figur wird mit echtem Fortschritt sichtbar
sicherer/ausgestatteter — aber **nur an echte erledigte Aufgaben gekoppelt**, nie
an Streaks/Schuld (siehe Leitplanken).

---

## Figuren-Cast

- **Du / dein Avatar** — Hauptfigur, modular gestaltet, Pilotin über dem Nebel.
- **Klaro** (Begleiter, bleibt) — die warme, ermutigende Stimme; Co-Pilot/Vogel an
  Bord. Trägt weiterhin Intro- und Tour-Dialoge.
- **Fiete** (bleibt, umgedeutet) — vom Helden zum **Fluggerät/Begleiter** (Nod an
  r8, Papierflieger-Ästhetik).
- **Optionale Insel-Gesichter (Phase 2):** je Insel eine freundliche menschliche
  Figur, die den jeweiligen Bereich entzaubert (gibt Bürokram ein Gesicht; Ton wie
  in `src/data/briefe.ts`).

---

## Kunst-Richtung (wichtig gegen die „Kindlich-Falle")

r7 warnt ausdrücklich davor, die Zielgruppe zu infantilisieren. Menschen-Figuren
müssen die **reife, ruhige Design-Sprache des Redesigns** treffen:

- **Editoriale Flat-Illustration**, nicht „Game-Maskottchen". Ruhig, erwachsen.
- Bestehende Tokens nutzen: Instrument Serif/Sans, `olive`/`pine`/`cream`/`band`
  (siehe `docs/uebergabe-design.md` Abschnitt 2 „Design-System").
- **Repräsentation zuerst:** diverse Hauttöne, Haartypen, Kopftuch, Rollstuhl,
  Brille etc. als gleichwertige Bausteine.
- **Reduced-Motion respektieren** (bestehende `.reveal`/Motion-Tokens).
- Avatar als **gelayerte SVGs** (Basis → Haare → Outfit → Accessoire), damit
  Kombinationen ohne Bild-Assets funktionieren.

---

## Technische Umsetzung (gegen den Bestand)

Die **Insel-/Journey-/Aufgaben-Daten und die Fortschrittslogik bleiben
unverändert** — es ändert sich die **Figuren-Darstellung** und es kommt ein
**Avatar-System** dazu.

**Schritt 0 — Bestand exakt lesen** (zuerst diese Dateien öffnen, um die genauen
Feld-/Typnamen zu bestätigen):
`src/lib/spiel.ts` (Reducer `applyEreignis`, `SpielState`, `FREISCHALTUNGEN`),
`src/hooks/useSpiel.ts`, `src/hooks/useSettings.tsx` (Felder u.a. `welt`,
`startseite`, `ausruestung`, `introGesehen`, `tourGesehen`, `effekte3d`),
`src/data/story.ts` (Intro-Beats + Tour), `src/data/types.ts` + `src/data/journeys/`.

**Neu — Avatar-System:**
- **Datenmodell:** ein `avatar`-Objekt in den Settings (`useSettings.tsx`), z.B.
  `{ hautton, haare, haarfarbe, outfit, accessoire }`. Über den bestehenden
  localforage-Settings-Store persistieren; Default + Migration ergänzen.
- **Rendering:** `src/components/spiel/Avatar.tsx` (NEU) — gelayerte SVG-Figur aus
  der Config. Prop-/Muster analog zu den vorhandenen `Charakter.tsx` / `Flieger.tsx`.
- **Editor:** `src/pages/AvatarEditor.tsx` (NEU) *oder* ein Schritt im bestehenden
  Onboarding/Intro. Modulare Auswahl (Hautton/Haare/Outfit/Accessoire). UI-Bausteine
  wiederverwenden: `PageHead`, Design-Tokens, magnetische Buttons.

**Anpassen — Flug-Welt & Figuren:**
- `src/components/spiel/FlugWelt3D.tsx` (+ `FlugWeltHero.tsx`, `Flieger.tsx`): den
  Helden-Papierflieger so ergänzen/ersetzen, dass der **menschliche Avatar** das
  Fluggerät steuert. **Empfehlung:** Avatar als **2D-SVG/HTML-Overlay**, das am
  Flieger „gepinnt" wird (billiges Rendering, kein 3D-Charakter-Modell nötig);
  Klaro als kleiner Begleiter bleibt in der Szene.
- `src/components/spiel/Charakter.tsx` (Fiete/Klaro): behalten, aber zu Begleitern
  „herabstufen"; Klaro bleibt Dialog-Stimme in Intro/Tour.
- `src/data/story.ts`: Intro-Beats + Tour-Texte auf die **menschliche
  Ankunfts-Erzählung** umschreiben; **Avatar-Erstellungs-Beat** einfügen.
- `src/pages/Intro.tsx` + `src/components/spiel/HimmelsTour.tsx`: Avatar-Erstellung
  einhängen (skippbar, reduced-motion-fest).
- `src/pages/Himmel.tsx`: der Avatar taucht als Spielfigur/Marker auf; Insel-Zustände
  (Nebel lichten) bleiben an den bestehenden Spiel-State gekoppelt.

**State/Settings:**
- Avatar lebt in **Settings**, nicht im Spiel-Reducer (Kosmetik ≠ Fortschritt).
- Optional: kosmetische Freischaltungen (`FREISCHALTUNGEN`/`ausruestung` in
  `spiel.ts`) an **echte erledigte Aufgaben** koppeln — bewusst schlicht.
- `src/App.tsx`: ggf. Route `/avatar`; `StartRoute` (Spiel/Klassisch-Weiche) bleibt
  unangetastet.

**Unverändert:** `src/data/journeys/`, `src/data/types.ts`, `src/data/briefe.ts`
(realer Hilfe-Inhalt), Klassisch-Ansicht.

---

## Anti-Dark-Pattern-Leitplanken (r7 — nicht verhandelbar)

- Spiel-Ebene bleibt **optional & umschaltbar**; sie **blockiert nie** die echte
  Hilfe (Klassisch-Modus immer vollwertig).
- Avatar-Kosmetik nur an **echte** erledigte Aufgaben gekoppelt — **keine**
  Streaks, kein Schuld-Nudging, keine künstliche Verknappung.
- Repräsentation als Grundausstattung, nicht als „Belohnung".
- Reduced-Motion & Kontrast (hell/dunkel) auf allen neuen Flächen prüfen.

---

## Umsetzung in Phasen

- **Phase 0 — Konzept** (dieses Dokument).
- **Phase 1 — MVP:** Avatar-Datenmodell + `Avatar.tsx` (gelayertes SVG) +
  erster modularer Editor (je Kategorie wenige Optionen) + Einhängen in
  Intro/Onboarding + Avatar als 2D-Overlay in der Flug-Welt sichtbar. Bewusst
  kleiner Options-Satz zum schnellen Shippen.
- **Phase 2:** mehr Bausteine, menschliche Insel-Gesichter, an Fortschritt
  gekoppelte Kosmetik, Mentor-Dialoge (Klaro) polieren.
- **Phase 3 (r9+):** reicherer Editor, leichte Animation, mehr Vielfalt.

---

## Verifikation (End-to-End)

- `npm run build`, `npm test`, `npm run lint` müssen grün sein.
- Manuell: `/intro` → Avatar erstellen → Reload → Avatar **bleibt erhalten** →
  erscheint in `/himmel` (Flug-Welt) → Umschalter **Spiel/Klassisch** funktioniert
  weiter → **Reduced-Motion** sauber → hell/dunkel-Kontrast ok.
- Vercel/Netlify-Preview am PR gegenprüfen (mobil ansehen).

---

## Branch-/Chat-Koordination (wichtig)

- **Kanonischer Branch bei Erstellung dieses Konzepts:**
  `claude/install-skills-plugins-b3yt6t` (PR #7) — enthält Design + Story-Welt +
  3D + Brief-Pfad. Die neue Feature-Arbeit **von dessen aktuellem Stand** abzweigen
  (oder von `main`, sobald PR #7 gemergt ist).
- **Regel: nur EIN Chat pro Branch** gleichzeitig pushen (sonst überschreiben sich
  die Stände). Der Umsetzungs-Chat bekommt seinen **eigenen** Branch.

---

## Offene kreative Fragen (im Umsetzungs-Chat mit Kira klären)

- Menschliche **Insel-Gesichter** ja/nein (Phase 2)?
- **Default-Identität** des Avatars beim Start (neutral? erste Vorlage?).
- Wie wörtlich bleibt das **Fluggerät** (Fiete als Papierflieger sichtbar, oder
  abstrakteres Gefährt)?
- Bekommt der Avatar einen **Namen** (Nutzerin-Eingabe) — und taucht er in Texten
  auf?
