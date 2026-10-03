-- ScholarCompass: new-user onboarding fields
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Independent of the other migrations.
--
-- THE CORE RULE: existing users must NOT be forced through onboarding;
-- only genuinely new sign-ups should see it.
--
-- HOW THAT'S ENFORCED
-- `onboarding_completed` is added with `default true`. In Postgres,
-- ALTER TABLE ... ADD COLUMN ... DEFAULT true back-fills that default
-- into every ROW THAT ALREADY EXISTS at the moment this runs — so every
-- current user is automatically marked as already onboarded, with no
-- separate UPDATE statement needed (and nothing here can accidentally
-- reset someone who already finished onboarding, since this only runs
-- once per fresh `ADD COLUMN`, safe to re-run because of `if not exists`).
--
-- Genuinely new sign-ups need the OPPOSITE: onboarding_completed = false.
-- That can't come from the column's own default (which exists precisely
-- to protect existing users), so it's set explicitly by
-- public.handle_new_user() — the trigger that fires exactly once per
-- brand-new auth.users row, for both email/password and Google sign-ups
-- alike (Google OAuth creates its account through the same auth.users
-- insert, firing the same trigger, so this needs no separate handling).

alter table public.profiles add column if not exists onboarding_completed boolean not null default true;
alter table public.profiles add column if not exists intended_countries text[];
alter table public.profiles add column if not exists preparing_for_sat boolean;
alter table public.profiles add column if not exists preparing_for_ielts boolean;
alter table public.profiles add column if not exists sat_target_date date;
alter table public.profiles add column if not exists ielts_target_date date;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, onboarding_completed)
  values (new.id, new.raw_user_meta_data->>'name', new.email, false);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition itself is unchanged (still fires once per new
-- auth.users row); only the function body above changed, so this
-- re-create is here purely so the file is self-contained and safe to
-- run standalone.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
