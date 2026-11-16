-- ScholarCompass: AI-assessed IELTS Writing (Task 1 + Task 2)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- Students can only READ their own assessments. Nothing in the browser can
-- insert or edit an assessment or a score: the `evaluate-essay` edge function
-- writes them with the service role after authenticating the user, so scores
-- can't be tampered with and API usage can't be bypassed.

create table if not exists public.writing_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  request_id uuid not null,                 -- client-generated; makes retries safe
  task_id text not null,
  task_type text not null check (task_type in ('task1', 'task2')),
  task_title text,
  task_prompt text not null,
  essay_text text not null,
  word_count integer not null,
  essay_hash text not null,                 -- sha-256 of normalised essay; avoids re-paying for identical submissions
  duration_seconds integer,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  overall_band numeric(2,1),
  band_task numeric(2,1),                   -- Task Achievement (Task 1) / Task Response (Task 2)
  band_coherence numeric(2,1),
  band_lexical numeric(2,1),
  band_grammar numeric(2,1),
  result jsonb,                             -- full validated feedback (Mongolian)
  provider text,
  model text,
  prompt_version text,
  input_tokens integer,
  output_tokens integer,
  est_cost_usd numeric(10,5),
  latency_ms integer,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, request_id)
);

-- At most ONE evaluation in flight per student (duplicate-request protection).
create unique index if not exists writing_assessments_one_pending
  on public.writing_assessments (user_id) where status = 'pending';

create index if not exists writing_assessments_user_created
  on public.writing_assessments (user_id, created_at desc);

alter table public.writing_assessments enable row level security;

drop policy if exists "Students read their own writing assessments" on public.writing_assessments;
create policy "Students read their own writing assessments"
  on public.writing_assessments for select
  to authenticated
  using (auth.uid() = user_id);
-- (no insert / update / delete policies on purpose)

-- AI usage + cost log. Only the service role (the edge function) can touch it.
create table if not exists public.ai_usage_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete set null,
  feature text not null,
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  est_cost_usd numeric(10,5),
  latency_ms integer,
  status text not null,                     -- ok | invalid_output | provider_error
  error text,
  created_at timestamptz not null default now()
);
alter table public.ai_usage_log enable row level security;
-- (no policies: invisible to the browser)

-- Quick cost check you can run any time:
--   select date_trunc('day', created_at) d, count(*), sum(input_tokens) in_tok,
--          sum(output_tokens) out_tok, sum(est_cost_usd) usd
--   from public.ai_usage_log group by 1 order by 1 desc;
