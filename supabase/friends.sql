-- ScholarCompass: friends + richer public profiles
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Run AFTER public_profiles_and_avatars.sql (it replaces get_public_profile()).
--
-- WHAT THIS ADDS
--   1. public.friendships  — one row per pair: pending request or accepted friendship.
--   2. RPCs (the ONLY way a client changes friendships):
--        send_friend_request(p_to)          -> add friend
--        respond_friend_request(p_id, bool) -> accept / decline (recipient only)
--        remove_friendship(p_other)         -> cancel request / unfriend
--        get_my_friendships()               -> my friends + requests, with names/avatars
--   3. get_public_profile() now also returns league, weekly rank and badges.
--
-- WHY RPCs INSTEAD OF DIRECT TABLE WRITES
--   Same pattern as sat_math_1v1_schema.sql: clients get NO insert/update/
--   delete rights on friendships, so a user can never forge a request "from"
--   someone else, accept their own request, or edit a row they aren't part of.
--   Every rule below is enforced by the database, not the frontend.

-- 1. Table -----------------------------------------------------------------
create table if not exists public.friendships (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references public.profiles(id) on delete cascade,
  addressee_id  uuid not null references public.profiles(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at    timestamptz not null default now(),
  responded_at  timestamptz,
  constraint friendships_no_self check (requester_id <> addressee_id)
);

-- One row per PAIR, whichever direction the request went. This is what stops
-- duplicate requests AND "A asks B while B already asked A".
create unique index if not exists friendships_unique_pair
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);

-- 2. Row-level security: read-only, and only your own rows -------------------
alter table public.friendships enable row level security;

drop policy if exists "Users can read their own friendships" on public.friendships;
create policy "Users can read their own friendships"
  on public.friendships for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- No insert/update/delete policies on purpose: clients cannot write directly.
revoke all on public.friendships from anon;
revoke insert, update, delete on public.friendships from authenticated;
grant select on public.friendships to authenticated;

-- 3. RPCs ---------------------------------------------------------------------

-- Add friend. If the other person ALREADY asked me, this accepts their request
-- instead of creating a clashing second row. Hidden profiles (profile_visible =
-- false) and unknown ids look identical: 'not found'.
create or replace function public.send_friend_request(p_to uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  existing public.friendships;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  if p_to is null or p_to = me then
    raise exception 'cannot friend yourself';
  end if;
  if not exists (select 1 from public.profiles where id = p_to and profile_visible) then
    raise exception 'not found';
  end if;

  select * into existing
    from public.friendships
   where least(requester_id, addressee_id) = least(me, p_to)
     and greatest(requester_id, addressee_id) = greatest(me, p_to)
   for update;

  if found then
    if existing.status = 'accepted' then
      return jsonb_build_object('status', 'friends');
    end if;
    if existing.requester_id = me then
      return jsonb_build_object('status', 'pending_out'); -- duplicate: no-op
    end if;
    -- They already asked me: treat my "add" as accepting.
    update public.friendships
       set status = 'accepted', responded_at = now()
     where id = existing.id;
    return jsonb_build_object('status', 'friends');
  end if;

  insert into public.friendships (requester_id, addressee_id) values (me, p_to);
  return jsonb_build_object('status', 'pending_out');
end;
$$;

-- Accept / decline. ONLY the recipient of a pending request can do this.
-- Decline deletes the row, so either person may send a fresh request later.
create or replace function public.respond_friend_request(p_id uuid, p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  f public.friendships;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  select * into f from public.friendships where id = p_id for update;
  if not found or f.addressee_id <> me or f.status <> 'pending' then
    raise exception 'not found';
  end if;

  if p_accept then
    update public.friendships set status = 'accepted', responded_at = now() where id = f.id;
    return jsonb_build_object('status', 'friends');
  end if;

  delete from public.friendships where id = f.id;
  return jsonb_build_object('status', 'none');
end;
$$;

-- Cancel my own pending request, or unfriend. Works on the pair with p_other,
-- but only if I'm one of the two people (and, for a pending request, only the
-- sender may cancel — the recipient uses decline instead).
create or replace function public.remove_friendship(p_other uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  delete from public.friendships
   where least(requester_id, addressee_id) = least(me, p_other)
     and greatest(requester_id, addressee_id) = greatest(me, p_other)
     and (status = 'accepted' or requester_id = me);

  return jsonb_build_object('status', 'none');
end;
$$;

-- My friends and requests, with just enough public info to render a list.
-- Name + avatar are shown to the other party of a friendship/request. Streak
-- and league only appear if that person kept their profile visible.
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
            'name', o.name,
            'avatar_path', o.avatar_path,
            'status', case
                        when f.status = 'accepted' then 'friends'
                        when f.requester_id = me then 'pending_out'
                        else 'pending_in'
                      end,
            'current_league', case when o.profile_visible then o.current_league end,
            'current_streak', case
                                when not o.profile_visible then null
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

revoke all on function public.send_friend_request(uuid) from public, anon;
revoke all on function public.respond_friend_request(uuid, boolean) from public, anon;
revoke all on function public.remove_friendship(uuid) from public, anon;
revoke all on function public.get_my_friendships() from public, anon;
grant execute on function public.send_friend_request(uuid) to authenticated;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
grant execute on function public.remove_friendship(uuid) to authenticated;
grant execute on function public.get_my_friendships() to authenticated;

-- 4. Richer public profile ----------------------------------------------------
-- Same door and same privacy rules as before (null when missing/hidden, signed-in
-- only, one profile at a time). Adds league, weekly rank inside that league and
-- the weekly-achievement badges (already visible to league-mates on the
-- leaderboard). Still NO email, school, grade, major, XP or practice history.
create or replace function public.get_public_profile(p_id uuid)
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
  league_rank integer;
  league_size integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select id, name, avatar_path, current_streak, longest_streak,
         last_activity_date, sat_target_score, ielts_target_score, profile_visible,
         current_league, weekly_xp, badges
    into p
    from public.profiles
   where id = p_id;

  if not found then
    return null;
  end if;

  if p.id <> auth.uid() and not p.profile_visible then
    return null;
  end if;

  eff := case
           when p.last_activity_date = today or p.last_activity_date = today - 1
             then p.current_streak
           else 0
         end;

  select 1 + count(*) filter (where weekly_xp > coalesce(p.weekly_xp, 0)),
         count(*)
    into league_rank, league_size
    from public.profiles
   where current_league is not distinct from p.current_league;

  return jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'avatar_path', p.avatar_path,
    'current_streak', eff,
    'longest_streak', greatest(p.longest_streak, eff),
    'sat_target_score', p.sat_target_score,
    'ielts_target_score', p.ielts_target_score,
    'current_league', coalesce(p.current_league, 'bronze'),
    'league_rank', league_rank,
    'league_size', league_size,
    'badges', coalesce(p.badges, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_public_profile(uuid) from public;
revoke all on function public.get_public_profile(uuid) from anon;
grant execute on function public.get_public_profile(uuid) to authenticated;
