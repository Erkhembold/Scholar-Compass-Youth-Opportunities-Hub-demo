-- ScholarCompass IELTS 1v1 Challenge — match table
-- Run once in Supabase SQL Editor. Safe to run more than once.
--
-- Mirrors sat_matches (see sat_matches_schema.sql / sat_matches_play_schema.sql
-- for the design notes — same reasoning applies here) with one addition:
-- a `skill` column, since an IELTS match is either Reading or Writing,
-- picked when the host creates the match.

create table if not exists public.ielts_matches (
  id uuid default gen_random_uuid() primary key,
  pin text not null,
  host_id uuid references auth.users on delete cascade not null,
  opponent_id uuid references auth.users on delete cascade,
  skill text not null check (skill in ('reading', 'writing')),
  question_count integer not null default 10 check (question_count between 5 and 20),
  time_per_question_seconds integer not null default 45 check (time_per_question_seconds between 10 and 120),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'completed', 'abandoned')),
  host_name text,
  opponent_name text,
  question_ids jsonb,
  started_at timestamptz,
  host_score integer not null default 0,
  opponent_score integer not null default 0,
  host_finished boolean not null default false,
  opponent_finished boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists ielts_matches_live_pin_idx;
create unique index ielts_matches_live_pin_idx
  on public.ielts_matches (pin)
  where status in ('waiting', 'active');

alter table public.ielts_matches enable row level security;

drop policy if exists "Signed-in users can find waiting IELTS matches, players can see their own" on public.ielts_matches;
create policy "Signed-in users can find waiting IELTS matches, players can see their own"
  on public.ielts_matches for select
  to authenticated
  using (status = 'waiting' or auth.uid() = host_id or auth.uid() = opponent_id);

drop policy if exists "Users can create an IELTS match as the host" on public.ielts_matches;
create policy "Users can create an IELTS match as the host"
  on public.ielts_matches for insert
  to authenticated
  with check (auth.uid() = host_id and opponent_id is null and status = 'waiting');

drop policy if exists "Players in an IELTS match can update it" on public.ielts_matches;
create policy "Players in an IELTS match can update it"
  on public.ielts_matches for update
  to authenticated
  using (auth.uid() = host_id or auth.uid() = opponent_id)
  with check (auth.uid() = host_id or auth.uid() = opponent_id);

drop policy if exists "Players in an IELTS match can delete it" on public.ielts_matches;
create policy "Players in an IELTS match can delete it"
  on public.ielts_matches for delete
  to authenticated
  using (auth.uid() = host_id or auth.uid() = opponent_id);

-- Joining is handled the same narrow way as the SAT version: a
-- SECURITY DEFINER function rather than a looser UPDATE policy, since
-- the joining user isn't "in the match" yet at the moment they need to
-- claim the opponent seat.
create or replace function public.join_ielts_match(p_pin text)
returns public.ielts_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.ielts_matches;
begin
  if auth.uid() is null then
    raise exception 'Must be signed in to join a match';
  end if;

  update public.ielts_matches
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

grant execute on function public.join_ielts_match(text) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'ielts_matches'
  ) then
    alter publication supabase_realtime add table public.ielts_matches;
  end if;
end $$;
