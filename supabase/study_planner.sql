-- ScholarCompass: Personal Study Planner + onboarding versioning (v2)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Purely ADDITIVE: it creates new tables and functions and adds nullable /
-- defaulted columns. It never updates, deletes or resets any existing row in
-- profiles, exercise history, XP or anything else. To undo it, run
-- supabase/study_planner_rollback.sql (drops only the objects created here).
--
-- WHAT EXISTS AFTER THIS
--  study_preferences  one row per student: onboarding version + timestamps,
--                     current scores, availability, intensity, weak areas.
--                     (Exam dates, SAT/IELTS targets and the "preparing for"
--                     flags stay in public.profiles where they already live;
--                     save_study_preferences() writes them there.)
--  study_plans        one plan per student per week (unique), never duplicated.
--  study_tasks        the daily tasks of a plan, each linked to a real exercise
--                     page, with completed_at.
--
-- HOW EXISTING USERS ARE RECOGNISED
--  "Completed the updated setup" means study_preferences.onboarding_version
--  >= planner_current_version() (2). Nobody has a row yet, so every existing
--  account counts as "not yet completed v2"; the app then reads their existing
--  profile answers to decide between "new" (nothing saved) and "partial"
--  (some answers exist, pre-filled for review). Nothing is changed for them
--  until they save the form themselves.
--
-- SECURITY
--  Row Level Security is on for all three tables and the only policy is
--  "SELECT where user_id = auth.uid()". Direct INSERT/UPDATE/DELETE is
--  revoked; all writes go through the SECURITY DEFINER functions below, which
--  only ever touch rows of auth.uid().

-- Columns this file relies on (already created by earlier migrations; no-ops
-- if present).
alter table public.profiles add column if not exists preparing_for_sat boolean;
alter table public.profiles add column if not exists preparing_for_ielts boolean;
alter table public.profiles add column if not exists sat_target_date date;
alter table public.profiles add column if not exists ielts_target_date date;
alter table public.profiles add column if not exists sat_target_score integer;
alter table public.profiles add column if not exists ielts_target_score numeric(2,1);

create or replace function public.planner_current_version()
returns integer language sql immutable as $$ select 2 $$;

create or replace function public._valid_band(b numeric)
returns boolean language sql immutable as $$
  select b is null or (b between 1 and 9 and (b * 2) = floor(b * 2))
$$;

-- 1. Preferences ---------------------------------------------------------------
create table if not exists public.study_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  onboarding_version integer not null default 0,
  onboarding_completed_at timestamptz,
  last_profile_reviewed_at timestamptz,
  invite_dismissed_until timestamptz,
  goals text[] not null default '{}',
  other_goal text check (other_goal is null or char_length(other_goal) <= 200),
  cur_sat integer check (cur_sat is null or cur_sat between 400 and 1600),
  cur_sat_math integer check (cur_sat_math is null or cur_sat_math between 200 and 800),
  cur_sat_rw integer check (cur_sat_rw is null or cur_sat_rw between 200 and 800),
  cur_ielts numeric(2,1) check (public._valid_band(cur_ielts)),
  cur_ielts_listening numeric(2,1) check (public._valid_band(cur_ielts_listening)),
  cur_ielts_reading numeric(2,1) check (public._valid_band(cur_ielts_reading)),
  cur_ielts_writing numeric(2,1) check (public._valid_band(cur_ielts_writing)),
  cur_ielts_speaking numeric(2,1) check (public._valid_band(cur_ielts_speaking)),
  tgt_ielts_listening numeric(2,1) check (public._valid_band(tgt_ielts_listening)),
  tgt_ielts_reading numeric(2,1) check (public._valid_band(tgt_ielts_reading)),
  tgt_ielts_writing numeric(2,1) check (public._valid_band(tgt_ielts_writing)),
  tgt_ielts_speaking numeric(2,1) check (public._valid_band(tgt_ielts_speaking)),
  -- minutes the student can study on each weekday, e.g. {"mon":45,"tue":0,...};
  -- 0 or missing = rest day
  availability jsonb not null default '{}'::jsonb,
  intensity text check (intensity is null or intensity in ('light', 'balanced', 'intensive')),
  session_minutes integer check (session_minutes is null or session_minutes between 10 and 120),
  weak_areas text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Plans and tasks -------------------------------------------------------------
create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null check (extract(isodow from week_start) = 1),
  generated_at timestamptz not null default now(),
  generated_with_version integer not null default 2,
  unique (user_id, week_start)
);

create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.study_plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_date date not null,
  position integer not null default 0,
  exam text not null check (exam in ('SAT', 'IELTS')),
  skill text not null check (char_length(skill) between 1 and 60),
  topic text not null check (char_length(topic) between 1 and 120),
  minutes integer not null check (minutes between 5 and 240),
  link_href text check (link_href is null or link_href ~ '^#/[A-Za-z0-9/_%.-]*$'),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists study_tasks_user_date_idx on public.study_tasks (user_id, task_date);
create index if not exists study_tasks_plan_idx on public.study_tasks (plan_id);

-- 3. Row Level Security ----------------------------------------------------------
alter table public.study_preferences enable row level security;
alter table public.study_plans enable row level security;
alter table public.study_tasks enable row level security;

drop policy if exists "study_preferences select own" on public.study_preferences;
create policy "study_preferences select own" on public.study_preferences
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "study_plans select own" on public.study_plans;
create policy "study_plans select own" on public.study_plans
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "study_tasks select own" on public.study_tasks;
create policy "study_tasks select own" on public.study_tasks
  for select to authenticated using (user_id = auth.uid());

-- Supabase grants new tables to anon/authenticated by default; take writes
-- (and all anonymous access) away. Writes go through the functions below.
revoke all on public.study_preferences, public.study_plans, public.study_tasks from anon;
revoke insert, update, delete, truncate on public.study_preferences, public.study_plans, public.study_tasks from authenticated;
grant select on public.study_preferences, public.study_plans, public.study_tasks to authenticated;

-- 4. Save preferences ------------------------------------------------------------
-- Only the keys present in `p` are written; a key that is absent keeps its
-- stored value, so skipping a question (or an older client) can never blank
-- anything. A key present with null/"" explicitly clears it.
-- Keys: goals, other_goal, cur_*, tgt_ielts_*, availability, intensity,
-- session_minutes, weak_areas, plus the profile fields prep_sat, prep_ielts,
-- sat_target, ielts_target, sat_date, ielts_date.
-- p_complete = true marks the updated setup as finished (version 2).
create or replace function public.save_study_preferences(p jsonb, p_complete boolean default false)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  d text;
  day_key text;
  day_val numeric;
begin
  if me is null then raise exception 'Not signed in.'; end if;
  if p is null or jsonb_typeof(p) <> 'object' then raise exception 'Invalid preferences.'; end if;

  if p ? 'availability' and jsonb_typeof(p->'availability') = 'object' then
    for day_key in select jsonb_object_keys(p->'availability') loop
      if day_key not in ('mon','tue','wed','thu','fri','sat','sun') then
        raise exception 'Unknown day: %', day_key;
      end if;
      day_val := nullif(p->'availability'->>day_key, '')::numeric;
      if day_val is not null and (day_val < 0 or day_val > 600) then
        raise exception 'Study time per day must be between 0 and 600 minutes.';
      end if;
    end loop;
  end if;
  if p ? 'intensity' and nullif(p->>'intensity','') is not null
     and (p->>'intensity') not in ('light','balanced','intensive') then
    raise exception 'Unknown workload.';
  end if;

  insert into public.study_preferences (user_id) values (me) on conflict (user_id) do nothing;

  update public.study_preferences s set
    goals = case when p ? 'goals' then coalesce(array(select jsonb_array_elements_text(p->'goals')), '{}') else s.goals end,
    other_goal = case when p ? 'other_goal' then nullif(btrim(p->>'other_goal'), '') else s.other_goal end,
    cur_sat = case when p ? 'cur_sat' then nullif(p->>'cur_sat','')::integer else s.cur_sat end,
    cur_sat_math = case when p ? 'cur_sat_math' then nullif(p->>'cur_sat_math','')::integer else s.cur_sat_math end,
    cur_sat_rw = case when p ? 'cur_sat_rw' then nullif(p->>'cur_sat_rw','')::integer else s.cur_sat_rw end,
    cur_ielts = case when p ? 'cur_ielts' then nullif(p->>'cur_ielts','')::numeric else s.cur_ielts end,
    cur_ielts_listening = case when p ? 'cur_ielts_listening' then nullif(p->>'cur_ielts_listening','')::numeric else s.cur_ielts_listening end,
    cur_ielts_reading = case when p ? 'cur_ielts_reading' then nullif(p->>'cur_ielts_reading','')::numeric else s.cur_ielts_reading end,
    cur_ielts_writing = case when p ? 'cur_ielts_writing' then nullif(p->>'cur_ielts_writing','')::numeric else s.cur_ielts_writing end,
    cur_ielts_speaking = case when p ? 'cur_ielts_speaking' then nullif(p->>'cur_ielts_speaking','')::numeric else s.cur_ielts_speaking end,
    tgt_ielts_listening = case when p ? 'tgt_ielts_listening' then nullif(p->>'tgt_ielts_listening','')::numeric else s.tgt_ielts_listening end,
    tgt_ielts_reading = case when p ? 'tgt_ielts_reading' then nullif(p->>'tgt_ielts_reading','')::numeric else s.tgt_ielts_reading end,
    tgt_ielts_writing = case when p ? 'tgt_ielts_writing' then nullif(p->>'tgt_ielts_writing','')::numeric else s.tgt_ielts_writing end,
    tgt_ielts_speaking = case when p ? 'tgt_ielts_speaking' then nullif(p->>'tgt_ielts_speaking','')::numeric else s.tgt_ielts_speaking end,
    availability = case when p ? 'availability' and jsonb_typeof(p->'availability') = 'object' then p->'availability' else s.availability end,
    intensity = case when p ? 'intensity' then nullif(p->>'intensity','') else s.intensity end,
    session_minutes = case when p ? 'session_minutes' then nullif(p->>'session_minutes','')::integer else s.session_minutes end,
    weak_areas = case when p ? 'weak_areas' then coalesce(array(select jsonb_array_elements_text(p->'weak_areas')), '{}') else s.weak_areas end,
    updated_at = now()
  where s.user_id = me;

  -- Fields that already live on the profile (same CHECK ranges as
  -- onboarding_save_fix.sql). Written only for keys present in p.
  update public.profiles pr set
    preparing_for_sat = case when p ? 'prep_sat' then (p->>'prep_sat')::boolean else pr.preparing_for_sat end,
    preparing_for_ielts = case when p ? 'prep_ielts' then (p->>'prep_ielts')::boolean else pr.preparing_for_ielts end,
    sat_target_score = case when p ? 'sat_target' then nullif(p->>'sat_target','')::integer else pr.sat_target_score end,
    ielts_target_score = case when p ? 'ielts_target' then nullif(p->>'ielts_target','')::numeric else pr.ielts_target_score end,
    sat_target_date = case when p ? 'sat_date' then nullif(p->>'sat_date','')::date else pr.sat_target_date end,
    ielts_target_date = case when p ? 'ielts_date' then nullif(p->>'ielts_date','')::date else pr.ielts_target_date end
  where pr.id = me;

  if p_complete then
    update public.study_preferences s set
      onboarding_version = greatest(s.onboarding_version, public.planner_current_version()),
      onboarding_completed_at = coalesce(s.onboarding_completed_at, now()),
      last_profile_reviewed_at = now(),
      invite_dismissed_until = null
    where s.user_id = me;
  else
    update public.study_preferences set last_profile_reviewed_at = now() where user_id = me;
  end if;
end;
$$;

-- 5. Save a week's plan ----------------------------------------------------------
-- p_tasks: [{task_date, exam, skill, topic, minutes, link_href}, ...]
-- * No plan for that week yet -> creates it with the tasks.
-- * A plan already exists and p_replace is false -> returns it, changes nothing
--   (so loading the homepage twice can never create a second plan).
-- * p_replace = true -> removes only tasks that are NOT completed and are dated
--   on/after p_from, then adds the new ones. Completed tasks and past days are
--   never touched.
create or replace function public.save_study_plan(
  p_week_start date,
  p_tasks jsonb,
  p_replace boolean default false,
  p_from date default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  plan uuid;
  t jsonb;
  n integer := 0;
  d date;
  from_d date := coalesce(p_from, p_week_start);
begin
  if me is null then raise exception 'Not signed in.'; end if;
  if p_week_start is null or extract(isodow from p_week_start) <> 1 then
    raise exception 'A plan week must start on a Monday.';
  end if;
  if p_tasks is null or jsonb_typeof(p_tasks) <> 'array' then raise exception 'Invalid tasks.'; end if;
  if jsonb_array_length(p_tasks) > 100 then raise exception 'Too many tasks.'; end if;

  -- Serialise concurrent saves for the same student/week.
  perform pg_advisory_xact_lock(hashtextextended(me::text || p_week_start::text, 0));

  select id into plan from public.study_plans where user_id = me and week_start = p_week_start;
  if plan is not null and not p_replace then
    return plan;
  end if;
  if plan is null then
    insert into public.study_plans (user_id, week_start, generated_with_version)
    values (me, p_week_start, public.planner_current_version())
    returning id into plan;
  else
    delete from public.study_tasks
     where plan_id = plan and user_id = me and completed_at is null and task_date >= from_d;
    update public.study_plans set generated_at = now(),
           generated_with_version = public.planner_current_version() where id = plan;
  end if;

  for t in select * from jsonb_array_elements(p_tasks) loop
    d := (t->>'task_date')::date;
    if d < p_week_start or d > p_week_start + 6 then
      raise exception 'Task date outside the plan week.';
    end if;
    if d < from_d then continue; end if;
    insert into public.study_tasks (plan_id, user_id, task_date, position, exam, skill, topic, minutes, link_href)
    values (plan, me, d, n, t->>'exam', t->>'skill', t->>'topic', (t->>'minutes')::integer, nullif(t->>'link_href',''));
    n := n + 1;
  end loop;
  return plan;
end;
$$;

-- 6. Tick / untick a task -------------------------------------------------------
create or replace function public.set_study_task_done(p_task uuid, p_done boolean)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  ts timestamptz;
begin
  if me is null then raise exception 'Not signed in.'; end if;
  update public.study_tasks
     set completed_at = case when p_done then coalesce(completed_at, now()) else null end
   where id = p_task and user_id = me
   returning completed_at into ts;
  if not found then raise exception 'Task not found.'; end if;
  return ts;
end;
$$;

-- 7. "Not now" on the setup invitation --------------------------------------------
-- Hides the full invitation for a few days; the planner keeps a small
-- "Set up my study plan" link until setup is completed.
create or replace function public.dismiss_study_invite(p_days integer default 3)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  until_ts timestamptz := now() + make_interval(days => greatest(1, least(coalesce(p_days, 3), 30)));
begin
  if me is null then raise exception 'Not signed in.'; end if;
  insert into public.study_preferences (user_id, invite_dismissed_until) values (me, until_ts)
  on conflict (user_id) do update set invite_dismissed_until = until_ts;
  return until_ts;
end;
$$;

revoke all on function public.save_study_preferences(jsonb, boolean) from public, anon;
revoke all on function public.save_study_plan(date, jsonb, boolean, date) from public, anon;
revoke all on function public.set_study_task_done(uuid, boolean) from public, anon;
revoke all on function public.dismiss_study_invite(integer) from public, anon;
grant execute on function public.save_study_preferences(jsonb, boolean) to authenticated;
grant execute on function public.save_study_plan(date, jsonb, boolean, date) to authenticated;
grant execute on function public.set_study_task_done(uuid, boolean) to authenticated;
grant execute on function public.dismiss_study_invite(integer) to authenticated;
