-- ScholarCompass SAT 1v1 Challenge — match-play columns (part 2)
-- Run once in Supabase SQL Editor, AFTER sat_matches_schema.sql.
-- Safe to run more than once.
--
-- Adds what the lobby-only table from part 1 didn't have yet: display
-- names (so each player sees who they're playing), the shared question
-- set for a started match, the synchronized start time both clients
-- use to compute a common timer, and each player's own score/finished
-- flag for the results screen.

alter table public.sat_matches
  add column if not exists host_name text,
  add column if not exists opponent_name text,
  add column if not exists question_ids jsonb,
  add column if not exists started_at timestamptz,
  add column if not exists host_score integer not null default 0,
  add column if not exists opponent_score integer not null default 0,
  add column if not exists host_finished boolean not null default false,
  add column if not exists opponent_finished boolean not null default false;

-- Lets either player back out of a match before it's finished — the
-- host from an empty lobby, or either player once both have joined but
-- before/while playing. (Not scoped to status='waiting' — once the
-- opponent joins, status flips to 'active' immediately, so a
-- waiting-only policy would make the lobby's own "leave" button fail
-- right when it's most likely to be used.)
drop policy if exists "Host can cancel their own waiting match" on public.sat_matches;
drop policy if exists "Players in a match can delete it" on public.sat_matches;
create policy "Players in a match can delete it"
  on public.sat_matches for delete
  to authenticated
  using (auth.uid() = host_id or auth.uid() = opponent_id);
