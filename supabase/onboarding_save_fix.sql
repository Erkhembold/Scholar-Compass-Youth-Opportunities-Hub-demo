-- ScholarCompass: fix for first-run onboarding answers not being saved.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- WHAT WAS WRONG
-- The onboarding page saved everything with ONE update of the profiles row
-- and ignored the result. If any single part failed (a column that was never
-- created, a target score the database rejects, a profile row that did not
-- exist) the whole save was lost silently and "Skip" failed the same way, so
-- the person could be stuck on the onboarding page.
--
-- WHAT THIS DOES
--  1. Makes sure every column onboarding writes to exists.
--  2. Creates a profile row for any signed-up user who somehow has none.
--  3. Adds complete_onboarding(): one safe database call that checks the
--     values, creates the profile row if needed, saves the answers and marks
--     onboarding done together.
--  4. Re-creates handle_new_user() (same body as onboarding.sql plus
--     "on conflict do nothing") so it stays in sync with the other copies.

-- 1. Columns -----------------------------------------------------------------
alter table public.profiles add column if not exists onboarding_completed boolean not null default true;
alter table public.profiles add column if not exists grade text;
alter table public.profiles add column if not exists intended_major text;
alter table public.profiles add column if not exists intended_countries text[];
alter table public.profiles add column if not exists preparing_for_sat boolean;
alter table public.profiles add column if not exists preparing_for_ielts boolean;
alter table public.profiles add column if not exists sat_target_date date;
alter table public.profiles add column if not exists ielts_target_date date;
alter table public.profiles add column if not exists sat_target_score integer
  check (sat_target_score is null or sat_target_score between 400 and 1600);
alter table public.profiles add column if not exists ielts_target_score numeric(2,1)
  check (
    ielts_target_score is null
    or (ielts_target_score between 1 and 9
        and (ielts_target_score * 2) = floor(ielts_target_score * 2))
  );

-- 2. Missing profile rows ----------------------------------------------------
-- Marked as already onboarded (the column default) so nobody is pushed
-- through onboarding by this repair.
insert into public.profiles (id, name, email)
select u.id,
       coalesce(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name'),
       u.email
  from auth.users u
 where not exists (select 1 from public.profiles p where p.id = u.id);

-- 3. One call that saves the onboarding answers ------------------------------
create or replace function public.complete_onboarding(
  p_grade        text    default null,
  p_countries    text[]  default null,
  p_major        text    default null,
  p_prep_sat     boolean default null,
  p_sat_target   integer default null,
  p_prep_ielts   boolean default null,
  p_ielts_target numeric default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  sat_ok   integer;
  ielts_ok numeric(2,1);
begin
  if me is null then
    raise exception 'Not signed in.';
  end if;

  -- A target only counts if the student is preparing for that test and the
  -- number is valid; anything else is stored as "not set" instead of making
  -- the whole save fail.
  sat_ok := case when p_prep_sat is true and p_sat_target between 400 and 1600
                 then p_sat_target end;
  ielts_ok := case when p_prep_ielts is true
                        and p_ielts_target between 1 and 9
                        and (p_ielts_target * 2) = floor(p_ielts_target * 2)
                   then p_ielts_target end;

  insert into public.profiles (
    id, name, email, grade, intended_countries, intended_major,
    preparing_for_sat, sat_target_score, preparing_for_ielts, ielts_target_score,
    onboarding_completed
  )
  select u.id,
         coalesce(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name'),
         u.email,
         nullif(btrim(p_grade), ''),
         case when coalesce(array_length(p_countries, 1), 0) > 0 then p_countries end,
         nullif(btrim(p_major), ''),
         p_prep_sat, sat_ok, p_prep_ielts, ielts_ok,
         true
    from auth.users u
   where u.id = me
  on conflict (id) do update set
    grade                = excluded.grade,
    intended_countries   = excluded.intended_countries,
    intended_major       = excluded.intended_major,
    preparing_for_sat    = excluded.preparing_for_sat,
    sat_target_score     = excluded.sat_target_score,
    preparing_for_ielts  = excluded.preparing_for_ielts,
    ielts_target_score   = excluded.ielts_target_score,
    onboarding_completed = true;
end;
$$;

revoke all on function public.complete_onboarding(text, text[], text, boolean, integer, boolean, numeric) from public;
revoke all on function public.complete_onboarding(text, text[], text, boolean, integer, boolean, numeric) from anon;
grant execute on function public.complete_onboarding(text, text[], text, boolean, integer, boolean, numeric) to authenticated;

-- 4. New-user trigger (kept identical to onboarding.sql + the Google fallback)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, onboarding_completed)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email,
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
