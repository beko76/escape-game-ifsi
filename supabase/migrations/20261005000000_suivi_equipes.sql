-- Suivi en direct des équipes pour le tableau de bord enseignant.
-- À exécuter une fois dans l'éditeur SQL de Supabase (ou via `supabase db push`).
-- Les tables sont préfixées "escape_" : le script peut être lancé dans un projet
-- Supabase qui héberge déjà une autre application, sans toucher à ses tables.

create table if not exists public.escape_sessions (
  code text primary key check (code ~ '^[A-Z0-9]{4,8}$'),
  label text,
  created_at timestamptz not null default now()
);

create table if not exists public.escape_teams (
  id uuid primary key,
  session text not null references public.escape_sessions (code) on delete cascade,
  team text not null check (char_length(team) between 1 and 40),
  phase text not null default 'playing',
  started_at timestamptz,
  finished_at timestamptz,
  solved smallint[] not null default '{}',
  current_view text,
  errors integer not null default 0,
  hints integer not null default 0,
  lock_attempts integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists escape_teams_session_idx on public.escape_teams (session);

-- Accès public via la clé "anon" : l'app n'a pas de comptes utilisateurs.
-- Les données ne contiennent que des noms d'équipe et une progression de jeu.
alter table public.escape_sessions enable row level security;
alter table public.escape_teams enable row level security;

drop policy if exists "sessions lecture" on public.escape_sessions;
drop policy if exists "sessions creation" on public.escape_sessions;
drop policy if exists "sessions suppression" on public.escape_sessions;
create policy "sessions lecture" on public.escape_sessions for select to anon using (true);
create policy "sessions creation" on public.escape_sessions for insert to anon with check (true);
create policy "sessions suppression" on public.escape_sessions for delete to anon using (true);

drop policy if exists "teams lecture" on public.escape_teams;
drop policy if exists "teams creation" on public.escape_teams;
drop policy if exists "teams mise a jour" on public.escape_teams;
drop policy if exists "teams suppression" on public.escape_teams;
create policy "teams lecture" on public.escape_teams for select to anon using (true);
create policy "teams creation" on public.escape_teams for insert to anon with check (true);
create policy "teams mise a jour" on public.escape_teams for update to anon using (true) with check (true);
create policy "teams suppression" on public.escape_teams for delete to anon using (true);

grant select, insert, delete on public.escape_sessions to anon;
grant select, insert, update, delete on public.escape_teams to anon;

-- Diffusion temps réel des changements vers le tableau de bord
alter table public.escape_teams replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'escape_teams'
  ) then
    alter publication supabase_realtime add table public.escape_teams;
  end if;
end $$;
