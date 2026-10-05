-- Small robustness improvement for Google (and any future OAuth
-- provider) sign-ins. Run once in Supabase SQL Editor. Safe to re-run.
--
-- The existing handle_new_user() trigger (see profiles_schema.sql) reads
-- new.raw_user_meta_data->>'name' to fill in the new profile's name.
-- Google's identity data normally includes both 'name' and 'full_name'
-- with the same value, so this already works for Google sign-ins with
-- no changes needed. This migration just adds a fallback to 'full_name'
-- for the rare case a provider's response has one but not the other, so
-- a new Google/OAuth user is never left with a blank name. Existing
-- email/password sign-ups are unaffected — 'name' is always present for
-- them and still wins first.
-- IMPORTANT: this function is also defined in supabase/onboarding.sql,
-- which additionally sets onboarding_completed = false for every new
-- sign-up (so new users see the onboarding flow; existing users never
-- do — see that file's own comments for why). Because `create or replace
-- function` replaces the ENTIRE body, these two files must never drift
-- apart — whichever one is run LAST wins, and an older copy of either
-- would silently undo the other's fix. This copy includes both fixes so
-- it's safe to run in either order, or on its own.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, onboarding_completed)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email,
    false
  );
  return new;
end;
$$ language plpgsql security definer;
