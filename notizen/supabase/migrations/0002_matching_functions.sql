-- Vektor-Ähnlichkeitssuche für die Auto-Filing-Pipeline (Phase 2)

create or replace function match_folders(
  p_user_id uuid,
  p_query_embedding vector(512),
  p_match_count int default 5
)
returns table (id uuid, name text, path text, similarity real)
language sql stable
as $$
  select f.id, f.name, f.path, (1 - (f.centroid_embedding <=> p_query_embedding))::real as similarity
  from folders f
  where f.user_id = p_user_id
    and f.centroid_embedding is not null
  order by f.centroid_embedding <=> p_query_embedding
  limit p_match_count;
$$;

create or replace function match_ideas(
  p_user_id uuid,
  p_query_embedding vector(512),
  p_exclude_id uuid default null,
  p_match_count int default 10,
  p_min_similarity real default 0.3
)
returns table (id uuid, title text, content_text text, similarity real)
language sql stable
as $$
  select i.id, i.title, i.content_text, (1 - (i.embedding <=> p_query_embedding))::real as similarity
  from ideas i
  where i.user_id = p_user_id
    and (p_exclude_id is null or i.id <> p_exclude_id)
    and i.embedding is not null
    and (1 - (i.embedding <=> p_query_embedding)) > p_min_similarity
  order by i.embedding <=> p_query_embedding
  limit p_match_count;
$$;

-- Nächtlicher Cron ruft dies auf, um Ordner-Zentroide aus den enthaltenen
-- Idee-Embeddings neu zu berechnen (siehe Planungsdokument, Abschnitt 4).
create or replace function recompute_folder_centroids()
returns void
language sql
as $$
  update folders f
  set centroid_embedding = sub.avg_embedding
  from (
    select folder_id, avg(embedding) as avg_embedding
    from ideas
    where folder_id is not null and embedding is not null
    group by folder_id
  ) sub
  where f.id = sub.folder_id;
$$;
