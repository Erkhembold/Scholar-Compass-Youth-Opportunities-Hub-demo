-- ScholarCompass: daily streaks + IELTS exercise history
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- DAY CONVENTION
-- A "day" is a calendar day in Ulaanbaatar time (Asia/Ulaanbaatar, UTC+8,
-- no daylight saving) -- the same convention src/utils/deadline.js uses
-- for opportunity deadlines. The DATABASE decides what today is
-- (public.ub_today()), never the browser clock, so refreshing the page,
-- changing a device clock or switching time zones can't earn a streak day.
--
-- WHO CAN WRITE WHAT
-- * current_streak / longest_streak / last_activity_date on profiles can
--   only be changed by public.record_activity() (a trigger reverts any
--   direct client-side edit of those three columns).
-- * activity_log has NO insert/update/delete policy: rows can only be
--   created by record_activity(), and users can only read their own.
-- * ielts_exercise_attempts: users can insert and read their own rows.
--
-- HONEST LIMIT: answers are still checked in the browser (the question
-- banks ship in the JS bundle), so a determined user could call
-- record_activity() by hand. This stops accidental / trivial gaming
-- (refreshing, double events, editing profile columns, other users' data),
-- not a deliberate attacker. Real protection needs server-side grading.

-- 1. Streak columns on profiles ------------------------------------------
alter table public.profiles add column if not exists current_streak integer not null default 0;
alter table public.profiles add column if not exists longest_streak integer not null default 0;
alter table public.profiles add column if not exists last_activity_date date;

-- 2. "Today" in Ulaanbaatar ----------------------------------------------
create or replace function public.ub_today()
returns date
language sql
stable
as $$
  select (now() at time zone 'Asia/Ulaanbaatar')::date;
$$;

-- 3. Activity log (one row per user + activity type + item + day) --------
create table if not exists public.activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  activity_type text not null,
  ref_id text not null default '',
  activity_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, activity_type, ref_id, activity_date)
);

create index if not exists activity_log_user_date_idx
  on public.activity_log (user_id, activity_date desc);

alter table public.activity_log enable row level security;

drop policy if exists "Users can view their own activity" on public.activity_log;
create policy "Users can view their own activity"
  on public.activity_log for select
  to authenticated
  using (auth.uid() = user_id);

-- 4. Lock the streak columns against direct edits ------------------------
-- (The existing profiles update policy lets users edit their own row; this
-- trigger silently restores the streak columns unless the change comes
-- from record_activity(). Updates made from the SQL Editor / service role
-- have no user JWT (auth.uid() is null) and are left alone.)
create or replace function public.protect_streak_columns()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null
     and coalesce(current_setting('app.streak_write', true), '') <> '1' then
    new.current_streak := old.current_streak;
    new.longest_streak := old.longest_streak;
    new.last_activity_date := old.last_activity_date;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_streak_columns_trg on public.profiles;
create trigger protect_streak_columns_trg
  before update on public.profiles
  for each row execute procedure public.protect_streak_columns();

-- 5. The one function that moves a streak --------------------------------
create or replace function public.record_activity(p_type text, p_ref text default '')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  today date := public.ub_today();
  prof record;
  new_streak integer;
  new_longest integer;
  incremented boolean := false;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if p_type not in (
    'sat_question', 'ielts_exercise', 'ielts_mock',
    'ielts_writing', 'ielts_1v1', 'lesson'
  ) then
    raise exception 'unknown activity type';
  end if;

  -- Duplicate events (double clicks, retries, refreshes) hit the unique
  -- constraint and are ignored.
  insert into public.activity_log (user_id, activity_type, ref_id, activity_date)
  values (uid, p_type, left(coalesce(p_ref, ''), 120), today)
  on conflict do nothing;

  -- Row lock so two simultaneous activities can't both add a day.
  select current_streak, longest_streak, last_activity_date
    into prof
    from public.profiles
   where id = uid
   for update;

  if not found then
    raise exception 'profile not found';
  end if;

  if prof.last_activity_date = today then
    new_streak := prof.current_streak;                 -- already counted today
  elsif prof.last_activity_date = today - 1 then
    new_streak := prof.current_streak + 1;             -- consecutive day
    incremented := true;
  else
    new_streak := 1;                                   -- first ever, or missed a day
    incremented := true;
  end if;

  new_longest := greatest(prof.longest_streak, new_streak);

  if incremented then
    perform set_config('app.streak_write', '1', true);
    update public.profiles
       set current_streak = new_streak,
           longest_streak = new_longest,
           last_activity_date = today
     where id = uid;
  end if;

  return jsonb_build_object(
    'current_streak', new_streak,
    'longest_streak', new_longest,
    'last_activity_date', case when incremented then today else prof.last_activity_date end,
    'today', today,
    'incremented', incremented
  );
end;
$$;

revoke all on function public.record_activity(text, text) from public;
revoke all on function public.record_activity(text, text) from anon;
grant execute on function public.record_activity(text, text) to authenticated;

-- 6. IELTS exercise history ----------------------------------------------
-- One row per submitted answer in the short IELTS Reading exercises
-- (src/pages/IeltsExercisesPage.jsx). Repeat attempts are kept as history.
-- `skill` uses the same tags as READING_SKILL_TAGS (mc items carry their own
-- tag; tfng / matching / completion map to their question-type tag), so it
-- can feed a weak-area engine later.
create table if not exists public.ielts_exercise_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  exercise_id text not null,
  exercise_type text not null,
  skill text,
  difficulty text,
  correct boolean not null,
  items_total integer not null default 1,
  items_correct integer not null default 0,
  answer jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ielts_exercise_attempts_user_idx
  on public.ielts_exercise_attempts (user_id, created_at desc);

alter table public.ielts_exercise_attempts enable row level security;

drop policy if exists "Users can view their own exercise attempts" on public.ielts_exercise_attempts;
create policy "Users can view their own exercise attempts"
  on public.ielts_exercise_attempts for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own exercise attempts" on public.ielts_exercise_attempts;
create policy "Users can insert their own exercise attempts"
  on public.ielts_exercise_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);
