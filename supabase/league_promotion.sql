-- ScholarCompass: real weekly league promotion / relegation
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Independent of the other migrations.
--
-- WHAT THIS REPLACES
-- src/utils/leaderboard.js had a `processWeeklyReset()` that ran per-user,
-- client-side, whenever that one user's Profile or Leaderboard page
-- happened to load. To decide whether THEY were promoted, it built a
-- one-off board of ~39 deterministically-seeded FAKE players (see that
-- function's own "SIMULATION, NOT THE REAL LEADERBOARD" comment) and
-- ranked the user against those, never against the other real students
-- shown on the actual Leaderboard page. So the league a user ended up in
-- had no real relationship to how they did against real competitors —
-- that's the bug being fixed here.
--
-- WHAT THIS DOES INSTEAD
-- One function, public.run_weekly_league_rollover(), computes everyone's
-- real rank from real weekly_xp in leaderboard_entries, resolves
-- promotion/stay/relegation for EVERY league in a single pass (so no
-- league's result depends on another league's result in the same
-- rollover), and updates every real profile at once. It is:
--   - IDEMPOTENT PER WEEK: a singleton row tracks the last processed week
--     (the same Monday-anchored week used everywhere else — see
--     src/utils/leaderboard.js getWeekInfo() and the EPOCH/WEEK_MS
--     constants there); calling it again before the next week boundary is
--     a safe no-op.
--   - CONCURRENCY-SAFE: the singleton row is locked (`for update`) before
--     the check, so if two students' browsers both trigger it around the
--     same moment, only one actually performs the rollover.
--   - TRIGGERED both ways: by pg_cron if that extension is available on
--     this project (best-effort — see the guarded block below, which
--     never fails the rest of this file if pg_cron isn't available), AND
--     by the client calling it opportunistically (already wired into the
--     Leaderboard and Profile pages) — so a rollover still happens the
--     next time any signed-in user visits, even with no cron running.
--
-- HONEST LIMIT: weekly_xp is reset to 0 at rollover and there's no
-- separate per-week history table, so if rollover is somehow skipped for
-- more than one real week (e.g. zero visits and no cron for two+ weeks),
-- the next rollover treats however much weekly_xp has piled up since the
-- last one as "this week's" result rather than replaying each missed week
-- individually. With the client-side trigger on two separate pages plus
-- optional cron, that gap should only ever happen if literally nobody
-- opens the site for a full week.

-- 1. Singleton: which week has already been processed ----------------------
create table if not exists public.league_rollover_state (
  id boolean primary key default true,
  last_processed_week integer not null,
  updated_at timestamptz not null default now(),
  constraint league_rollover_state_singleton check (id)
);

-- Seed to the CURRENT week (not one behind) on first run, so this doesn't
-- immediately try to "correct" the league everyone is already in using
-- weekly_xp that was accumulated under the old, unrelated mechanism —
-- real rollover starts fresh from the next real week boundary.
insert into public.league_rollover_state (id, last_processed_week)
values (true, floor(extract(epoch from (now() - timestamptz '2024-01-01T00:00:00Z')) / 604800)::integer)
on conflict (id) do nothing;

-- 2. League order, matching src/data/leagues.js exactly ---------------------
create table if not exists public.league_order (
  league_id text primary key,
  order_num integer not null unique
);

insert into public.league_order (league_id, order_num) values
  ('bronze', 0), ('silver', 1), ('gold', 2), ('platinum', 3), ('diamond', 4),
  ('emerald', 5), ('sapphire', 6), ('ruby', 7), ('obsidian', 8), ('celestial', 9)
on conflict (league_id) do update set order_num = excluded.order_num;

-- 3. The rollover itself -----------------------------------------------------
create or replace function public.run_weekly_league_rollover()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_week integer := floor(extract(epoch from (now() - timestamptz '2024-01-01T00:00:00Z')) / 604800)::integer;
  processed_week integer;
  moved_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select last_processed_week into processed_week
    from public.league_rollover_state
   where id = true
     for update;

  if processed_week >= current_week then
    return jsonb_build_object('ran', false, 'week', current_week);
  end if;

  with ranked as (
    select le.id, le.current_league, le.weekly_xp,
           row_number() over (partition by le.current_league order by le.weekly_xp desc, le.id) as rnk,
           count(*) over (partition by le.current_league) as total
      from public.leaderboard_entries le
  ),
  outcomes as (
    select id, current_league, rnk, total,
           case
             when rnk <= 15 then 'promotion'
             when rnk <= total - 5 then 'stay'
             else 'relegation'
           end as zone
      from ranked
  ),
  resolved as (
    select o.id, o.current_league, o.rnk, o.zone,
           coalesce(
             case
               when o.zone = 'promotion' then nextup.league_id
               when o.zone = 'relegation' then nextdown.league_id
               else null
             end,
             o.current_league
           ) as next_league
      from outcomes o
      left join public.league_order lo on lo.league_id = o.current_league
      left join public.league_order nextup on nextup.order_num = lo.order_num + 1
      left join public.league_order nextdown on nextdown.order_num = lo.order_num - 1
  )
  update public.profiles p
     set current_league = r.next_league,
         weekly_xp = 0,
         last_processed_week = current_week,
         badges = case
                    when r.rnk <= 3 then
                      coalesce(p.badges, '[]'::jsonb) || jsonb_build_array(
                        jsonb_build_object(
                          'placement', r.rnk,
                          'badge', case r.rnk when 1 then 'Gold' when 2 then 'Silver' else 'Bronze' end,
                          'league', r.current_league,
                          'week', current_week
                        )
                      )
                    else p.badges
                  end
    from resolved r
   where p.id = r.id;

  get diagnostics moved_count = row_count;

  update public.league_rollover_state set last_processed_week = current_week, updated_at = now() where id = true;

  return jsonb_build_object('ran', true, 'week', current_week, 'profiles_updated', moved_count);
end;
$$;

revoke all on function public.run_weekly_league_rollover() from public;
revoke all on function public.run_weekly_league_rollover() from anon;
grant execute on function public.run_weekly_league_rollover() to authenticated;

-- 4. Best-effort automatic weekly trigger via pg_cron ------------------------
-- Not required — see the client-triggered fallback above — but runs the
-- rollover right at the week boundary if this project has pg_cron
-- available. Entirely skipped, without failing the rest of this file, on
-- projects where it isn't (e.g. some Supabase plans/regions).
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule(
      'scholarcompass-league-rollover',
      '5 0 * * 1', -- 00:05 UTC every Monday; the function itself decides if a week is actually due
      $cron$select public.run_weekly_league_rollover();$cron$
    );
  end if;
exception when others then
  raise notice 'pg_cron scheduling skipped on this project (%). Rollover will still run the next time a signed-in user loads their Profile or Leaderboard page.', sqlerrm;
end $$;
