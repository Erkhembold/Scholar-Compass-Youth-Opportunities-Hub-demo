-- ScholarCompass verified test scores (shown as badges on the leaderboard
-- and on profile pages). Safe to run more than once.
-- Users can only READ this table. Nobody can add or change a score from the
-- app, so a score only appears if the site owner inserted it here.

create table if not exists public.verified_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  test_type text not null,            -- e.g. 'IELTS', 'SAT'
  score text not null,                -- e.g. '7.5'
  label text not null,                -- e.g. 'Real IELTS Score'
  sublabel text,                      -- e.g. 'IELTS Overall'
  created_at timestamptz not null default now(),
  unique (user_id, test_type)
);

alter table public.verified_scores enable row level security;

drop policy if exists "Signed-in users can read verified scores" on public.verified_scores;
create policy "Signed-in users can read verified scores"
  on public.verified_scores for select
  to authenticated
  using (true);
-- (no insert/update/delete policies on purpose)

-- Seed: Erkhem Bileg -> IELTS 7.5, Jake -> IELTS 8.0.
-- Jake is matched by his account email; Erkhem by profile name.
insert into public.verified_scores (user_id, test_type, score, label, sublabel)
select p.id, 'IELTS', '7.5', 'Real IELTS Score', 'IELTS Overall'
from public.profiles p
where p.name ilike 'Erkhem%Bileg%'
on conflict (user_id, test_type) do update
  set score = excluded.score, label = excluded.label, sublabel = excluded.sublabel;

insert into public.verified_scores (user_id, test_type, score, label, sublabel)
select p.id, 'IELTS', '8.0', 'Real IELTS Score', 'IELTS Overall'
from public.profiles p
where lower(p.email) = 'jakebookderson3@gmail.com'
on conflict (user_id, test_type) do update
  set score = excluded.score, label = excluded.label, sublabel = excluded.sublabel;

-- Check: should list 2 rows (one per person).
select p.name, p.email, v.test_type, v.score
from public.verified_scores v join public.profiles p on p.id = v.user_id;
