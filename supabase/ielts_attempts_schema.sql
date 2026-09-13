-- ScholarCompass IELTS mock test attempts
-- Run this once in Supabase SQL Editor. Safe to run more than once.

create table if not exists public.ielts_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  test_id text not null,
  test_title text,
  raw_score integer,
  band numeric,
  by_type jsonb,
  by_passage jsonb,
  completed_at timestamp with time zone default now()
);

alter table public.ielts_attempts enable row level security;

drop policy if exists "Users can view their own attempts" on public.ielts_attempts;
create policy "Users can view their own attempts"
  on public.ielts_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own attempts" on public.ielts_attempts;
create policy "Users can insert their own attempts"
  on public.ielts_attempts for insert
  with check (auth.uid() = user_id);
