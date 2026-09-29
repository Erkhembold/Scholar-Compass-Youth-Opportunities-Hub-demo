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
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;
