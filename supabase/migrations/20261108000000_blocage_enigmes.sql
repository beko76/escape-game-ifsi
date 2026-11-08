-- Blocage d'une énigme après 3 erreurs, déblocage depuis le tableau de bord enseignant.
-- À exécuter une fois dans l'éditeur SQL de Supabase (après 20261005000000_suivi_equipes.sql).
--   locked  : énigmes actuellement bloquées (écrit par l'équipe)
--   unlocks : déblocages accordés, ex. {"3": 1} (écrit par le tableau de bord)

alter table public.escape_teams
  add column if not exists locked smallint[] not null default '{}',
  add column if not exists unlocks jsonb not null default '{}';

-- Recharge le cache de schéma de l'API pour que les nouvelles colonnes soient visibles immédiatement
notify pgrst, 'reload schema';
