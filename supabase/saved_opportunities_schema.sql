-- ScholarCompass saved/bookmarked opportunities
-- Run once in Supabase SQL Editor. Safe to run more than once.
-- Opportunities themselves live in the site's static data (src/data/
-- opportunities.js), not in the database, so this table only stores which
-- opportunity IDs a user has saved — full details (title, category,
-- deadline, etc.) are looked up from that static data at render time.

create table if not exists public.saved_opportunities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  opportunity_id text not null,
  created_at timestamp with time zone default now(),
  unique (user_id, opportunity_id)
);

alter table public.saved_opportunities enable row level security;

drop policy if exists "Users can view their own saved opportunities" on public.saved_opportunities;
create policy "Users can view their own saved opportunities"
  on public.saved_opportunities for select
  using (auth.uid() = user_id);

drop policy if exists "Users can save opportunities" on public.saved_opportunities;
create policy "Users can save opportunities"
  on public.saved_opportunities for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can unsave their own opportunities" on public.saved_opportunities;
create policy "Users can unsave their own opportunities"
  on public.saved_opportunities for delete
  using (auth.uid() = user_id);
