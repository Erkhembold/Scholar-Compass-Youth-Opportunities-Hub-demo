-- ScholarCompass IELTS Writing Task 2 attempts
-- Run this once in the Supabase SQL Editor. Safe to run more than once.

create table if not exists public.writing_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  task_id text not null,
  task_title text,
  essay_text text not null,
  word_count integer,
  overall_band numeric,
  result jsonb,
  completed_at timestamp with time zone default now()
);

alter table public.writing_attempts enable row level security;

drop policy if exists "Users can view their own writing attempts" on public.writing_attempts;
create policy "Users can view their own writing attempts"
  on public.writing_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own writing attempts" on public.writing_attempts;
create policy "Users can insert their own writing attempts"
  on public.writing_attempts for insert
  with check (auth.uid() = user_id);
