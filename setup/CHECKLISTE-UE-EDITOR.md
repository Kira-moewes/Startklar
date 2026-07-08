# Manuelle Checkliste — Schritte, die nur im UE-Editor gehen

Diese Schritte kann kein Skript übernehmen. Reihenfolge einhalten.
Voraussetzung: Das Setup-Skript (`ue5-claude-setup.sh` / `.ps1`) ist
durchgelaufen und der UE-Editor mit deinem Projekt startet.

## 1. UnrealClaude-Plugin installieren (Git-URL)

- [ ] UE-Editor öffnen → **Edit → Plugins** bzw. den Package/Plugin-Manager
      deiner UE-Version.
- [ ] Plugin über die Git-URL des UnrealClaude-Projekts hinzufügen
      (alternativ: Repo klonen und den Plugin-Ordner nach
      `<UE-Projekt>/Plugins/` kopieren, dann Editor neu starten —
      das funktioniert in jeder UE-Version).

## 2. VibeUE-Plugin — ÜBERSPRUNGEN

Auf deinen Wunsch weggelassen (kein Key vorhanden). Zum Nachrüsten:
Plugin von vibeue.com installieren und den Key in den Plugin-Einstellungen
eintragen.

## 3. Plugins in UE aktivieren

- [ ] **Edit → Plugins** → nach „ModelContextProtocol" suchen → Haken setzen.
- [ ] Ebenso „AllToolsets" aktivieren.
- [ ] Editor-Neustart bestätigen, wenn UE danach fragt.

## 4. MCP-Server im Editor starten

- [ ] UE-Konsole öffnen (Taste **^/`** oder **Window → Developer Tools →
      Output Log**, unten die Cmd-Zeile).
- [ ] Eingeben: `ModelContextProtocol.StartServer`
- [ ] Die ausgegebene Adresse/Port notieren und mit dem Eintrag `unreal`
      in `<UE-Projekt>/.mcp.json` abgleichen (Standard im Kit:
      `http://127.0.0.1:32123/sse` — bei Abweichung anpassen).

## 5. Neustart & Verbindungstest

- [ ] UE-Editor **und** Claude Code neu starten (Claude Code im
      UE-Projektordner öffnen, damit `.mcp.json` geladen wird).
- [ ] In Claude Code: `/mcp` — alle Server müssen „connected" zeigen.
- [ ] Smoke-Test UE: „Liste alle Blueprints in Content/Characters und ihre
      Parent-Klasse."
- [ ] Smoke-Test Meshy (credit-schonend): „Erzeuge mit Meshy einen
      Text-to-3D-**Preview**-Job (kein Refine): niedrig aufgelöster
      Felsbrocken, stilisiert. Gib nur die Task-ID zurück."

## 6. Blender-Seite (einmalig)

- [ ] Blender starten → **Edit → Preferences → Add-ons** → das
      BlenderMCP-Addon installieren/aktivieren (Anleitung:
      github.com/ahujasid/blender-mcp).
- [ ] Im Blender-Sidebar-Panel (N-Taste) **„Connect to MCP server"** klicken,
      bevor du Blender-Aufgaben an Claude gibst.

## Optional (später nachrüstbar)

- **Rodin/Hyper3D-MCP:** Key von hyper3d.ai besorgen, dann
  `claude mcp add --scope user rodin -e RODIN_API_KEY=<key> -- <server-kommando>`
  (den aktuellen Server-Namen vorher via Context7/Doku prüfen).
