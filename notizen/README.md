# Ideen

Eine persönliche Ideen-Sammlung mit KI-gestützter Einsortierung, Verknüpfung
und einem Brainstorming-Agenten. Kein allgemeines Notiz-Tool, kein
Kalender/Task-Manager — Ideen werden hier bewusst hineinkopiert, organisiert
und weitergedacht.

## Module

- **Ordner** — verschachtelbare Ordnerstruktur (`/ideen`).
- **Auto-Filing** — neue Ideen werden per Embedding (Voyage AI) + Claude
  automatisch einsortiert und mit verwandten Ideen verknüpft; unsichere
  Fälle landen zur Bestätigung in der Inbox (`/inbox`).
- **Graph** — Ideen als Netzwerk, visualisiert als Mindmap (`/graph`).
- **Agent** — Brainstorming-Chat mit Zugriff auf die eigenen Ideen (`/agent`).

Details zu Architektur, Datenmodell und Bauphasen: siehe Planungsdokument.

## Entwicklung

```bash
npm install
cp .env.example .env   # Supabase-Projekt-URL + Anon-Key eintragen
npm run dev             # Entwicklungsserver
npm run build            # Type-Check + Produktions-Build
npm run lint              # oxlint
```

Stack: React 19, TypeScript, Vite, Tailwind CSS 4, react-router 7, TanStack
Query, Supabase (Postgres + pgvector + Auth + Realtime + Edge Functions),
Tiptap, react-force-graph.

## Backend (Supabase)

```bash
supabase link --project-ref <dein-projekt-ref>
supabase db push                       # wendet supabase/migrations an
supabase secrets set ANTHROPIC_API_KEY=... VOYAGE_API_KEY=...
supabase functions deploy process-idea
supabase functions deploy agent-chat
```

## Deployment

Eigenständiges Vercel-Projekt mit Root Directory `notizen/` (unabhängig vom
Startklar-Deployment im Repo-Root).
