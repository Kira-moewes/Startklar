# Iglu-Scroll-Animation (`/iglu`)

Eigenständige Nachbildung des Scroll-Erlebnisses von [igloo.inc](https://www.igloo.inc/)
(Original von Abeto/Bureaux) — komplett eigener Code auf Three.js-Basis, keine
übernommenen Assets oder Shader.

## Was passiert

1. **Aufbau (Scroll 0–50 %):** Ein Iglu aus ~400 Eis-Steinen (`InstancedMesh`)
   setzt sich Reihe für Reihe von unten nach oben zusammen. Jeder Stein fliegt
   aus einer zufälligen Streuposition an seinen Platz (Position-Lerp +
   Quaternion-Slerp + Scale-Pop, gestaffelt pro Reihe).
2. **Umrundung (50–66 %):** Die Kamera umkreist das fertige Iglu.
3. **Einflug (66–100 %):** Die Kamera fährt frontal durch den Eingangstunnel
   ins Innere; dort blendet ein leuchtender Eiskern (Icosaeder + PointLight) auf.

Dazu: Schnee-Partikel (`THREE.Points`), Nebel, weicher Kontaktschatten
(Canvas-Radialgradient), Maus-Parallaxe auf das Blickziel und Text-Overlays,
die am Scrollfortschritt hängen.

## Dateien

| Datei | Aufgabe |
| --- | --- |
| `src/components/igloo/IglooScene.tsx` | Gesamte Three.js-Logik (Szene, Steine, Kamera, Schnee) |
| `src/pages/Igloo.tsx` | Seite: Scrollweg (600vh), Overlay-Sektionen, Ecken-UI |
| `src/pages/Igloo.css` | Eis-Optik, Typografie, Scroll-Hinweis |
| `src/App.tsx` | Route `/iglu`, lazy geladen (Three.js landet in eigenem Chunk) |

## Stellschrauben (oben in `IglooScene.tsx`)

- `DOME_RADIUS`, `DOME_ROWS`, `BRICK_W/D` — Größe und Auflösung des Iglus
- `ASSEMBLY_END` — wie viel Scrollweg der Aufbau belegt
- `CAM_PATH` — Keyframes der Kamerafahrt (`s` = Scrollfortschritt 0–1,
  `r/th/h` = Position in Zylinderkoordinaten, `ty/tz` = Blickziel).
  Wichtig: Ab dem Einflug muss `th` auf `DOOR_THETA` bleiben, sonst
  verlässt die Kamera die Tunnelachse.
- Texte/Zeitpunkte der Overlays: `SECTIONS` in `Igloo.tsx`

## Verhalten

- **Reduzierte Bewegung** (`prefers-reduced-motion` oder App-Einstellung
  `data-motion="reduziert"`): Iglu steht sofort fertig, kein Schneetreiben,
  keine Parallaxe — die Kamera folgt weiterhin dem Scroll.
- Der deterministische Zufall (`mulberry32`) sorgt dafür, dass das Iglu bei
  jedem Laden identisch aussieht.
- Aufräumlogik im `useEffect`-Cleanup: Renderer, Geometrien und Materialien
  werden beim Verlassen der Seite freigegeben.
