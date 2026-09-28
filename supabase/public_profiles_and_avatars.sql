-- ScholarCompass: public student profiles + profile pictures
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Run AFTER streaks_and_exercise_history.sql (it uses public.ub_today()).
--
-- WHAT OTHER STUDENTS CAN SEE ON YOUR PROFILE
--   name, profile picture, daily streak (current + longest), SAT target
--   score, IELTS target score. NOTHING ELSE. Never email, school, grade,
--   intended major, XP, league, saved opportunities or practice history.
--
-- HOW THAT IS ENFORCED
-- Row-level security limits which ROWS a query returns, not which
-- COLUMNS, so opening `profiles` to other users would expose email/school
-- to a raw REST call. (Same reason leaderboard_secure.sql uses a separate
-- table.) Instead `profiles` stays private to its owner, and other
-- students only get the fields above through ONE function,
-- get_public_profile(), which returns exactly those fields, only to signed-
-- in users, and only for one profile at a time (no "list everyone").
--
-- OPT-OUT: profiles.profile_visible (default true). When false, nobody else
-- can open that profile; the owner still can.

-- 1. New profile columns --------------------------------------------------
alter table public.profiles
  add column if not exists sat_target_score integer
  check (sat_target_score is null or sat_target_score between 400 and 1600);

-- IELTS bands come in halves: 5, 5.5, 6 ... 9
alter table public.profiles
  add column if not exists ielts_target_score numeric(2,1)
  check (
    ielts_target_score is null
    or (ielts_target_score between 1 and 9
        and (ielts_target_score * 2) = floor(ielts_target_score * 2))
  );

-- Path INSIDE the avatars bucket, e.g. '<user id>/avatar-1730000000.jpg'.
-- The check forces it to live in the owner's own folder, so nobody can
-- point their profile at another user's file or at an outside URL.
alter table public.profiles add column if not exists avatar_path text;
alter table public.profiles drop constraint if exists profiles_avatar_path_own_folder;
alter table public.profiles
  add constraint profiles_avatar_path_own_folder
  check (avatar_path is null or avatar_path like (id::text || '/%'));

alter table public.profiles add column if not exists profile_visible boolean not null default true;

-- 2. Profile pictures: Storage bucket + policies ---------------------------
-- Public bucket: pictures load in plain <img> tags. Only the owner can
-- add / replace / delete files, and only inside a folder named after their
-- own user id. Images only, max 2 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Signed-in users can read avatars" on storage.objects;
create policy "Signed-in users can read avatars"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can replace their own avatar" on storage.objects;
create policy "Users can replace their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. The only door to other students' profiles ------------------------------
-- Returns null when the profile doesn't exist OR its owner turned
-- visibility off (the two look identical on purpose). The streak is
-- returned already corrected for missed days (Ulaanbaatar time), so the
-- caller never sees last_activity_date.
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
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select id, name, avatar_path, current_streak, longest_streak,
         last_activity_date, sat_target_score, ielts_target_score, profile_visible
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

  return jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'avatar_path', p.avatar_path,
    'current_streak', eff,
    'longest_streak', greatest(p.longest_streak, eff),
    'sat_target_score', p.sat_target_score,
    'ielts_target_score', p.ielts_target_score
  );
end;
$$;

revoke all on function public.get_public_profile(uuid) from public;
revoke all on function public.get_public_profile(uuid) from anon;
grant execute on function public.get_public_profile(uuid) to authenticated;

-- 4. Show avatars on the leaderboard too -----------------------------------
-- leaderboard_secure.sql already mirrors name/league/XP/badges into
-- leaderboard_entries (a narrow table so league peers never see private
-- profile columns — see that file's comments). This adds avatar_path to
-- that same mirror, so a league-mate's photo can show up next to their
-- name without granting any wider access to their profile.
--
-- Guarded to do nothing if leaderboard_entries doesn't exist yet, so this
-- file works regardless of whether leaderboard_secure.sql has been run
-- before or after it.
do $$
begin
  if to_regclass('public.leaderboard_entries') is null then
    return;
  end if;

  alter table public.leaderboard_entries add column if not exists avatar_path text;

  create or replace function public.sync_leaderboard_entry()
  returns trigger as $f$
  begin
    insert into public.leaderboard_entries (id, name, current_league, weekly_xp, badges, avatar_path, updated_at)
    values (
      new.id,
      new.name,
      coalesce(new.current_league, 'bronze'),
      coalesce(new.weekly_xp, 0),
      coalesce(new.badges, '[]'::jsonb),
      new.avatar_path,
      now()
    )
    on conflict (id) do update set
      name = excluded.name,
      current_league = excluded.current_league,
      weekly_xp = excluded.weekly_xp,
      badges = excluded.badges,
      avatar_path = excluded.avatar_path,
      updated_at = now();
    return new;
  end;
  $f$ language plpgsql security definer set search_path = public;

  drop trigger if exists on_profile_change_sync_leaderboard on public.profiles;
  create trigger on_profile_change_sync_leaderboard
    after insert or update of name, current_league, weekly_xp, badges, avatar_path on public.profiles
    for each row execute procedure public.sync_leaderboard_entry();

  update public.leaderboard_entries le
     set avatar_path = p.avatar_path
    from public.profiles p
   where p.id = le.id
     and p.avatar_path is distinct from le.avatar_path;
end $$;
