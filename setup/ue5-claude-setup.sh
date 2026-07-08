#!/usr/bin/env bash
# Claude-Code-Stack für UE5 — Setup (macOS / Linux)
# Aufruf: ./ue5-claude-setup.sh /pfad/zum/UE-Projekt
# Jeder Installationsbefehl wird vor der Ausführung angezeigt und bestätigt.
# Keys werden unsichtbar abgefragt und erscheinen in keinem Log.
set -euo pipefail

UE_PROJECT="${1:-}"
FAIL=0

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  ✅ %s\n' "$*"; }
warn() { printf '  ⏳ %s\n' "$*"; }
err()  { printf '  ❌ %s\n' "$*"; FAIL=1; }

confirm_run() {
  # Zeigt den Befehl, fragt nach, führt aus.
  echo
  echo "  Auszuführender Befehl:"
  echo "    $*"
  read -r -p "  Ausführen? [j/N] " a
  case "$a" in j|J|y|Y) eval "$@";; *) warn "Übersprungen: $*"; return 1;; esac
}

pkg_install() {
  # $1 = Paketname (brew), $2 = Paketname (apt)
  if command -v brew >/dev/null 2>&1; then
    confirm_run "brew install $1"
  elif command -v apt-get >/dev/null 2>&1; then
    confirm_run "sudo apt-get update && sudo apt-get install -y $2"
  else
    err "Kein unterstützter Paketmanager (brew/apt) gefunden — bitte $1 manuell installieren."
    return 1
  fi
}

ver_ge() { [ "$(printf '%s\n%s' "$2" "$1" | sort -V | head -1)" = "$2" ]; }

bold "=== PHASE 1: Voraussetzungen ==="

# Node.js >= 18
if command -v node >/dev/null 2>&1; then
  NODE_V="$(node --version | tr -d v)"
  if ver_ge "$NODE_V" 18.0.0; then ok "Node.js $NODE_V"; else
    warn "Node.js $NODE_V < 18 — Update nötig"; pkg_install node nodejs || true
  fi
else
  warn "Node.js fehlt"; pkg_install node nodejs || true
fi
command -v npm >/dev/null 2>&1 && ok "npm $(npm --version)" || err "npm fehlt (kommt normalerweise mit Node.js)"

# Python >= 3.11
if command -v python3 >/dev/null 2>&1; then
  PY_V="$(python3 -c 'import sys;print(".".join(map(str,sys.version_info[:3])))')"
  if ver_ge "$PY_V" 3.11.0; then ok "Python $PY_V"; else
    warn "Python $PY_V < 3.11 — Update empfohlen"; pkg_install python@3.12 python3.12 || true
  fi
else
  warn "Python fehlt"; pkg_install python@3.12 python3 || true
fi

# uv / uvx
if command -v uvx >/dev/null 2>&1; then ok "uv $(uv --version | awk '{print $2}')"; else
  warn "uv/uvx fehlt"
  confirm_run "curl -LsSf https://astral.sh/uv/install.sh | sh" && export PATH="$HOME/.local/bin:$PATH" || true
fi

# git
command -v git >/dev/null 2>&1 && ok "git $(git --version | awk '{print $3}')" || { warn "git fehlt"; pkg_install git git || true; }

# Claude Code CLI
if command -v claude >/dev/null 2>&1; then ok "Claude Code $(claude --version 2>/dev/null | head -1)"; else
  warn "Claude-Code-CLI fehlt"
  confirm_run "npm install -g @anthropic-ai/claude-code" || true
fi
command -v claude >/dev/null 2>&1 || { err "Ohne Claude-CLI geht es nicht weiter."; exit 1; }

# Blender (Desktop-App, für blender-mcp nötig)
if command -v blender >/dev/null 2>&1 || [ -d "/Applications/Blender.app" ]; then
  ok "Blender gefunden"
else
  warn "Blender nicht gefunden — bitte von https://www.blender.org/download/ installieren (blender-mcp braucht die laufende App mit aktiviertem Addon)."
fi

bold ""
bold "=== PHASE 2: MCP-Server registrieren (User-Scope) ==="

# Meshy — Key unsichtbar abfragen, nie loggen
if claude mcp list 2>/dev/null | grep -q '^meshy'; then
  ok "meshy bereits registriert — übersprungen"
else
  read -r -s -p "  MESHY_API_KEY (Eingabe unsichtbar; meshy.ai → Settings → API Keys): " MESHY_API_KEY; echo
  if [ -z "$MESHY_API_KEY" ]; then
    err "Kein MESHY_API_KEY eingegeben — Meshy übersprungen."
  else
    echo "  Befehl: claude mcp add --scope user meshy -e MESHY_API_KEY=*** -- npx -y @meshy-ai/meshy-mcp-server"
    claude mcp add --scope user meshy -e "MESHY_API_KEY=$MESHY_API_KEY" -- npx -y @meshy-ai/meshy-mcp-server \
      && ok "meshy registriert" || err "meshy: Registrierung fehlgeschlagen"
  fi
  unset MESHY_API_KEY
fi

# Blender-MCP
if claude mcp list 2>/dev/null | grep -q '^blender'; then
  ok "blender bereits registriert — übersprungen"
else
  confirm_run "claude mcp add --scope user blender -- uvx blender-mcp" \
    && ok "blender registriert" || err "blender: Registrierung fehlgeschlagen/übersprungen"
fi

# Context7
if claude mcp list 2>/dev/null | grep -q '^context7'; then
  ok "context7 bereits registriert — übersprungen"
else
  confirm_run "claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp" \
    && ok "context7 registriert" || err "context7: Registrierung fehlgeschlagen/übersprungen"
fi

warn "Rodin/Hyper3D-MCP: auf Wunsch weggelassen (kein Key). Nachrüsten: claude mcp add --scope user rodin -e RODIN_API_KEY=... -- <server>"

bold ""
bold "=== PHASE 3: UE-Projekt konfigurieren ==="

if [ -z "$UE_PROJECT" ]; then
  err "Kein UE-Projektpfad übergeben. Aufruf: $0 /pfad/zum/UE-Projekt — Phase 3 übersprungen."
elif [ ! -d "$UE_PROJECT" ]; then
  err "Pfad existiert nicht: $UE_PROJECT — Phase 3 übersprungen."
else
  # .mcp.json und .claude/settings.json mergen, nie überschreiben.
  SETUP_DIR="$(cd "$(dirname "$0")" && pwd)"
  python3 "$SETUP_DIR/merge_config.py" "$UE_PROJECT" && ok "Projekt-Konfiguration gemerged" || err "Config-Merge fehlgeschlagen"
  echo
  echo "  Danach in Claude Code (im UE-Projektordner gestartet) ausführen:"
  echo "    /plugin marketplace add EpicGames/unreal-engine-skills-for-claude-code-plugin"
  echo "    /plugin install unreal-engine-skills@unreal-engine-skills-for-claude-code-plugin"
  echo "  (Falls 'marketplace add' fehlschlägt: Repo-Namen auf github.com/EpicGames prüfen.)"
fi

bold ""
bold "=== PHASE 4: Verifikation ==="
echo "  Registrierte MCP-Server (Live-Status):"
claude mcp list || true
echo
echo "  Smoke-Tests (in Claude Code eintippen):"
echo "   UE:    'Liste alle Blueprints in Content/Characters und ihre Parent-Klasse.'"
echo "          (setzt voraus: UE-Editor läuft, ModelContextProtocol.StartServer wurde ausgeführt)"
echo "   Meshy: 'Erzeuge mit Meshy einen Text-to-3D-PREVIEW-Job (kein Refine, keine Credits):"
echo "          niedrig aufgelöster Felsbrocken, stilisiert. Gib nur die Task-ID zurück.'"
echo
echo "  Manuelle Schritte im UE-Editor: siehe CHECKLISTE-UE-EDITOR.md"
[ "$FAIL" -eq 0 ] && bold "Fertig ohne Fehler ✅" || bold "Fertig mit Fehlern — siehe ❌ oben"
