#!/usr/bin/env python3
"""Merged .mcp.json und .claude/settings.json in ein UE-Projekt.

Bestehende Einträge werden NIE überschrieben: vorhandene Schlüssel gewinnen,
es wird nur ergänzt. Vor jeder Änderung wird ein .bak-Backup angelegt.
Aufruf: python3 merge_config.py /pfad/zum/UE-Projekt
"""
import json
import shutil
import sys
from pathlib import Path

MCP_ADDITIONS = {
    "mcpServers": {
        # Projekt-Scope-Einträge; die User-Scope-Server (meshy/blender/context7)
        # sind bereits global registriert. Hier nur der UE-interne Server,
        # der vom UnrealClaude/ModelContextProtocol-Plugin bereitgestellt wird.
        "unreal": {
            "type": "sse",
            "url": "http://127.0.0.1:32123/sse",
            "_hinweis": "Port ggf. an die Ausgabe von ModelContextProtocol.StartServer anpassen.",
        }
    }
}

SETTINGS_ADDITIONS = {
    "enableAllProjectMcpServers": True,
}


def deep_merge_keep_existing(existing: dict, additions: dict) -> dict:
    """Ergänzt additions in existing; vorhandene Werte bleiben unangetastet."""
    for key, value in additions.items():
        if key not in existing:
            existing[key] = value
        elif isinstance(existing[key], dict) and isinstance(value, dict):
            deep_merge_keep_existing(existing[key], value)
        # sonst: bestehenden Wert behalten
    return existing


def merge_file(path: Path, additions: dict) -> None:
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
        shutil.copy2(path, path.with_suffix(path.suffix + ".bak"))
        print(f"  Backup: {path}.bak")
    else:
        data = {}
        path.parent.mkdir(parents=True, exist_ok=True)
    deep_merge_keep_existing(data, additions)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"  Geschrieben: {path}")


def main() -> int:
    if len(sys.argv) != 2:
        print("Aufruf: merge_config.py /pfad/zum/UE-Projekt", file=sys.stderr)
        return 1
    project = Path(sys.argv[1]).expanduser().resolve()
    if not project.is_dir():
        print(f"Kein Verzeichnis: {project}", file=sys.stderr)
        return 1
    if not list(project.glob("*.uproject")):
        print(f"  Warnung: keine .uproject-Datei in {project} gefunden — Pfad prüfen!")
    merge_file(project / ".mcp.json", MCP_ADDITIONS)
    merge_file(project / ".claude" / "settings.json", SETTINGS_ADDITIONS)
    return 0


if __name__ == "__main__":
    sys.exit(main())
