-- Notizen/Ideen-App: initiales Schema
create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  theme text not null default 'light',
  auto_filing_enabled boolean not null default true
);

alter table profiles enable row level security;

create policy "profiles: owner select" on profiles for select using (auth.uid() = id);
create policy "profiles: owner insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles: owner update" on profiles for update using (auth.uid() = id);

-- auto-create a profile row on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- folders (adjacency list + materialized path)
-- ---------------------------------------------------------------------------
create table folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references folders(id) on delete cascade,
  name text not null,
  path text not null default '',
  color text,
  centroid_embedding vector(512),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index folders_user_parent_idx on folders(user_id, parent_id);
create index folders_path_idx on folders using btree (path text_pattern_ops);

alter table folders enable row level security;

create policy "folders: owner select" on folders for select using (auth.uid() = user_id);
create policy "folders: owner insert" on folders for insert with check (auth.uid() = user_id);
create policy "folders: owner update" on folders for update using (auth.uid() = user_id);
create policy "folders: owner delete" on folders for delete using (auth.uid() = user_id);

create function public.folders_set_path()
returns trigger
language plpgsql
as $$
declare
  parent_path text;
begin
  if new.parent_id is null then
    new.path := new.id::text;
  else
    select path into parent_path from folders where id = new.parent_id;
    new.path := parent_path || '/' || new.id::text;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger folders_before_insert_update
  before insert or update of parent_id on folders
  for each row execute procedure public.folders_set_path();

-- ---------------------------------------------------------------------------
-- ideas (zentrale Entität; `kind` default 'idea', 'note' für spätere Nutzung)
-- ---------------------------------------------------------------------------
create table ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references folders(id) on delete set null,
  kind text not null default 'idea' check (kind in ('idea', 'note')),
  title text not null default '',
  content jsonb not null default '{}'::jsonb,
  content_text text,
  embedding vector(512),
  auto_filed boolean not null default false,
  filing_confidence real,
  needs_review boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ideas_user_folder_idx on ideas(user_id, folder_id);
create index ideas_embedding_idx on ideas using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index ideas_content_text_fts_idx on ideas using gin (to_tsvector('german', coalesce(content_text, '')));

alter table ideas enable row level security;

create policy "ideas: owner select" on ideas for select using (auth.uid() = user_id);
create policy "ideas: owner insert" on ideas for insert with check (auth.uid() = user_id);
create policy "ideas: owner update" on ideas for update using (auth.uid() = user_id);
create policy "ideas: owner delete" on ideas for delete using (auth.uid() = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger ideas_before_update
  before update on ideas
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
create table tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  unique (user_id, name)
);

alter table tags enable row level security;
create policy "tags: owner all" on tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table idea_tags (
  idea_id uuid not null references ideas(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (idea_id, tag_id)
);

alter table idea_tags enable row level security;
create policy "idea_tags: owner select" on idea_tags for select
  using (exists (select 1 from ideas where ideas.id = idea_id and ideas.user_id = auth.uid()));
create policy "idea_tags: owner modify" on idea_tags for all
  using (exists (select 1 from ideas where ideas.id = idea_id and ideas.user_id = auth.uid()))
  with check (exists (select 1 from ideas where ideas.id = idea_id and ideas.user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- idea_links (bidirektionaler Verknüpfungsgraph)
-- ---------------------------------------------------------------------------
create table idea_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid not null references ideas(id) on delete cascade,
  target_id uuid not null references ideas(id) on delete cascade,
  relation text not null default 'related' check (relation in ('related', 'builds_on', 'contradicts', 'example_of', 'question_for')),
  score real not null default 0,
  origin text not null default 'ai' check (origin in ('ai', 'user')),
  created_at timestamptz not null default now(),
  check (source_id <> target_id),
  unique (source_id, target_id, relation)
);

create index idea_links_source_idx on idea_links(source_id);
create index idea_links_target_idx on idea_links(target_id);

alter table idea_links enable row level security;
create policy "idea_links: owner all" on idea_links for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- agent chat
-- ---------------------------------------------------------------------------
create table agent_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table agent_conversations enable row level security;
create policy "agent_conversations: owner all" on agent_conversations for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table agent_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references agent_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content jsonb not null,
  referenced_idea_ids uuid[],
  created_at timestamptz not null default now()
);

create index agent_messages_conv_idx on agent_messages(conversation_id, created_at);

alter table agent_messages enable row level security;
create policy "agent_messages: owner select" on agent_messages for select
  using (exists (select 1 from agent_conversations c where c.id = conversation_id and c.user_id = auth.uid()));
create policy "agent_messages: owner insert" on agent_messages for insert
  with check (exists (select 1 from agent_conversations c where c.id = conversation_id and c.user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- filing_events (Audit-Log der Auto-Filing-Pipeline)
-- ---------------------------------------------------------------------------
create table filing_events (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  decision jsonb not null,
  folder_id uuid references folders(id),
  confidence real,
  created_at timestamptz not null default now()
);

alter table filing_events enable row level security;
create policy "filing_events: owner select" on filing_events for select
  using (exists (select 1 from ideas where ideas.id = idea_id and ideas.user_id = auth.uid()));
