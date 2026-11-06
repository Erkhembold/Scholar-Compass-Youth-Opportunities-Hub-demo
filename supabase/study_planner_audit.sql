-- ScholarCompass: READ-ONLY audit of who needs the updated study-plan setup.
-- Run in the Supabase SQL Editor. It only SELECTs; it changes nothing.
-- Part A works before study_planner.sql has been run. Part B needs it.

-- A1. Headline counts from existing profile data -------------------------------
select
  count(*)                                                        as total_profiles,
  count(*) filter (where onboarding_completed)                    as marked_onboarded,
  count(*) filter (where not onboarding_completed)                as still_in_first_onboarding,
  count(*) filter (where preparing_for_sat is not null
                      or preparing_for_ielts is not null
                      or sat_target_score is not null
                      or ielts_target_score is not null
                      or sat_target_date is not null
                      or ielts_target_date is not null)           as has_some_goal_data,
  count(*) filter (where preparing_for_sat is null
                     and preparing_for_ielts is null
                     and sat_target_score is null
                     and ielts_target_score is null
                     and sat_target_date is null
                     and ielts_target_date is null)               as no_goal_data_at_all,
  count(*) filter (where sat_target_date is not null)             as has_sat_exam_date,
  count(*) filter (where ielts_target_date is not null)           as has_ielts_exam_date,
  count(*) filter (where sat_target_score is not null)            as has_sat_target,
  count(*) filter (where ielts_target_score is not null)          as has_ielts_target
from public.profiles;

-- A2. Existing exercise history (must be untouched by the planner) --------------
select 'sat_progress' as table_name, count(*) as rows, count(distinct user_id) as users from public.sat_progress
union all select 'sat_math_exercise_attempts', count(*), count(distinct user_id) from public.sat_math_exercise_attempts
union all select 'ielts_exercise_attempts', count(*), count(distinct user_id) from public.ielts_exercise_attempts
union all select 'ielts_attempts', count(*), count(distinct user_id) from public.ielts_attempts;

-- B. After study_planner.sql: classify every user ---------------------------------
-- complete = saved the updated setup (version >= 2)
-- partial  = a saved draft, or goal data from the first onboarding (shown pre-filled)
-- never    = nothing saved yet
-- select
--   case
--     when sp.onboarding_version >= 2 then 'complete'
--     when sp.user_id is not null and (sp.availability <> '{}'::jsonb or cardinality(sp.weak_areas) > 0
--          or sp.cur_sat is not null or sp.cur_ielts is not null or sp.intensity is not null) then 'partial'
--     when p.preparing_for_sat is not null or p.preparing_for_ielts is not null or p.sat_target_score is not null
--          or p.ielts_target_score is not null or p.sat_target_date is not null or p.ielts_target_date is not null then 'partial'
--     else 'never'
--   end as setup_state,
--   count(*) as users
-- from public.profiles p
-- left join public.study_preferences sp on sp.user_id = p.id
-- group by 1 order by 1;
