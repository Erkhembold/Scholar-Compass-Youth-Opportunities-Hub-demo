-- ScholarCompass: custom (friend) leagues
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Run AFTER friends.sql (invites are friends-only). Nothing else is required:
-- it works whether or not share_cards.sql / the avatars migration were run.
--
-- WHAT THIS IS
--   A private, social competition layer on top of the existing global
--   Bronze -> Diamond leagues. It does NOT touch profiles.current_league,
--   leaderboard_entries, weekly rollover, promotion or relegation.
--
-- TABLES
--   custom_leagues           one row per league (name, description, owner, mode)
--   custom_league_members    who is / was in a league (active | left | removed)
--   custom_league_invites    one row per (league, invitee): pending | accepted |
--                            declined | cancelled
--   custom_league_baselines  each member's lifetime XP when they joined. Used by
--                            "ongoing" leagues. NO client access at all.
--
-- COMPETITION MODES (chosen by the owner when creating the league)
--   weekly   XP = profiles.weekly_xp. Same Monday-to-Monday week as the global
--            leaderboard; resets when the global week rolls over.
--   ongoing  XP = lifetime XP earned SINCE the student joined this league
--            (lifetime_xp minus the baseline saved when they joined).
--
-- INVITE RULES (all enforced below, not in the website)
--   * Only the owner can invite, and only people who are the owner's friends.
--   * An invite NEVER adds anyone. The invitee must accept; declining adds nothing.
--   * No self-invites, no duplicates (one row per league + person), no inviting
--     someone already in the league.
--   * A declined invite can't be re-sent for 7 days (stops pestering).
--   * A league holds at most 20 people, counting pending invites, so an accepted
--     invite can never push it over the limit. Limits per student: own at most
--     5 leagues, be in at most 10.
--   * Only the invitee can accept/decline; only the owner can cancel.
--   * The owner can't leave (delete the league instead). Only the owner can
--     remove members, rename, or delete.
--
-- SECURITY
--   Row-level security is ON for every table. Clients can only SELECT, and only:
--   leagues you own / are in / are invited to, membership rows of your leagues
--   (and your own), invites you sent or received. Nobody can INSERT/UPDATE/DELETE
--   directly: every change goes through the SECURITY DEFINER functions below.
--   Members see each other's name, photo and league XP (that's what a league is);
--   a name/photo the student made private elsewhere is shown as
--   "ScholarCompass student" / initial.
--
-- REALTIME
--   The three visible tables are added to the supabase_realtime publication.
--   Nothing is ever hard-deleted except when a whole league is deleted:
--   leaving / removal / decline / cancel are UPDATEs, which Realtime filters
--   through the policies above (DELETE events cannot be filtered by RLS).

do $$
begin
  if to_regclass('public.friendships') is null then
    raise exception 'Run friends.sql first: custom leagues invite friends and need the friendships table.';
  end if;
end $$;

-- 1. Tables ---------------------------------------------------------------------
create table if not exists public.custom_leagues (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 3 and 40 and name = btrim(name)),
  description text check (description is null or char_length(description) <= 200),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  mode        text not null default 'weekly' check (mode in ('weekly', 'ongoing')),
  created_at  timestamptz not null default now()
);
create index if not exists custom_leagues_owner_idx on public.custom_leagues (owner_id);

create table if not exists public.custom_league_members (
  league_id uuid not null references public.custom_leagues(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  status    text not null default 'active' check (status in ('active', 'left', 'removed')),
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);
create index if not exists custom_league_members_user_idx
  on public.custom_league_members (user_id) where status = 'active';

create table if not exists public.custom_league_invites (
  id           uuid primary key default gen_random_uuid(),
  league_id    uuid not null references public.custom_leagues(id) on delete cascade,
  inviter_id   uuid not null references public.profiles(id) on delete cascade,
  invitee_id   uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'pending'
               check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  constraint custom_league_invites_no_self check (inviter_id <> invitee_id),
  constraint custom_league_invites_one_per_person unique (league_id, invitee_id)
);
create index if not exists custom_league_invites_invitee_idx
  on public.custom_league_invites (invitee_id) where status = 'pending';

create table if not exists public.custom_league_baselines (
  league_id    uuid not null references public.custom_leagues(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  baseline_xp  integer not null default 0,
  primary key (league_id, user_id)
);

-- 2. Row-level security --------------------------------------------------------
-- Helper lookups run as the function owner so the policies below don't recurse
-- into each other (same trick as my_leaderboard_league() in leaderboard_secure.sql).
create or replace function public._league_is_member(p_league uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.custom_league_members
     where league_id = p_league and user_id = auth.uid() and status = 'active'
  );
$$;

create or replace function public._league_has_invite(p_league uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.custom_league_invites
     where league_id = p_league and invitee_id = auth.uid() and status = 'pending'
  );
$$;

revoke all on function public._league_is_member(uuid) from public, anon;
revoke all on function public._league_has_invite(uuid) from public, anon;
grant execute on function public._league_is_member(uuid) to authenticated;
grant execute on function public._league_has_invite(uuid) to authenticated;

alter table public.custom_leagues enable row level security;
alter table public.custom_league_members enable row level security;
alter table public.custom_league_invites enable row level security;
alter table public.custom_league_baselines enable row level security; -- no policies: nobody reads it directly

drop policy if exists "League visible to owner, members and invitees" on public.custom_leagues;
create policy "League visible to owner, members and invitees"
  on public.custom_leagues for select
  to authenticated
  using (owner_id = auth.uid() or public._league_is_member(id) or public._league_has_invite(id));

drop policy if exists "Membership visible to the league and to yourself" on public.custom_league_members;
create policy "Membership visible to the league and to yourself"
  on public.custom_league_members for select
  to authenticated
  using (user_id = auth.uid() or public._league_is_member(league_id));

drop policy if exists "Invites visible to sender and recipient" on public.custom_league_invites;
create policy "Invites visible to sender and recipient"
  on public.custom_league_invites for select
  to authenticated
  using (invitee_id = auth.uid() or inviter_id = auth.uid());

revoke all on public.custom_leagues, public.custom_league_members,
              public.custom_league_invites, public.custom_league_baselines from anon;
revoke all on public.custom_league_baselines from authenticated;
revoke insert, update, delete on public.custom_leagues, public.custom_league_members,
              public.custom_league_invites from authenticated;
grant select on public.custom_leagues, public.custom_league_members,
                public.custom_league_invites to authenticated;

-- 3. Internal helpers (not callable by clients) ---------------------------------
create or replace function public._are_friends(a uuid, b uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.friendships
     where status = 'accepted'
       and least(requester_id, addressee_id) = least(a, b)
       and greatest(requester_id, addressee_id) = greatest(a, b)
  );
$$;

-- Is a student-controlled field public? Reads the optional public_profile
-- settings (share_cards.sql) without requiring that column to exist.
-- Name and photo default to public, as everywhere else.
create or replace function public._league_show(p public.profiles, k text)
returns boolean
language sql
immutable
as $$
  select coalesce(
    case when jsonb_typeof(to_jsonb(p) #> array['public_profile', 'show', k]) = 'boolean'
         then (to_jsonb(p) #>> array['public_profile', 'show', k])::boolean end,
    true
  );
$$;

create or replace function public._league_xp(p_mode text, p_weekly integer, p_lifetime integer, p_baseline integer)
returns integer
language sql
immutable
as $$
  select case when p_mode = 'ongoing'
              then greatest(coalesce(p_lifetime, 0) - coalesce(p_baseline, 0), 0)
              else coalesce(p_weekly, 0) end;
$$;

-- The standings of one league (active members only), ranked by XP; ties share a rank.
create or replace function public._league_board(p_league uuid)
returns table (user_id uuid, name text, avatar_path text, xp integer, rank integer, joined_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, s.name, s.avatar_path, s.xp, (rank() over (order by s.xp desc))::integer, s.joined_at
    from (
      select m.user_id,
             case when public._league_show(p, 'name') then p.name end as name,
             case when public._league_show(p, 'avatar') then to_jsonb(p) ->> 'avatar_path' end as avatar_path,
             public._league_xp(l.mode, p.weekly_xp, p.lifetime_xp, b.baseline_xp) as xp,
             m.joined_at
        from public.custom_league_members m
        join public.custom_leagues l on l.id = m.league_id
        join public.profiles p on p.id = m.user_id
        left join public.custom_league_baselines b
               on b.league_id = m.league_id and b.user_id = m.user_id
       where m.league_id = p_league and m.status = 'active'
    ) s;
$$;

revoke all on function public._are_friends(uuid, uuid) from public, anon, authenticated;
revoke all on function public._league_show(public.profiles, text) from public, anon, authenticated;
revoke all on function public._league_xp(text, integer, integer, integer) from public, anon, authenticated;
revoke all on function public._league_board(uuid) from public, anon, authenticated;

-- 4. Actions (the ONLY way anything changes) --------------------------------------
-- Errors are short codes the website turns into friendly text:
--   not_found, forbidden, invalid_name, invalid_description, invalid_mode,
--   owned_limit, joined_limit, league_full, self_invite, not_friends,
--   already_member, already_invited, invite_cooldown, not_pending,
--   owner_cannot_leave, cannot_remove_owner, too_many_invitees

create or replace function public.create_custom_league(
  p_name text,
  p_description text default null,
  p_mode text default 'weekly',
  p_invitees uuid[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  nm text := btrim(coalesce(p_name, ''));
  ds text := nullif(btrim(coalesce(p_description, '')), '');
  invitees uuid[];
  lid uuid;
  u uuid;
  n integer;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  if char_length(nm) < 3 or char_length(nm) > 40 then
    raise exception 'invalid_name';
  end if;
  if ds is not null and char_length(ds) > 200 then
    raise exception 'invalid_description';
  end if;
  if p_mode is null or p_mode not in ('weekly', 'ongoing') then
    raise exception 'invalid_mode';
  end if;

  select count(*) into n from public.custom_leagues where owner_id = me;
  if n >= 5 then raise exception 'owned_limit'; end if;
  select count(*) into n from public.custom_league_members where user_id = me and status = 'active';
  if n >= 10 then raise exception 'joined_limit'; end if;

  invitees := coalesce(array(select distinct x from unnest(coalesce(p_invitees, '{}')) x where x is not null), '{}');
  if me = any (invitees) then raise exception 'self_invite'; end if;
  if cardinality(invitees) > 19 then raise exception 'too_many_invitees'; end if;
  foreach u in array invitees loop
    if not public._are_friends(me, u) then raise exception 'not_friends'; end if;
  end loop;

  insert into public.custom_leagues (name, description, owner_id, mode)
  values (nm, ds, me, p_mode)
  returning id into lid;

  insert into public.custom_league_members (league_id, user_id) values (lid, me);
  insert into public.custom_league_baselines (league_id, user_id, baseline_xp)
  select lid, me, coalesce(lifetime_xp, 0) from public.profiles where id = me;

  foreach u in array invitees loop
    insert into public.custom_league_invites (league_id, inviter_id, invitee_id) values (lid, me, u);
  end loop;

  return jsonb_build_object('id', lid);
end;
$$;

create or replace function public.invite_to_custom_league(p_league uuid, p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  l public.custom_leagues;
  inv public.custom_league_invites;
  n integer;
  iid uuid;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  select * into l from public.custom_leagues where id = p_league for update;
  if not found or not exists (
    select 1 from public.custom_league_members where league_id = p_league and user_id = me and status = 'active'
  ) then
    raise exception 'not_found';
  end if;
  if l.owner_id <> me then raise exception 'forbidden'; end if;

  if p_user is null or p_user = me then raise exception 'self_invite'; end if;
  if not public._are_friends(me, p_user) then raise exception 'not_friends'; end if;
  if exists (
    select 1 from public.custom_league_members where league_id = p_league and user_id = p_user and status = 'active'
  ) then
    raise exception 'already_member';
  end if;

  select * into inv from public.custom_league_invites where league_id = p_league and invitee_id = p_user;
  if found then
    if inv.status = 'pending' then raise exception 'already_invited'; end if;
    if inv.status = 'declined' and inv.responded_at > now() - interval '7 days' then
      raise exception 'invite_cooldown';
    end if;
  end if;

  select (select count(*) from public.custom_league_members where league_id = p_league and status = 'active')
       + (select count(*) from public.custom_league_invites where league_id = p_league and status = 'pending')
    into n;
  if n >= 20 then raise exception 'league_full'; end if;

  if found then
    update public.custom_league_invites
       set status = 'pending', inviter_id = me, created_at = now(), responded_at = null
     where id = inv.id
     returning id into iid;
  else
    insert into public.custom_league_invites (league_id, inviter_id, invitee_id)
    values (p_league, me, p_user)
    returning id into iid;
  end if;

  return jsonb_build_object('invite_id', iid, 'status', 'pending');
end;
$$;

create or replace function public.respond_league_invite(p_invite uuid, p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  inv public.custom_league_invites;
  n integer;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  select * into inv from public.custom_league_invites where id = p_invite for update;
  if not found or inv.invitee_id <> me then raise exception 'not_found'; end if;
  if inv.status <> 'pending' then raise exception 'not_pending'; end if;

  perform 1 from public.custom_leagues where id = inv.league_id for update;

  if not p_accept then
    update public.custom_league_invites set status = 'declined', responded_at = now() where id = inv.id;
    return jsonb_build_object('status', 'declined');
  end if;

  select count(*) into n from public.custom_league_members where league_id = inv.league_id and status = 'active';
  if n >= 20 then raise exception 'league_full'; end if;
  select count(*) into n from public.custom_league_members where user_id = me and status = 'active';
  if n >= 10 then raise exception 'joined_limit'; end if;

  update public.custom_league_invites set status = 'accepted', responded_at = now() where id = inv.id;

  insert into public.custom_league_members (league_id, user_id, status, joined_at)
  values (inv.league_id, me, 'active', now())
  on conflict (league_id, user_id)
  do update set status = 'active', joined_at = now();

  insert into public.custom_league_baselines (league_id, user_id, baseline_xp)
  select inv.league_id, me, coalesce(lifetime_xp, 0) from public.profiles where id = me
  on conflict (league_id, user_id) do update set baseline_xp = excluded.baseline_xp;

  return jsonb_build_object('status', 'joined', 'league_id', inv.league_id);
end;
$$;

create or replace function public.cancel_league_invite(p_invite uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  inv public.custom_league_invites;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  select * into inv from public.custom_league_invites where id = p_invite for update;
  if not found or inv.inviter_id <> me then raise exception 'not_found'; end if;
  if inv.status <> 'pending' then raise exception 'not_pending'; end if;
  update public.custom_league_invites set status = 'cancelled', responded_at = now() where id = inv.id;
  return jsonb_build_object('status', 'cancelled');
end;
$$;

create or replace function public.leave_custom_league(p_league uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  l public.custom_leagues;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  select * into l from public.custom_leagues where id = p_league;
  if not found or not exists (
    select 1 from public.custom_league_members where league_id = p_league and user_id = me and status = 'active'
  ) then
    raise exception 'not_found';
  end if;
  if l.owner_id = me then raise exception 'owner_cannot_leave'; end if;
  update public.custom_league_members set status = 'left' where league_id = p_league and user_id = me;
  return jsonb_build_object('status', 'left');
end;
$$;

create or replace function public.remove_league_member(p_league uuid, p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  l public.custom_leagues;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  select * into l from public.custom_leagues where id = p_league for update;
  if not found or not exists (
    select 1 from public.custom_league_members where league_id = p_league and user_id = me and status = 'active'
  ) then
    raise exception 'not_found';
  end if;
  if l.owner_id <> me then raise exception 'forbidden'; end if;
  if p_user = l.owner_id then raise exception 'cannot_remove_owner'; end if;
  update public.custom_league_members set status = 'removed'
   where league_id = p_league and user_id = p_user and status = 'active';
  if not found then raise exception 'not_found'; end if;
  return jsonb_build_object('status', 'removed');
end;
$$;

create or replace function public.update_custom_league(p_league uuid, p_name text, p_description text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  nm text := btrim(coalesce(p_name, ''));
  ds text := nullif(btrim(coalesce(p_description, '')), '');
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  if char_length(nm) < 3 or char_length(nm) > 40 then raise exception 'invalid_name'; end if;
  if ds is not null and char_length(ds) > 200 then raise exception 'invalid_description'; end if;
  if not exists (select 1 from public.custom_leagues where id = p_league and owner_id = me) then
    raise exception 'not_found';
  end if;
  update public.custom_leagues set name = nm, description = ds where id = p_league;
  return jsonb_build_object('status', 'updated');
end;
$$;

create or replace function public.delete_custom_league(p_league uuid)
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
  delete from public.custom_leagues where id = p_league and owner_id = me;
  if not found then raise exception 'not_found'; end if;
  return jsonb_build_object('status', 'deleted');
end;
$$;

-- 5. Reads --------------------------------------------------------------------------
create or replace function public.get_my_custom_leagues()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  return coalesce((
    select jsonb_agg(s.row_json order by s.created_at desc)
      from (
        select l.created_at,
               jsonb_build_object(
                 'id', l.id,
                 'name', l.name,
                 'description', l.description,
                 'mode', l.mode,
                 'owner_id', l.owner_id,
                 'is_owner', l.owner_id = me,
                 'created_at', l.created_at,
                 'owner_name', case when public._league_show(o, 'name') then o.name end,
                 'member_count', (select count(*) from public.custom_league_members x
                                   where x.league_id = l.id and x.status = 'active'),
                 'my_rank', (select b.rank from public._league_board(l.id) b where b.user_id = me),
                 'my_xp', (select b.xp from public._league_board(l.id) b where b.user_id = me)
               ) as row_json
          from public.custom_leagues l
          join public.custom_league_members m
            on m.league_id = l.id and m.user_id = me and m.status = 'active'
          join public.profiles o on o.id = l.owner_id
      ) s
  ), '[]'::jsonb);
end;
$$;

create or replace function public.get_my_league_invites()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  return coalesce((
    select jsonb_agg(s.row_json order by s.created_at desc)
      from (
        select i.created_at,
               jsonb_build_object(
                 'invite_id', i.id,
                 'league_id', l.id,
                 'league_name', l.name,
                 'description', l.description,
                 'mode', l.mode,
                 'member_count', (select count(*) from public.custom_league_members x
                                   where x.league_id = l.id and x.status = 'active'),
                 'inviter_id', p.id,
                 'inviter_name', case when public._league_show(p, 'name') then p.name end,
                 'inviter_avatar_path', case when public._league_show(p, 'avatar') then to_jsonb(p) ->> 'avatar_path' end,
                 'created_at', i.created_at
               ) as row_json
          from public.custom_league_invites i
          join public.custom_leagues l on l.id = i.league_id
          join public.profiles p on p.id = i.inviter_id
         where i.invitee_id = me and i.status = 'pending'
      ) s
  ), '[]'::jsonb);
end;
$$;

-- One league: only for its active members (anyone else gets null, the same answer
-- as for a league that doesn't exist). The pending-invite list is owner-only.
create or replace function public.get_custom_league(p_league uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  me uuid := auth.uid();
  l public.custom_leagues;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  select * into l from public.custom_leagues where id = p_league;
  if not found or not exists (
    select 1 from public.custom_league_members where league_id = p_league and user_id = me and status = 'active'
  ) then
    return null;
  end if;

  return jsonb_build_object(
    'league', jsonb_build_object(
      'id', l.id,
      'name', l.name,
      'description', l.description,
      'mode', l.mode,
      'owner_id', l.owner_id,
      'is_owner', l.owner_id = me,
      'created_at', l.created_at,
      'max_members', 20
    ),
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
               'user_id', b.user_id,
               'name', b.name,
               'avatar_path', b.avatar_path,
               'xp', b.xp,
               'rank', b.rank,
               'joined_at', b.joined_at,
               'is_owner', b.user_id = l.owner_id
             ) order by b.rank, b.joined_at)
        from public._league_board(p_league) b
    ), '[]'::jsonb),
    'pending', case when l.owner_id = me then coalesce((
      select jsonb_agg(jsonb_build_object(
               'invite_id', i.id,
               'user_id', p.id,
               'name', case when public._league_show(p, 'name') then p.name end,
               'avatar_path', case when public._league_show(p, 'avatar') then to_jsonb(p) ->> 'avatar_path' end,
               'created_at', i.created_at
             ) order by i.created_at)
        from public.custom_league_invites i
        join public.profiles p on p.id = i.invitee_id
       where i.league_id = p_league and i.status = 'pending'
    ), '[]'::jsonb) else '[]'::jsonb end
  );
end;
$$;

do $$
declare
  f text;
begin
  foreach f in array array[
    'create_custom_league(text, text, text, uuid[])',
    'invite_to_custom_league(uuid, uuid)',
    'respond_league_invite(uuid, boolean)',
    'cancel_league_invite(uuid)',
    'leave_custom_league(uuid)',
    'remove_league_member(uuid, uuid)',
    'update_custom_league(uuid, text, text)',
    'delete_custom_league(uuid)',
    'get_my_custom_leagues()',
    'get_my_league_invites()',
    'get_custom_league(uuid)'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;

-- 6. Realtime ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;
  end if;
  foreach t in array array['custom_leagues', 'custom_league_members', 'custom_league_invites'] loop
    if not exists (
      select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
