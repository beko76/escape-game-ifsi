-- Suivi en direct des équipes pour le tableau de bord enseignant.
-- À exécuter une fois dans l'éditeur SQL de Supabase (ou via `supabase db push`).

create table if not exists public.sessions (
  code text primary key check (code ~ '^[A-Z0-9]{4,8}$'),
  label text,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key,
  session text not null references public.sessions (code) on delete cascade,
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

create index if not exists teams_session_idx on public.teams (session);

-- Accès public via la clé "anon" : l'app n'a pas de comptes utilisateurs.
-- Les données ne contiennent que des noms d'équipe et une progression de jeu.
alter table public.sessions enable row level security;
alter table public.teams enable row level security;

drop policy if exists "sessions lecture" on public.sessions;
drop policy if exists "sessions creation" on public.sessions;
drop policy if exists "sessions suppression" on public.sessions;
create policy "sessions lecture" on public.sessions for select to anon using (true);
create policy "sessions creation" on public.sessions for insert to anon with check (true);
create policy "sessions suppression" on public.sessions for delete to anon using (true);

drop policy if exists "teams lecture" on public.teams;
drop policy if exists "teams creation" on public.teams;
drop policy if exists "teams mise a jour" on public.teams;
drop policy if exists "teams suppression" on public.teams;
create policy "teams lecture" on public.teams for select to anon using (true);
create policy "teams creation" on public.teams for insert to anon with check (true);
create policy "teams mise a jour" on public.teams for update to anon using (true) with check (true);
create policy "teams suppression" on public.teams for delete to anon using (true);

grant select, insert, delete on public.sessions to anon;
grant select, insert, update, delete on public.teams to anon;

-- Diffusion temps réel des changements vers le tableau de bord
alter table public.teams replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'teams'
  ) then
    alter publication supabase_realtime add table public.teams;
  end if;
end $$;
