-- ScholarCompass: shareable student cards + per-field privacy
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Run AFTER friends.sql (it replaces get_public_profile() and get_my_friendships()).
--
-- PRIVACY MODEL
--   profiles.public_profile (jsonb) holds the owner's choices:
--     show      : one true/false per field - name, avatar, school, grade, sat,
--                 ielts, streak, league, xp, achievements
--     cards     : which cards appear on their public profile, in order
--     featured  : which of those is shown first
--   A field that is missing from `show` falls back to the SAFE default:
--   only name, avatar, streak, sat and ielts (what was already public before
--   this feature) default to public. school, grade, league, xp and
--   achievements are PRIVATE until the owner turns them on.
--
--   The filtering happens HERE, in the database. Other students can only call
--   get_public_profile(), which returns a field only when its flag is on, so a
--   private value never leaves the server - the website cannot "forget" to hide
--   it. profile_visible = false still hides the whole profile.
--
--   Never returned to anyone else: email, auth id, anything not listed below.

-- 1. Column + sanitizer -------------------------------------------------------
alter table public.profiles
  add column if not exists public_profile jsonb not null default '{}'::jsonb;

-- Whatever a client writes, only known keys with boolean / known-card values
-- survive. Junk, extra keys and oversized payloads are dropped.
create or replace function public.sanitize_public_profile()
returns trigger
language plpgsql
as $$
declare
  s jsonb := coalesce(new.public_profile, '{}'::jsonb);
  show jsonb := '{}'::jsonb;
  cards jsonb := '[]'::jsonb;
  feat text;
  k text;
begin
  if jsonb_typeof(s) <> 'object' then
    s := '{}'::jsonb;
  end if;

  foreach k in array array['name','avatar','school','grade','sat','ielts','streak','league','xp','achievements'] loop
    if jsonb_typeof(s -> 'show' -> k) = 'boolean' then
      show := show || jsonb_build_object(k, s -> 'show' -> k);
    end if;
  end loop;

  if jsonb_typeof(s -> 'cards') = 'array' then
    select coalesce(jsonb_agg(c order by first_pos), '[]'::jsonb)
      into cards
      from (
        select t.c, min(t.ord) as first_pos
          from jsonb_array_elements_text(s -> 'cards') with ordinality as t(c, ord)
         where t.c = any (array['student','streak','league','sat','ielts','achievements'])
         group by t.c
      ) q;
  end if;

  if jsonb_typeof(s -> 'featured') = 'string' then
    feat := s ->> 'featured';
    if not (cards ? feat) then
      feat := null;
    end if;
  end if;

  new.public_profile := jsonb_build_object(
    'show', show,
    'cards', cards,
    'featured', case when feat is null then 'null'::jsonb else to_jsonb(feat) end
  );
  return new;
end;
$$;

drop trigger if exists profiles_sanitize_public_profile on public.profiles;
create trigger profiles_sanitize_public_profile
  before insert or update of public_profile on public.profiles
  for each row execute procedure public.sanitize_public_profile();

-- 2. Is a field public? (safe defaults described above) ----------------------
create or replace function public._share_flag(s jsonb, k text)
returns boolean
language sql
immutable
as $$
  select coalesce(
    case when jsonb_typeof(s -> 'show' -> k) = 'boolean' then (s -> 'show' ->> k)::boolean end,
    k in ('name', 'avatar', 'streak', 'sat', 'ielts')
  );
$$;

-- 3. Everything about one student, UNFILTERED. Internal only (not callable by
--    clients); the two public functions below decide what leaves. Real data
--    only - every number comes from the student's own saved activity. Tables
--    from optional migrations are treated as "0" if they don't exist yet.
create or replace function public._card_data(p_uid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  p record;
  today date := public.ub_today();
  eff integer;
  n integer;
  sat_q integer := 0;
  ielts_q integer := 0;
  mock_n integer := 0;
  band numeric := null;
  league_rank integer;
  league_size integer;
begin
  select id, name, avatar_path, school, grade, current_streak, longest_streak,
         last_activity_date, sat_target_score, ielts_target_score, current_league,
         weekly_xp, lifetime_xp, badges, public_profile
    into p
    from public.profiles
   where id = p_uid;
  if not found then
    return null;
  end if;

  eff := case
           when p.last_activity_date = today or p.last_activity_date = today - 1
             then p.current_streak
           else 0
         end;

  select 1 + count(*) filter (where weekly_xp > coalesce(p.weekly_xp, 0)), count(*)
    into league_rank, league_size
    from public.profiles
   where current_league is not distinct from p.current_league;

  begin select count(*) into n from public.sat_progress where user_id = p_uid; sat_q := sat_q + n;
  exception when undefined_table then null; end;
  begin select count(*) into n from public.sat_math_exercise_attempts where user_id = p_uid; sat_q := sat_q + n;
  exception when undefined_table then null; end;
  begin select count(*) into n from public.sat_math_match_answers where user_id = p_uid; sat_q := sat_q + n;
  exception when undefined_table then null; end;
  begin select coalesce(sum(items_total), 0) into n from public.ielts_exercise_attempts where user_id = p_uid; ielts_q := n;
  exception when undefined_table then null; end;
  begin
    select count(*) into mock_n from public.ielts_attempts where user_id = p_uid;
    select a.band into band from public.ielts_attempts a where a.user_id = p_uid order by a.completed_at desc limit 1;
  exception when undefined_table then null; end;

  return jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'avatar_path', p.avatar_path,
    'school', p.school,
    'grade', p.grade,
    'current_streak', eff,
    'longest_streak', greatest(p.longest_streak, eff),
    'sat_target_score', p.sat_target_score,
    'ielts_target_score', p.ielts_target_score,
    'current_league', coalesce(p.current_league, 'bronze'),
    'league_rank', league_rank,
    'league_size', league_size,
    'weekly_xp', coalesce(p.weekly_xp, 0),
    'lifetime_xp', coalesce(p.lifetime_xp, 0),
    'badges', coalesce(p.badges, '[]'::jsonb),
    'sat_questions', sat_q,
    'ielts_questions', ielts_q,
    'ielts_mock_count', mock_n,
    'ielts_latest_band', band,
    'settings', coalesce(p.public_profile, '{}'::jsonb)
  );
end;
$$;

revoke all on function public._card_data(uuid) from public, anon, authenticated;

-- 4. My own full data (for my settings screen and my share images) -----------
create or replace function public.get_my_card_data()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  return public._card_data(auth.uid());
end;
$$;

revoke all on function public.get_my_card_data() from public, anon;
grant execute on function public.get_my_card_data() to authenticated;

-- 5. What other students may see: ONLY fields whose flag is on ----------------
create or replace function public.get_public_profile(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  d jsonb;
  s jsonb;
  visible boolean;
  cards jsonb;
  feat text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select profile_visible into visible from public.profiles where id = p_id;
  if not found then
    return null;
  end if;
  if p_id <> auth.uid() and not visible then
    return null;
  end if;

  d := public._card_data(p_id);
  s := d -> 'settings';

  -- A card is only listed if the data it needs is public too.
  select coalesce(jsonb_agg(c order by ord), '[]'::jsonb)
    into cards
    from jsonb_array_elements_text(coalesce(s -> 'cards', '[]'::jsonb)) with ordinality as t(c, ord)
   where case c
           when 'streak' then public._share_flag(s, 'streak') and (d ->> 'current_streak')::int > 0
           when 'league' then public._share_flag(s, 'league')
           when 'sat' then public._share_flag(s, 'sat')
           when 'ielts' then public._share_flag(s, 'ielts')
           when 'achievements' then public._share_flag(s, 'achievements') and jsonb_array_length(d -> 'badges') > 0
           when 'student' then true
           else false
         end;

  feat := s ->> 'featured';
  if feat is null or not (cards ? feat) then
    feat := null;
  end if;

  return jsonb_build_object(
    'id', d -> 'id',
    'name', case when public._share_flag(s, 'name') then d -> 'name' end,
    'avatar_path', case when public._share_flag(s, 'avatar') then d -> 'avatar_path' end,
    'school', case when public._share_flag(s, 'school') then d -> 'school' end,
    'grade', case when public._share_flag(s, 'grade') then d -> 'grade' end,
    'streak', case when public._share_flag(s, 'streak') then
        jsonb_build_object('current', d -> 'current_streak', 'longest', d -> 'longest_streak') end,
    'sat', case when public._share_flag(s, 'sat') then
        jsonb_build_object('target', d -> 'sat_target_score', 'questions', d -> 'sat_questions') end,
    'ielts', case when public._share_flag(s, 'ielts') then
        jsonb_build_object('target', d -> 'ielts_target_score', 'latest_band', d -> 'ielts_latest_band',
                           'questions', d -> 'ielts_questions') end,
    'league', case when public._share_flag(s, 'league') then
        jsonb_build_object('id', d -> 'current_league', 'rank', d -> 'league_rank', 'size', d -> 'league_size') end,
    'xp', case when public._share_flag(s, 'xp') then
        jsonb_build_object('lifetime', d -> 'lifetime_xp', 'weekly', d -> 'weekly_xp') end,
    'badges', case when public._share_flag(s, 'achievements') then d -> 'badges' end,
    'cards', cards,
    'featured', to_jsonb(feat)
  );
end;
$$;

revoke all on function public.get_public_profile(uuid) from public, anon;
grant execute on function public.get_public_profile(uuid) to authenticated;

-- 6. Friends list honours the same flags ---------------------------------------
create or replace function public.get_my_friendships()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  me uuid := auth.uid();
  today date := public.ub_today();
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  return coalesce((
    select jsonb_agg(row_json order by sort_key desc)
      from (
        select
          coalesce(f.responded_at, f.created_at) as sort_key,
          jsonb_build_object(
            'friendship_id', f.id,
            'user_id', o.id,
            'name', case when public._share_flag(o.public_profile, 'name') then o.name end,
            'avatar_path', case when public._share_flag(o.public_profile, 'avatar') then o.avatar_path end,
            'status', case
                        when f.status = 'accepted' then 'friends'
                        when f.requester_id = me then 'pending_out'
                        else 'pending_in'
                      end,
            'current_league', case
                                when o.profile_visible and public._share_flag(o.public_profile, 'league')
                                  then o.current_league
                              end,
            'current_streak', case
                                when not (o.profile_visible and public._share_flag(o.public_profile, 'streak')) then null
                                when o.last_activity_date in (today, today - 1) then o.current_streak
                                else 0
                              end
          ) as row_json
        from public.friendships f
        join public.profiles o
          on o.id = case when f.requester_id = me then f.addressee_id else f.requester_id end
        where f.requester_id = me or f.addressee_id = me
      ) s
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.get_my_friendships() from public, anon;
grant execute on function public.get_my_friendships() to authenticated;
