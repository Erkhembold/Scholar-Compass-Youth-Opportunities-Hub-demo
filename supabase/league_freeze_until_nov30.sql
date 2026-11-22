-- ScholarCompass: put everyone in Bronze and freeze promotion until Nov 30, 2026.
-- Safe to run more than once.
--  1. Every user goes to the Bronze league now.
--  2. The weekly rollover cannot promote anyone before 2026-11-30 00:00 UTC.
--     The Nov 23 rollover still resets weekly XP; the Nov 30 rollover is the
--     first one that can promote (based on the week of Nov 23-29).

update public.profiles set current_league = 'bronze' where current_league is distinct from 'bronze';
update public.leaderboard_entries set current_league = 'bronze' where current_league is distinct from 'bronze';

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
  promotions_open boolean := now() >= timestamptz '2026-11-30T00:00:00Z';
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
               when o.zone = 'promotion' and promotions_open then nextup.league_id
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

  return jsonb_build_object('ran', true, 'week', current_week, 'profiles_updated', moved_count, 'promotions_open', promotions_open);
end;
$$;
