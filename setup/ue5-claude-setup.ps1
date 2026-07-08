# Claude-Code-Stack für UE5 — Setup (Windows)
# Aufruf: powershell -ExecutionPolicy Bypass -File .\ue5-claude-setup.ps1 C:\Pfad\zum\UE-Projekt
# Jeder Installationsbefehl wird vor der Ausführung angezeigt und bestätigt.
# Keys werden unsichtbar abgefragt und erscheinen in keinem Log.
param([string]$UEProject = "")

$script:Fail = $false
function OK($m)   { Write-Host "  ✅ $m" }
function Warte($m){ Write-Host "  ⏳ $m" }
function Err($m)  { Write-Host "  ❌ $m"; $script:Fail = $true }

function Confirm-Run($cmd) {
    Write-Host ""
    Write-Host "  Auszuführender Befehl:"
    Write-Host "    $cmd"
    $a = Read-Host "  Ausführen? [j/N]"
    if ($a -match '^[jJyY]$') { Invoke-Expression $cmd; return $true }
    Warte "Übersprungen: $cmd"; return $false
}

Write-Host "=== PHASE 1: Voraussetzungen ===" -ForegroundColor Cyan

# Node.js >= 18
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $v = [version]((node --version).TrimStart('v'))
    if ($v.Major -ge 18) { OK "Node.js $v" }
    else { Warte "Node.js $v < 18"; Confirm-Run "winget install OpenJS.NodeJS.LTS" | Out-Null }
} else { Warte "Node.js fehlt"; Confirm-Run "winget install OpenJS.NodeJS.LTS" | Out-Null }
if (Get-Command npm -ErrorAction SilentlyContinue) { OK "npm $(npm --version)" } else { Err "npm fehlt (kommt mit Node.js; ggf. neues Terminal öffnen)" }

# Python >= 3.11
$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) {
    $pv = (python -c "import sys;print('.'.join(map(str,sys.version_info[:3])))")
    if ([version]$pv -ge [version]"3.11.0") { OK "Python $pv" }
    else { Warte "Python $pv < 3.11"; Confirm-Run "winget install Python.Python.3.12" | Out-Null }
} else { Warte "Python fehlt"; Confirm-Run "winget install Python.Python.3.12" | Out-Null }

# uv / uvx
if (Get-Command uvx -ErrorAction SilentlyContinue) { OK "uv $((uv --version) -replace 'uv ','')" }
else { Warte "uv/uvx fehlt"; Confirm-Run "winget install astral-sh.uv" | Out-Null }

# git
if (Get-Command git -ErrorAction SilentlyContinue) { OK "git $((git --version) -replace 'git version ','')" }
else { Warte "git fehlt"; Confirm-Run "winget install Git.Git" | Out-Null }

# Claude Code CLI
if (Get-Command claude -ErrorAction SilentlyContinue) { OK "Claude Code $(claude --version)" }
else {
    Warte "Claude-Code-CLI fehlt"
    Confirm-Run "npm install -g @anthropic-ai/claude-code" | Out-Null
}
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { Err "Ohne Claude-CLI geht es nicht weiter (neues Terminal öffnen und erneut starten)."; exit 1 }

# Blender
if ((Get-Command blender -ErrorAction SilentlyContinue) -or (Test-Path "$env:ProgramFiles\Blender Foundation")) { OK "Blender gefunden" }
else { Warte "Blender nicht gefunden — Installation: winget install BlenderFoundation.Blender (blender-mcp braucht die laufende App mit aktiviertem Addon)." }

Write-Host ""
Write-Host "=== PHASE 2: MCP-Server registrieren (User-Scope) ===" -ForegroundColor Cyan

$list = (claude mcp list 2>$null) -join "`n"

# Meshy — Key unsichtbar abfragen, nie loggen
if ($list -match '(?m)^meshy') { OK "meshy bereits registriert — übersprungen" }
else {
    $sec = Read-Host "  MESHY_API_KEY (Eingabe unsichtbar; meshy.ai -> Settings -> API Keys)" -AsSecureString
    $key = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    if ([string]::IsNullOrWhiteSpace($key)) { Err "Kein MESHY_API_KEY eingegeben — Meshy übersprungen." }
    else {
        Write-Host "  Befehl: claude mcp add --scope user meshy -e MESHY_API_KEY=*** -- npx -y @meshy-ai/meshy-mcp-server"
        claude mcp add --scope user meshy -e "MESHY_API_KEY=$key" -- npx -y "@meshy-ai/meshy-mcp-server"
        if ($LASTEXITCODE -eq 0) { OK "meshy registriert" } else { Err "meshy: Registrierung fehlgeschlagen" }
    }
    $key = $null
}

# Blender-MCP
if ($list -match '(?m)^blender') { OK "blender bereits registriert — übersprungen" }
elseif (Confirm-Run "claude mcp add --scope user blender -- uvx blender-mcp") { OK "blender registriert" }

# Context7
if ($list -match '(?m)^context7') { OK "context7 bereits registriert — übersprungen" }
elseif (Confirm-Run "claude mcp add --scope user context7 -- npx -y `"@upstash/context7-mcp`"") { OK "context7 registriert" }

Warte "Rodin/Hyper3D-MCP: auf Wunsch weggelassen (kein Key)."

Write-Host ""
Write-Host "=== PHASE 3: UE-Projekt konfigurieren ===" -ForegroundColor Cyan

if (-not $UEProject) { Err "Kein UE-Projektpfad übergeben — Phase 3 übersprungen." }
elseif (-not (Test-Path $UEProject)) { Err "Pfad existiert nicht: $UEProject — Phase 3 übersprungen." }
else {
    python "$PSScriptRoot\merge_config.py" $UEProject
    if ($LASTEXITCODE -eq 0) { OK "Projekt-Konfiguration gemerged" } else { Err "Config-Merge fehlgeschlagen" }
    Write-Host ""
    Write-Host "  Danach in Claude Code (im UE-Projektordner gestartet) ausführen:"
    Write-Host "    /plugin marketplace add EpicGames/unreal-engine-skills-for-claude-code-plugin"
    Write-Host "    /plugin install unreal-engine-skills@unreal-engine-skills-for-claude-code-plugin"
    Write-Host "  (Falls 'marketplace add' fehlschlägt: Repo-Namen auf github.com/EpicGames prüfen.)"
}

Write-Host ""
Write-Host "=== PHASE 4: Verifikation ===" -ForegroundColor Cyan
Write-Host "  Registrierte MCP-Server (Live-Status):"
claude mcp list
Write-Host ""
Write-Host "  Smoke-Tests (in Claude Code eintippen):"
Write-Host "   UE:    'Liste alle Blueprints in Content/Characters und ihre Parent-Klasse.'"
Write-Host "          (setzt voraus: UE-Editor läuft, ModelContextProtocol.StartServer wurde ausgeführt)"
Write-Host "   Meshy: 'Erzeuge mit Meshy einen Text-to-3D-PREVIEW-Job (kein Refine, keine Credits):"
Write-Host "          niedrig aufgelöster Felsbrocken, stilisiert. Gib nur die Task-ID zurück.'"
Write-Host ""
Write-Host "  Manuelle Schritte im UE-Editor: siehe CHECKLISTE-UE-EDITOR.md"
if ($script:Fail) { Write-Host "Fertig mit Fehlern — siehe ❌ oben" } else { Write-Host "Fertig ohne Fehler ✅" }
