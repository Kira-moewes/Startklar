# Claude-Code-Stack für Unreal Engine 5 — Setup-Kit

Dieses Kit installiert und verifiziert den kompletten Claude-Code-Stack für
Game-Dev mit UE5 (realistische Umgebungen + Charaktere): Meshy-MCP,
Blender-MCP, Context7-MCP sowie die Vorbereitung der Unreal-Plugins.

## ⚠️ Wichtige Voraussetzung: ein richtiger Rechner

**Unreal Engine 5 läuft nicht auf dem iPad.** Der UE5-Editor benötigt
Windows, macOS oder Linux (empfohlen: 32 GB RAM, dedizierte GPU). Auch die
Claude-Code-CLI und die MCP-Server laufen lokal auf diesem Rechner.
Vom iPad aus kannst du Claude Code nur als Fernsteuerung (Web/App) nutzen —
das eigentliche Setup muss auf dem Rechner passieren, auf dem UE installiert
ist.

Sobald du an dem Rechner sitzt:

## Verwendung

### macOS / Linux

```bash
git clone <dieses-repo> && cd Startklar/setup
chmod +x ue5-claude-setup.sh
./ue5-claude-setup.sh /pfad/zu/deinem/UE-Projekt
```

### Windows (PowerShell)

```powershell
git clone <dieses-repo>; cd Startklar\setup
powershell -ExecutionPolicy Bypass -File .\ue5-claude-setup.ps1 C:\Pfad\zu\deinem\UE-Projekt
```

Das Skript arbeitet in vier Phasen und **zeigt jeden Installationsbefehl vor
der Ausführung an**:

1. **Voraussetzungen** — prüft Node.js ≥ 18, npm, Python ≥ 3.11, uv/uvx,
   git, Claude-Code-CLI; installiert Fehlendes via brew/apt/winget nach
   Rückfrage.
2. **MCP-Server** — registriert Meshy, Blender-MCP und Context7 im
   User-Scope. Der `MESHY_API_KEY` wird **lokal und unsichtbar abgefragt**
   (nie im Chat, nie in Logs, nie im Repo). Key holen:
   [meshy.ai/dashboard](https://www.meshy.ai) → Settings → API Keys.
3. **Projekt-Konfiguration** — merged `.mcp.json` und
   `.claude/settings.json` in dein UE-Projekt, ohne bestehende Einträge zu
   überschreiben.
4. **Verifikation** — `claude mcp list` mit Live-Status und
   Smoke-Test-Vorschläge.

Danach: [`CHECKLISTE-UE-EDITOR.md`](CHECKLISTE-UE-EDITOR.md) abarbeiten —
die Schritte, die nur im UE-Editor selbst möglich sind.

## Hinweise

- **Korrigierte CLI-Syntax:** Bei `claude mcp add` müssen `-e KEY=VALUE`-
  Flags **vor** dem `--` stehen (alles nach `--` geht als Argument an den
  Server-Prozess). Die Skripte machen das richtig.
- **Rodin/Hyper3D und VibeUE** wurden auf Wunsch weggelassen. Nachrüsten
  jederzeit möglich (siehe Abschnitt „Optional" in der Checkliste).
- **Epic-Plugin-Marketplace:** Die Existenz von
  `EpicGames/unreal-engine-skills-for-claude-code-plugin` konnte aus der
  Cloud-Sandbox nicht verifiziert werden (Netzwerk-Proxy). Falls der
  `/plugin marketplace add`-Befehl lokal fehlschlägt, den exakten Repo-Namen
  auf github.com/EpicGames prüfen.
- Blender selbst (Desktop-App) muss von [blender.org](https://www.blender.org/download/)
  installiert sein; das Skript prüft das und gibt sonst den Download-Link aus.
  Zusätzlich muss in Blender das BlenderMCP-Addon aktiviert werden
  (siehe Checkliste).
