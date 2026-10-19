-- ScholarCompass: fix the white screen on Profile and Leaderboard.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- WHAT WAS WRONG
-- The weekly rollover (league_promotion.sql) used a different league ladder
-- than the app: it had "platinum" and "celestial", which the app does not
-- have. When the rollover promoted someone out of Gold it wrote "platinum"
-- into their profile, and the Profile and Leaderboard pages crashed on a
-- league they did not recognise.
--
-- WHAT THIS DOES
--  1. Puts the real ladder (same ids and order as the app) into league_order.
--  2. Repairs every profile and leaderboard row that holds an unknown league:
--       platinum  -> sapphire  (the league above Gold, as the promotion meant)
--       celestial -> diamond
--       anything else unknown or blank -> bronze
--     and fixes capital letters / stray spaces.
--  3. Adds a check so an unknown league can never be saved again.

-- 1. The correct ladder -----------------------------------------------------
create table if not exists public.league_order (
  league_id text primary key,
  order_num integer not null unique
);
delete from public.league_order where league_id is not null;
insert into public.league_order (league_id, order_num) values
  ('bronze', 0), ('silver', 1), ('gold', 2), ('sapphire', 3), ('ruby', 4),
  ('emerald', 5), ('amethyst', 6), ('pearl', 7), ('obsidian', 8), ('diamond', 9);

-- 2. Repair existing rows ----------------------------------------------------
-- (Drop the checks first so this can run again after step 3 exists.)
alter table public.profiles drop constraint if exists profiles_current_league_valid;
alter table public.leaderboard_entries drop constraint if exists leaderboard_entries_current_league_valid;

update public.profiles
   set current_league = case lower(btrim(current_league))
         when 'platinum'  then 'sapphire'
         when 'celestial' then 'diamond'
         else coalesce(
                (select o.league_id from public.league_order o
                  where o.league_id = lower(btrim(current_league))),
                'bronze')
       end
 where current_league is distinct from
       case lower(btrim(current_league))
         when 'platinum'  then 'sapphire'
         when 'celestial' then 'diamond'
         else coalesce(
                (select o.league_id from public.league_order o
                  where o.league_id = lower(btrim(current_league))),
                'bronze')
       end;

update public.leaderboard_entries
   set current_league = case lower(btrim(current_league))
         when 'platinum'  then 'sapphire'
         when 'celestial' then 'diamond'
         else coalesce(
                (select o.league_id from public.league_order o
                  where o.league_id = lower(btrim(current_league))),
                'bronze')
       end
 where current_league is distinct from
       case lower(btrim(current_league))
         when 'platinum'  then 'sapphire'
         when 'celestial' then 'diamond'
         else coalesce(
                (select o.league_id from public.league_order o
                  where o.league_id = lower(btrim(current_league))),
                'bronze')
       end;

-- 3. Never allow an unknown league again -------------------------------------
alter table public.profiles
  add constraint profiles_current_league_valid
  check (current_league is null or current_league in
    ('bronze','silver','gold','sapphire','ruby','emerald','amethyst','pearl','obsidian','diamond'));
alter table public.leaderboard_entries
  add constraint leaderboard_entries_current_league_valid
  check (current_league in
    ('bronze','silver','gold','sapphire','ruby','emerald','amethyst','pearl','obsidian','diamond'));
