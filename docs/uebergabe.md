# Übergabe / Handoff – Startklar (Stand: r8, Spiel-Ebene + 3D)

**Zweck dieses Dokuments:** Alles Nötige, um in einem neuen Chat *genau hier*
weiterzumachen – ohne den bisherigen Gesprächsverlauf. Lies zusätzlich für das
„Warum": `docs/konzept-r7-strategie.md` und `docs/konzept-r8-himmel-papierflieger.md`.

- **Repo:** `62nghwy7c9-maker/Startklar`
- **Arbeits-Branch:** `claude/startklar-app-strategy-cq0dd4` (NICHT `main`)
- **Offener PR:** #6 (nur für die Vercel-Vorschau, **nicht mergen** ohne Ansage)
- **Stack:** React 19, Vite 8, Tailwind 4 (CSS-first), react-router 7, localforage,
  vite-plugin-pwa, Three.js + @react-three/fiber. Tests: Vitest. Linter: oxlint.
- **Ton der Zusammenarbeit:** Deutsch, per du, wie unter Mitgründern. Ehrliche
  Kritik vor Zustimmung, Annahmen sichtbar machen, Risiken zuerst.

---

## 1. Vision in einem Absatz

startklar ist eine **schlanke Consumer-App**, die jungen Leuten (16–21) das
Erwachsenwerden erleichtert: echte Behörden-/Geld-/Wohn-To-dos, spielartig
verpackt, damit sie Angst und Überforderung in sichtbare Selbstwirksamkeit
verwandeln. Kern-Diagnose (r7): Adulting nervt nicht, weil es *langweilig* ist,
sondern weil es **bedrohlich und mehrdeutig** ist. Deshalb ist die Gamification
Angstreduktions- und Kompetenz-Architektur, kein Belohnungs-Zuckerguss.

## 2. Getroffene Entscheidungen (verbindlich, mit Begründung)

- **Schlanke Consumer-App**, kein B2G-Vertriebsprojekt. B2G/Förderung ist
  „später möglich", nicht Kernmodell (Kap. 0 in r7).
- **Monetarisierung: Pro-Version (Kosmetik/Komfort), KEIN Affiliate, keine
  Werbung.** Grund: dünne Ökonomie bei klammer Zielgruppe + Incentive-Korruption
  + Minderjährigenschutz. Neutralität des Anbieter-Vergleichs bleibt so intakt.
  „Gesponserter Zugang" (Stiftung/Kasse) als warm gehaltene Option.
- **Welt/Marke: „Über dem Nebel" – Freiheit / Papierflieger / Pilot.** Warmer
  Himmel bis Sternennacht, schwebende Inseln = Lebens-Gebiete, Nebel = das
  Ungewisse, das sich lichtet. (Nicht „Stadt bei Nacht" – verworfen.)
- **Zwei Charaktere:** Fiete (Papierflieger-Kater, Co-Pilot, führt durchs Tun) +
  Klaro (Lotse/Eule mit Headset, erklärt & hilft im Brief-/Angst-Moment).
- **Additiv & reversibel** ist oberste Nebenbedingung: nichts Bestehendes wird
  gelöscht, Umschalter „Startseite: Spiel/Klassisch" im Profil, alles auf dem
  Branch. Kira war anfangs unsicher – Rückbaubarkeit ist heilig.
- **Persona:** 16–21 breit + **Care-Leaver-Stresstest** für jedes Feature
  (funktioniert es ohne Eltern-Backup, mit wenig Geld, auf schwachem Handy?).
- **Anti-Dark-Pattern (hart):** keine Streaks/Verlust-Mechanik (XP & Freischal-
  tungen sinken NIE – per Unit-Test abgesichert), kein FOMO, keine Zufalls-
  belohnung, keine Leaderboards. Belohnt wird Meisterschaft, nicht bloßes Abhaken.
- **3D:** Echtzeit low-poly im Browser (R3F) – **jetzt** umgesetzt. Vollwertige
  3D-**Figuren** (Fiete mit Mimik) brauchen modellierte Assets (Blender/Markt-
  platz) → „später mit Assets". Rive/Lottie-Studio-Rigs ebenfalls „später".

## 3. Umgesetzter Stand (was läuft)

Spiel-Ebene „Über dem Nebel", komplett additiv, für das Skill-Gebiet
**„Erste Wohnung"** (6 Quests) als erste vertikale Scheibe:

- **Himmelskarte** `/himmel` (neue Startseite für Profile): 3D-Flugwelt oben,
  darunter Insel-Liste (Quests), Flugmeilen, Meisterschaftsbalken.
- **3D-Flugwelt** (Three.js/R3F): low-poly Papierflieger auf Kurvenbahn,
  schwebende Inseln, driftende Wolken, Theme-Farben. Lazy geladen, 2D-Fallback,
  Schalter im Profil, aus dem PWA-Precache ausgenommen.
- **Brief-Entschlüsseler** `/post`: kuratierte Briefarten (Anmeldung, Rundfunk-
  beitrag, Nebenkosten, Mietvertrag, Strom), ruhiges „Morgenhimmel"-Register.
- **Intro-Film** `/intro`: animierter Prolog (Heiminsel überm Nebel, Fiete
  landet, Klaro auf Funk). Skippbar, reduced-motion, wiederholbar (Profil).
- **Geführte Tour**: Fiete/Klaro erklären beim ersten Himmel-Besuch die App.
- **Sammlung** `/sammlung`: Flugbuch (Meilensteine) + Steckbrief-Artefakte.
- **Meisterschaft/XP** + freischaltbare Piloten-Ausrüstung (Kosmetik = Pro-Hebel).

## 4. Architektur – die tragenden Stellen (hier andocken)

- **Ein Choke-Point für „erledigt":** `schreibeErledigt()` in
  `src/hooks/useProgress.ts` – fängt UI *und* Klaro; feuert das Spiel-Ereignis.
- **Spiel-Logik (rein, getestet):** `src/lib/spiel.ts` (Reducer `applyEreignis`),
  Hook `src/hooks/useSpiel.ts`, Store `spiel` in `src/lib/stores.ts`
  (im Datenexport `src/lib/datenExport.ts` enthalten). Tests: `src/lib/spiel.test.ts`.
- **Charaktere = EIN austauschbarer Baustein:** `src/components/spiel/Charakter.tsx`
  (Fiete, Klaro, Sprechblase, Avatar). Hier später Rive/3D-Modelle einsetzen –
  Aufrufer (Intro, Tour, Feier) bleiben unverändert.
- **3D:** `src/components/spiel/FlugWelt3D.tsx` (Szene) +
  `src/components/spiel/FlugWeltHero.tsx` (Lazy-Wrapper + Fallback-Entscheidung).
- **Story-Skript (editierbar):** `src/data/story.ts` (Intro-Beats + Tour).
  Briefarten: `src/data/briefe.ts`.
- **Welt-Theming:** Achse `data-welt='himmel'` in `src/index.css` (nur Spiel-
  Oberfläche), gesetzt in `src/hooks/useSettings.tsx` + Pre-Paint in `index.html`.
  Einstellungen tragen: `welt`, `startseite`, `ausruestung`, `introGesehen`,
  `tourGesehen`, `effekte3d`.
- **Routing:** `src/App.tsx` (`StartRoute` wählt Spiel vs. klassische Home);
  Seiten `src/pages/Himmel.tsx`, `Post.tsx`, `Sammlung.tsx`, `Intro.tsx`.
- **Inhalts-Typen unverändert** (`src/data/types.ts`, `journeys/`, `bedarf/`) –
  die Spiel-Schicht liegt daneben, nicht drin.

## 5. Starten / Testen / Deployen

```bash
npm install
npm run dev      # Dev-Server
npm run build    # tsc -b + vite build (muss grün sein)
npm run lint     # oxlint (nur Warnungen ok)
npm test         # vitest run (aktuell 9 Tests grün)
```

- **Vorschau am Handy:** PR #6 erzeugt eine Vercel-Preview (stabile Branch-URL,
  aktualisiert sich bei jedem Push). Frische Adresse = kein lokales Profil →
  entweder `/himmel` direkt öffnen oder Onboarding/Intro durchlaufen.
- **Deploy:** Push auf den Branch = neue Preview. Live-Seite (`main`) bleibt
  unberührt, bis bewusst gemergt wird.
- **E2E-Check (optional):** temporär `npm i -D playwright-core`, Chromium unter
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, für WebGL headless die
  Flags `--use-angle=swiftshader --enable-unsafe-swiftshader`. Danach wieder
  deinstallieren (Repo sauber halten).

## 6. Offene nächste Schritte (mit Kira abstimmen, nicht einfach loslegen)

1. **3D vertiefen:** Intro-Film als räumliche Kamerafahrt, oder Himmelskarte im
   Raum navigierbar (Inseln im 3D antippbar).
2. **Fiete als echtes 3D-Modell** (GLTF aus Blender/Marktplatz) in die Szene.
3. **Kapitel 1 „Erste Wohnung"** mit Story-Beats + „Nebel, der sich lichtet"
   fertig ausbauen (Belohnungs-Beats je erschlossener Insel).
4. **Experiment E1 „Brief-Test"** (r7 Kap. 6.2): billigster Realitätstest, ob die
   Zielgruppe im Angst-Moment kommt.

## 7. Parallele Chats / Branch-Koordination

Chats lassen sich nicht als Gespräch zusammenführen – nur ihre Arbeit über Git.
**Wenn ein zweiter Chat parallel am Repo arbeitet:** unbedingt auf einem
*eigenen* Branch, sonst überschreiben sich die Pushes auf
`claude/startklar-app-strategy-cq0dd4`. Zusammenführen am Ende per Merge/PR.
Vor dem Weiterarbeiten immer `git fetch` + `git log origin/<branch>` prüfen,
ob jemand anderes gepusht hat.

---

## 8. Kurz-Prompt zum Einfügen in den neuen Chat

> Arbeite am Repo `62nghwy7c9-maker/Startklar`, Branch
> `claude/startklar-app-strategy-cq0dd4` (nicht main). Lies zuerst
> `docs/uebergabe.md` vollständig, dann `docs/konzept-r7-strategie.md` und
> `docs/konzept-r8-himmel-papierflieger.md`. Danach machen wir genau dort weiter.
> Ton: Deutsch, per du, wie unter Mitgründern – ehrliche Kritik vor Zustimmung.
> Bevor du baust, stimm die nächste Richtung mit mir ab (siehe Abschnitt 6).
