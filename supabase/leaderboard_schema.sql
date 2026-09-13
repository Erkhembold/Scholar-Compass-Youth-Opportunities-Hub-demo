-- ScholarCompass League Leaderboard: adds league/XP tracking columns to
-- the existing profiles table. Safe to run more than once.
-- The 40-players-per-league board itself is generated deterministically
-- on the client (see src/utils/leaderboard.js) rather than stored — only
-- each real user's own league, XP, and badge history live in the database.

alter table public.profiles add column if not exists current_league text default 'bronze';
alter table public.profiles add column if not exists weekly_xp integer default 0;
alter table public.profiles add column if not exists lifetime_xp integer default 0;
alter table public.profiles add column if not exists last_processed_week integer;
alter table public.profiles add column if not exists badges jsonb default '[]'::jsonb;
