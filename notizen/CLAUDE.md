# Ideen (Notizen-App)

Eigenständige App, unabhängig vom restlichen Repo (Startklar). Kein Code wird
zwischen beiden Apps geteilt.

## Zweck

Kein allgemeines Notiz-Tool: der Nutzer schreibt seine eigentlichen Notizen
weiterhin woanders und **kopiert ausgewählte Ideen hierher**. Die App
organisiert diese Ideen automatisch (Ordner + KI-Verknüpfung) und bietet einen
KI-Brainstorming-Agenten. Kein Kalender/keine Erinnerungen/keine To-dos.

## Stack

- React 19 + TypeScript + Vite + Tailwind CSS 4
- TanStack Query v5 + `@supabase/supabase-js` (direkter Zugriff, kein lokaler Spiegel — kein Offline-Support)
- Supabase: Postgres + `pgvector` + Auth + Realtime + Edge Functions
- Anthropic Claude API (Edge Functions only, nie im Browser): Haiku für Auto-Filing, Sonnet für den Agenten
- Voyage AI für Embeddings (`voyage-3-lite`, 512 Dimensionen)
- Tiptap für Rich-Text
- `react-force-graph-2d` für die Graph-/Mindmap-Ansicht

## Struktur

- `src/routes/` — Seiten (React Router)
- `src/components/` — wiederverwendbare UI-Bausteine
- `src/lib/` — Supabase-Client, Auth-Context
- `supabase/migrations/` — SQL-Schema
- `supabase/functions/` — Edge Functions (`process-idea`, `agent-chat`)

## Env-Vars

Siehe `.env.example`. Edge-Function-Secrets (`ANTHROPIC_API_KEY`,
`VOYAGE_API_KEY`) werden über `supabase secrets set` gesetzt, nie im
Frontend-Bundle.

## Entwicklung

```bash
npm install
npm run dev
```

Erfordert ein Supabase-Projekt mit angewendeter Migration
(`supabase/migrations/0001_init.sql`) und `pgvector`-Extension.
