-- Undo supabase/study_planner.sql. Drops ONLY objects created by it.
-- Study plans, tasks and planner preferences are deleted; profiles, exercise
-- history and every other table are untouched. The profile fields the setup
-- form wrote (targets, exam dates, preparing-for flags) stay as the student
-- left them.
drop function if exists public.dismiss_study_invite(integer);
drop function if exists public.set_study_task_done(uuid, boolean);
drop function if exists public.save_study_plan(date, jsonb, boolean, date);
drop function if exists public.save_study_preferences(jsonb, boolean);
drop table if exists public.study_tasks;
drop table if exists public.study_plans;
drop table if exists public.study_preferences;
drop function if exists public._valid_band(numeric);
drop function if exists public.planner_current_version();
