# Startklar – Konzept Runde 8: „Himmel & Papierflieger" (umgesetzt als vertikale Scheibe)

**Thema:** Spielartige Oberfläche – Maskottchen-Abenteuer im Papierflieger durch einen weiten Himmel, additiv über der bestehenden App.
**Status:** Erste vertikale Scheibe umgesetzt (Skill-Gebiet „Erste Wohnung") · **Stand:** Juli 2026

Grundlage: r7 (schlanke Consumer-App, Spielgefühl, Pro-Version statt Provision,
Brief-Entschlüsseler als Kern). Diese Runde macht das Spielgefühl real – als
*additive, jederzeit abschaltbare* Ebene, nicht als Abriss.

## 1. Welt & Figur

- **Vibe:** Freiheit, Aufbruch, Fliegen. Warmer Himmel (Tag) bis Sternennacht
  (folgt dem bestehenden Hell/Dunkel-Schalter), Wolken, schwebende Inseln – der
  Papierflieger ist der Held (baut auf dem vorhandenen `PaperPlane`-Motiv auf).
- **Figur:** eine Piloten-Katze im Papierflieger, die von Insel zu Insel zieht.
  Jede real erledigte Aufgabe erschließt eine Insel (leuchtet in der
  Akzentfarbe); der Flieger fliegt weiter.
- **Ausrüstung/Kosmetik:** freischaltbare Sets (Entdecker = Fliegerbrille,
  Meister = Schal; ein „Pro"-Set als Platzhalter). Selbstausdruck, nie
  Fortschrittsvorteil. Der freie Farb-Picker aus r6 bleibt gratis.

## 2. Core Loop (umgesetzt)

Himmelskarte (`/himmel`, neue Startseite für Profile) → Insel/Quest antippen →
**Einordnung** (was, wie lange, „kein Notfall") → Schritte / Bedarfscheck →
**Erledigen = Insel erschlossen** (Feier-Feedback, Flugmeilen, ggf.
Freischaltung) → Flieger zieht weiter. Sammlung (`/sammlung`) hält Flugbuch-
Meilensteine und Steckbrief-Artefakte – nie verfallend, exportierbar.

**Brief-Entschlüsseler / Angst-Moment** (`/post`): „Ich hab Post und versteh
sie nicht" → kuratierte Briefart wählen → ruhige Einordnung im stillen
Morgenhimmel-Register (kein Spiel, blasser Dämmer-Verlauf) → Brücke in die
passende Quest.

## 3. Meisterschaft & Ethik

- Level je Quest: L1 „Verstanden" (Aufgabe geöffnet / Check ausgefüllt),
  L2 „Gemacht" (real erledigt). XP je Gebiet, Insel-/Ausrüstungs-Freischaltung
  deterministisch und vorher sichtbar.
- **Anti-Dark-Pattern (r7 Kap. 2.5) eingehalten:** keine Streaks, kein
  Verlust – XP und Freischaltungen sinken nie (durch Unit-Tests abgesichert),
  Rücknahme einer Erledigung senkt nur die Meisterschaft, nimmt nichts weg.
  Belohnt wird Meisterschaft, nicht bloßes Abhaken.

## 4. Architektur (additiv, reversibel)

- **Spiel-Schicht neben den Inhalten:** `src/lib/spiel.ts` (reiner, getesteter
  Reducer), `src/hooks/useSpiel.ts`, Store `spiel` in `src/lib/stores.ts` (im
  Datenexport enthalten). Content-Typen (`Task`/`Journey`) bleiben unverändert.
- **Ein Einhak-Punkt:** die Erledigung wird zentral in
  `schreibeErledigt()` (`src/hooks/useProgress.ts`) an die Spiel-Schicht
  gemeldet – fängt UI *und* Klaro automatisch.
- **Welt-Theming:** dritte Achse `data-welt='himmel'` in `src/index.css`
  (nur Spiel-Oberfläche), Pre-Paint in `index.html` erweitert.
- **Reversibilität:** Umschalter „Startseite: Spiel / Klassisch" in den
  Einstellungen; alle bestehenden Seiten/Routen bleiben erreichbar; nichts
  gelöscht.

## 5. Nicht in der Scheibe (r9+)
Zahlungsanbindung, KI-Brieferkennung, die anderen 3 Journeys, Level 3,
Avatar-Editor, gesponserter Zugang (nur neutral vorbereitet). Nächster Schritt:
Experiment E1 „Brief-Test" (r7 Kap. 6.2) und Ausweitung auf ein zweites Gebiet.
