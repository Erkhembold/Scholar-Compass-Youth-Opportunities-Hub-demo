-- ScholarCompass Leaderboard — secure, per-league-only access
-- Run once in Supabase SQL Editor. Safe to run more than once.
--
-- WHAT THIS FIXES
-- The previous leaderboard_public_view.sql exposed every user's name,
-- league, XP, and badges to any visitor at all, with no restriction by
-- league. That's replaced here with a dedicated, narrow table whose
-- row-level security only ever returns rows that share the CALLER's own
-- current_league — a Bronze user's request can never return Silver
-- rows, at the database level, regardless of what the frontend asks
-- for or how the client-side code is modified.
--
-- WHY A SEPARATE TABLE (not just a policy on `profiles`)
-- `profiles` also holds private columns — email, school, grade,
-- intended_major, target_test. Row-level security controls which ROWS
-- a query can see, not which COLUMNS, so a same-league policy applied
-- directly to `profiles` would let league-mates fetch each other's
-- email/school/grade via a raw REST call, even if the app's own code
-- only ever requests name/XP. This table physically contains none of
-- those private columns, so there is nothing sensitive to leak even if
-- someone queries it directly with `select=*`.
--
-- It's kept in sync with `profiles` automatically by a trigger — no
-- app code needs to write to it directly.

create table if not exists public.leaderboard_entries (
  id uuid primary key references auth.users on delete cascade,
  name text,
  current_league text not null default 'bronze',
  weekly_xp integer not null default 0,
  badges jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard_entries enable row level security;

drop policy if exists "Users can view their own leaderboard entry" on public.leaderboard_entries;
create policy "Users can view their own leaderboard entry"
  on public.leaderboard_entries for select
  to authenticated
  using (id = auth.uid());

-- The "peers in my league" policy needs to know the caller's own
-- current_league — but looking that up with a plain subquery on this
-- same table triggers Postgres's RLS recursion guard: that inner
-- lookup is itself subject to this table's policies, which requires
-- evaluating this same policy again, and so on, until Postgres aborts
-- with "infinite recursion detected in policy" (a 500 to the client).
--
-- The standard fix is to do that inner lookup inside a SECURITY
-- DEFINER function, which runs with the function owner's privileges
-- and therefore bypasses RLS internally for just this one narrow,
-- single-column read — breaking the loop.
create or replace function public.my_leaderboard_league()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select current_league
  from public.leaderboard_entries
  where id = auth.uid();
$$;

drop policy if exists "Users can view leaderboard peers in their own league" on public.leaderboard_entries;
create policy "Users can view leaderboard peers in their own league"
  on public.leaderboard_entries for select
  to authenticated
  using (current_league = public.my_leaderboard_league());

-- No insert/update/delete policies for regular users on purpose — the
-- client never writes to this table directly. All writes happen here,
-- via a trigger that mirrors the relevant profiles columns whenever
-- they change.

create or replace function public.sync_leaderboard_entry()
returns trigger as $$
begin
  insert into public.leaderboard_entries (id, name, current_league, weekly_xp, badges, updated_at)
  values (
    new.id,
    new.name,
    coalesce(new.current_league, 'bronze'),
    coalesce(new.weekly_xp, 0),
    coalesce(new.badges, '[]'::jsonb),
    now()
  )
  on conflict (id) do update set
    name = excluded.name,
    current_league = excluded.current_league,
    weekly_xp = excluded.weekly_xp,
    badges = excluded.badges,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_profile_change_sync_leaderboard on public.profiles;
create trigger on_profile_change_sync_leaderboard
  after insert or update of name, current_league, weekly_xp, badges on public.profiles
  for each row execute procedure public.sync_leaderboard_entry();

-- Backfill: mirror every existing profile into leaderboard_entries once,
-- so real users created before this migration show up immediately
-- rather than waiting for their next profile update.
insert into public.leaderboard_entries (id, name, current_league, weekly_xp, badges, updated_at)
select
  id,
  name,
  coalesce(current_league, 'bronze'),
  coalesce(weekly_xp, 0),
  coalesce(badges, '[]'::jsonb),
  now()
from public.profiles
on conflict (id) do update set
  name = excluded.name,
  current_league = excluded.current_league,
  weekly_xp = excluded.weekly_xp,
  badges = excluded.badges,
  updated_at = now();
