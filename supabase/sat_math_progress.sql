-- ScholarCompass: SAT Math exercise history + a safe read path for a
-- student's own SAT Math 1v1 answers.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Independent of the other migrations — order doesn't matter.
--
-- WHY THIS EXISTS
-- SatMathExercisesPage (src/pages/SatMathExercisesPage.jsx) saved nothing
-- at all — every answer lived only in React state and vanished on
-- navigation. That's the same gap ielts_exercise_attempts fixed for IELTS
-- Reading exercises, fixed here for SAT Math. It also feeds the SAT
-- progress tracker and weak-area diagnosis (both need a real answer
-- history, not just "did they ever get this one right").
--
-- sat_math_match_answers (the SAT Math 1v1 answer log) already exists
-- with real per-question correctness, but deliberately has NO select
-- policy at all ("functions only" — see supabase/sat_math_1v1_schema.sql)
-- so even the two players in a match can't read it directly. This adds
-- ONE narrow read path: a student's own answers, and only their own.

-- 1. SAT Math exercise attempts ---------------------------------------------
create table if not exists public.sat_math_exercise_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  question_id text not null,
  domain text not null,
  topic text,
  difficulty text,
  correct boolean not null,
  answer text,
  created_at timestamptz not null default now()
);

create index if not exists sat_math_exercise_attempts_user_idx
  on public.sat_math_exercise_attempts (user_id, created_at desc);

alter table public.sat_math_exercise_attempts enable row level security;

drop policy if exists "Users can view their own SAT Math exercise attempts" on public.sat_math_exercise_attempts;
create policy "Users can view their own SAT Math exercise attempts"
  on public.sat_math_exercise_attempts for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own SAT Math exercise attempts" on public.sat_math_exercise_attempts;
create policy "Users can insert their own SAT Math exercise attempts"
  on public.sat_math_exercise_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 2. A student's own SAT Math 1v1 answer history -----------------------------
-- Domain/topic per question live only in src/data/satMathQuestions.js (not
-- duplicated into SQL, to avoid a second copy of that taxonomy going stale
-- the way the answer-key file already warns about) — the frontend merges
-- this with that file's metadata. This function only ever filters by the
-- CALLER's own auth.uid(), regardless of which match_id is asked about, so
-- it can't be used to read an opponent's answers.
create or replace function public.get_my_sat_math_answers()
returns table (
  match_id uuid,
  question_id text,
  is_correct boolean,
  answered_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select a.match_id, a.question_id, a.is_correct, a.answered_at
    from public.sat_math_match_answers a
   where a.user_id = auth.uid();
$$;

revoke all on function public.get_my_sat_math_answers() from public;
revoke all on function public.get_my_sat_math_answers() from anon;
grant execute on function public.get_my_sat_math_answers() to authenticated;
