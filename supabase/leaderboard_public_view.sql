-- ScholarCompass Leaderboard — public read access (safe columns only)
-- Safe to run more than once.
--
-- The `profiles` table's row-level security only ever allowed a user to
-- read their OWN row (see profiles_schema.sql: "auth.uid() = id"). That's
-- correct for the profile page, but it meant the leaderboard could never
-- see any OTHER real signed-up user — every seat except the one browser
-- currently signed in was filled with a deterministic demo player. This
-- view carves out one narrow, deliberate exception: it exposes only the
-- columns needed to render a leaderboard (name, league, weekly XP,
-- badges) — never email, school, grade, or any other private field — to
-- any visitor, signed in or not.
--
-- Views in Postgres run with the privileges of their OWNER by default
-- (security_invoker = false), so as long as this is run as the project
-- owner/service role in the Supabase SQL editor (the normal way to run
-- these files), it bypasses the profiles table's restrictive RLS for
-- just this narrow column list — real rows, real names, real XP.

create or replace view public.leaderboard_entries
with (security_invoker = false) as
select
  id,
  name,
  current_league,
  weekly_xp,
  badges
from public.profiles;

grant select on public.leaderboard_entries to authenticated, anon;
