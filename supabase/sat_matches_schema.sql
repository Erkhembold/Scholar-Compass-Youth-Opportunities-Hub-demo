-- ScholarCompass SAT 1v1 Challenge — match/lobby table
-- Run once in Supabase SQL Editor. Safe to run more than once.
--
-- WHAT THIS IS FOR
-- One row per 1v1 match: who created it (host), who joined (opponent),
-- the match settings (how many questions, how long per question), and
-- its status. This is the table the create/join/lobby screens read and
-- write to, and the one the frontend subscribes to via Supabase
-- Realtime so both players see the opponent join, the match start,
-- etc. live.
--
-- This migration does NOT yet include question selection, live
-- timer state, per-answer scoring, or results — those need a couple
-- more columns and will come as a follow-up ALTER once the lobby step
-- is working end to end, same incremental pattern as
-- leaderboard_schema.sql did for profiles.

create table if not exists public.sat_matches (
  id uuid default gen_random_uuid() primary key,
  pin text not null,
  host_id uuid references auth.users on delete cascade not null,
  opponent_id uuid references auth.users on delete cascade,
  question_count integer not null default 10 check (question_count between 5 and 20),
  time_per_question_seconds integer not null default 30 check (time_per_question_seconds between 10 and 90),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'completed', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A PIN only needs to be unique while it's "live" (someone could still
-- join it or is playing it). Once a match finishes or is abandoned,
-- the same 4-digit PIN is free to be reused by a brand-new match —
-- otherwise a 4-digit PIN space (10,000 codes) would slowly fill up
-- forever.
drop index if exists sat_matches_live_pin_idx;
create unique index sat_matches_live_pin_idx
  on public.sat_matches (pin)
  where status in ('waiting', 'active');

alter table public.sat_matches enable row level security;

-- Players need to find a lobby by PIN before they've joined it, so
-- "waiting" matches are visible to any signed-in user by design (a PIN
-- is a random, short-lived, low-stakes code — this is the same trust
-- model as e.g. a Kahoot game PIN). Once a match is active/completed,
-- only the two players in it can still see it.
drop policy if exists "Signed-in users can find waiting matches, players can see their own" on public.sat_matches;
create policy "Signed-in users can find waiting matches, players can see their own"
  on public.sat_matches for select
  to authenticated
  using (status = 'waiting' or auth.uid() = host_id or auth.uid() = opponent_id);

drop policy if exists "Users can create a match as the host" on public.sat_matches;
create policy "Users can create a match as the host"
  on public.sat_matches for insert
  to authenticated
  with check (auth.uid() = host_id and opponent_id is null and status = 'waiting');

-- General updates (starting the match, later: scores/status changes)
-- are restricted to the two people actually in the match.
drop policy if exists "Players in a match can update it" on public.sat_matches;
create policy "Players in a match can update it"
  on public.sat_matches for update
  to authenticated
  using (auth.uid() = host_id or auth.uid() = opponent_id)
  with check (auth.uid() = host_id or auth.uid() = opponent_id);

-- JOINING is a special case: the joining user isn't "in the match" yet
-- at the moment they need to claim the opponent seat, so the policy
-- above doesn't cover it. Rather than write a looser, more exploitable
-- UPDATE policy for that one moment, this is done through a narrow
-- SECURITY DEFINER function instead — it runs with elevated privilege
-- but only ever performs this one specific, validated action.
create or replace function public.join_sat_match(p_pin text)
returns public.sat_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.sat_matches;
begin
  if auth.uid() is null then
    raise exception 'Must be signed in to join a match';
  end if;

  update public.sat_matches
  set opponent_id = auth.uid(),
      status = 'active',
      updated_at = now()
  where pin = p_pin
    and status = 'waiting'
    and opponent_id is null
    and host_id <> auth.uid()
  returning * into result;

  if result.id is null then
    raise exception 'That PIN isn''t an open match — it may already have an opponent, have started, or not exist.';
  end if;

  return result;
end;
$$;

grant execute on function public.join_sat_match(text) to authenticated;

-- Turns on Realtime for this table (the postgres_changes events the
-- lobby/match screens subscribe to for "opponent joined", "match
-- started", etc.). Harmless to re-run if it's already added.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'sat_matches'
  ) then
    alter publication supabase_realtime add table public.sat_matches;
  end if;
end $$;
