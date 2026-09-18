-- ScholarCompass SAT English practice progress
-- Run once in Supabase SQL Editor. Safe to run more than once.
-- One row per (user, question): whether they've ever gotten it right,
-- how many attempts, and when they first got it right. Categories are
-- scored as "mastered" client-side by counting correct=true rows.

create table if not exists public.sat_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  question_id text not null,
  category text not null,
  correct boolean not null default false,
  attempts integer not null default 0,
  first_correct_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.sat_progress enable row level security;

drop policy if exists "Users can view their own SAT progress" on public.sat_progress;
create policy "Users can view their own SAT progress"
  on public.sat_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own SAT progress" on public.sat_progress;
create policy "Users can insert their own SAT progress"
  on public.sat_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own SAT progress" on public.sat_progress;
create policy "Users can update their own SAT progress"
  on public.sat_progress for update
  using (auth.uid() = user_id);
