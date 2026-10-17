-- ScholarCompass: XP for IELTS Reading exercises and SAT Math exercises.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Needs leaderboard_schema.sql (profiles.weekly_xp / lifetime_xp) and the
-- two attempt tables (streaks_and_exercise_history.sql, sat_math_progress.sql).
--
-- WHY THIS EXISTS
-- SAT Reading & Writing awards 5 XP in the browser, but the IELTS Reading
-- exercises and the SAT Math exercises saved attempts and awarded nothing.
-- Doing it in the database (a trigger on the attempt tables) means:
--   * no front-end change is needed,
--   * XP is only ever added when a real attempt row is saved,
--   * the amounts live in ONE place, the two functions' constants below.
--
-- RULES
--   SAT Math exercise : 5 XP the FIRST time a question is answered correctly
--                       (same as SAT Reading & Writing).
--   IELTS Reading     : 10 XP the FIRST time an exercise is answered
--                       correctly (all statements right for True/False/Not
--                       Given). Retrying a solved one earns nothing.
-- Wrong answers and repeat correct answers never award XP, so the same
-- question cannot be farmed.
-- To change a reward, edit the number marked "XP AMOUNT" and re-run this.

-- 1. Shared helper: add XP to one student -----------------------------------
create or replace function public._add_xp(p_uid uuid, p_amount integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set weekly_xp   = coalesce(weekly_xp, 0)   + p_amount,
         lifetime_xp = coalesce(lifetime_xp, 0) + p_amount
   where id = p_uid
     and p_amount > 0;
$$;

-- Internal only: the trigger functions below call it; nobody else may.
revoke all on function public._add_xp(uuid, integer) from public;
revoke all on function public._add_xp(uuid, integer) from anon;
revoke all on function public._add_xp(uuid, integer) from authenticated;

-- 2. SAT Math exercises ------------------------------------------------------
create or replace function public.award_sat_math_exercise_xp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  xp_amount constant integer := 5;   -- XP AMOUNT (SAT Math, per question)
begin
  if new.correct is not true then
    return new;
  end if;

  -- Serialise double-submits of the same question by the same student.
  perform pg_advisory_xact_lock(hashtext(new.user_id::text || ':satmath:' || new.question_id));

  if not exists (
    select 1 from public.sat_math_exercise_attempts a
     where a.user_id = new.user_id
       and a.question_id = new.question_id
       and a.correct
       and a.id <> new.id
  ) then
    perform public._add_xp(new.user_id, xp_amount);
  end if;
  return new;
end;
$$;

revoke all on function public.award_sat_math_exercise_xp() from public;
revoke all on function public.award_sat_math_exercise_xp() from anon;
revoke all on function public.award_sat_math_exercise_xp() from authenticated;

drop trigger if exists award_sat_math_exercise_xp on public.sat_math_exercise_attempts;
create trigger award_sat_math_exercise_xp
  after insert on public.sat_math_exercise_attempts
  for each row execute function public.award_sat_math_exercise_xp();

-- 3. IELTS Reading exercises -------------------------------------------------
create or replace function public.award_ielts_exercise_xp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  xp_amount constant integer := 10;  -- XP AMOUNT (IELTS Reading, per exercise)
begin
  if new.correct is not true then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtext(new.user_id::text || ':ielts:' || new.exercise_id));

  if not exists (
    select 1 from public.ielts_exercise_attempts a
     where a.user_id = new.user_id
       and a.exercise_id = new.exercise_id
       and a.correct
       and a.id <> new.id
  ) then
    perform public._add_xp(new.user_id, xp_amount);
  end if;
  return new;
end;
$$;

revoke all on function public.award_ielts_exercise_xp() from public;
revoke all on function public.award_ielts_exercise_xp() from anon;
revoke all on function public.award_ielts_exercise_xp() from authenticated;

drop trigger if exists award_ielts_exercise_xp on public.ielts_exercise_attempts;
create trigger award_ielts_exercise_xp
  after insert on public.ielts_exercise_attempts
  for each row execute function public.award_ielts_exercise_xp();

-- 4. OPTIONAL, RUN AT MOST ONCE: give XP for answers saved before this ran --
-- Nothing above touches old answers. If you want students to get credit for
-- questions they already solved, select ONLY this block and run it ONE time.
-- (Running it twice would pay everyone twice, so it is commented out.)
--
-- update public.profiles p
--    set weekly_xp   = coalesce(p.weekly_xp, 0)   + x.xp,
--        lifetime_xp = coalesce(p.lifetime_xp, 0) + x.xp
--   from (
--     select user_id, sum(xp) as xp from (
--       select user_id, 5 as xp                      -- must match SAT Math amount
--         from public.sat_math_exercise_attempts
--        where correct group by user_id, question_id
--       union all
--       select user_id, 10 as xp                     -- must match IELTS amount
--         from public.ielts_exercise_attempts
--        where correct group by user_id, exercise_id
--     ) s group by user_id
--   ) x
--  where p.id = x.user_id;
