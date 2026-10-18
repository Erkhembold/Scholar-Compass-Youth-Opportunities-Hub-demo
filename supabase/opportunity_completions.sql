-- ScholarCompass: opportunity completion evidence + admin review + 100 XP.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Needs: profiles with weekly_xp / lifetime_xp (leaderboard_schema.sql).
--
-- HOW IT WORKS
--   1. A student uploads a photo (private storage) and submits it for one
--      opportunity. The row starts as 'pending'. No XP.
--   2. Only an admin (a row in public.admins) can list submissions, see the
--      photos and approve or reject. Nobody else can change a submission's
--      status - the table has no client write access at all, only the
--      functions below do.
--   3. Approving is ONE database transaction: it locks the submission,
--      marks it approved, writes a row in the xp_transactions ledger and adds
--      100 XP to the student's weekly and lifetime XP. A unique index on the
--      ledger makes a second reward for the same student + opportunity
--      impossible, even with double-clicks or hand-made API calls.
--   4. A rejected submission can be corrected and resubmitted: the same row
--      goes back to 'pending' (so there is never a second reward).
--
-- Opportunities live in the front-end data file, so submissions store the
-- opportunity id AND a copy of its title. They stay valid after a listing
-- is archived or removed.

-- 1. Admin role --------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- No policies on purpose: the app can never read or edit this table.
revoke all on public.admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- 2. Submissions ---------------------------------------------------------------
create table if not exists public.opportunity_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  opportunity_id text not null check (char_length(opportunity_id) between 1 and 160),
  opportunity_title text not null check (char_length(opportunity_title) between 1 and 300),
  evidence_path text not null,
  note text check (note is null or char_length(note) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_feedback text check (reviewer_feedback is null or char_length(reviewer_feedback) <= 500),
  submitted_at timestamptz not null default now(),
  resubmit_count integer not null default 0,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users on delete set null,
  -- One submission per student per opportunity (this is what stops duplicates).
  constraint opportunity_completions_one_per_student unique (user_id, opportunity_id),
  -- The photo must live in the student's own storage folder.
  constraint opportunity_completions_own_folder check (evidence_path like (user_id::text || '/%')),
  -- A rejection must say why.
  constraint opportunity_completions_reject_needs_reason
    check (status <> 'rejected' or char_length(btrim(coalesce(reviewer_feedback, ''))) > 0)
);

create index if not exists opportunity_completions_queue_idx
  on public.opportunity_completions (status, submitted_at);

alter table public.opportunity_completions enable row level security;

-- Read: your own rows, or everything if you are an admin. Nobody can insert,
-- update or delete through the API; only the functions below can.
drop policy if exists "Students read own completions, admins read all" on public.opportunity_completions;
create policy "Students read own completions, admins read all"
  on public.opportunity_completions for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

revoke insert, update, delete on public.opportunity_completions from anon, authenticated;

-- 3. XP ledger -------------------------------------------------------------------
create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  amount integer not null,
  reason text not null,
  opportunity_id text,
  completion_id uuid references public.opportunity_completions on delete cascade,
  created_at timestamptz not null default now()
);

-- The guarantee: at most ONE completion reward per student per opportunity.
create unique index if not exists xp_transactions_one_completion_reward
  on public.xp_transactions (user_id, opportunity_id)
  where reason = 'opportunity_completion';

alter table public.xp_transactions enable row level security;

drop policy if exists "Students read own xp transactions, admins read all" on public.xp_transactions;
create policy "Students read own xp transactions, admins read all"
  on public.xp_transactions for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

revoke insert, update, delete on public.xp_transactions from anon, authenticated;

-- 4. Adding XP (same helper as exercise_xp.sql; internal only) -----------------
create or replace function public._add_xp(p_uid uuid, p_amount integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set weekly_xp   = coalesce(weekly_xp, 0)   + p_amount,
         lifetime_xp = coalesce(lifetime_xp, 0) + p_amount
   where id = p_uid
     and p_amount > 0;
$$;
revoke all on function public._add_xp(uuid, integer) from public;
revoke all on function public._add_xp(uuid, integer) from anon;
revoke all on function public._add_xp(uuid, integer) from authenticated;

-- 5. Private photo storage -----------------------------------------------------
-- Private bucket (public = false): files are only reachable through signed
-- URLs. Images only, 5 MB max. Files are never overwritten or deleted by
-- students (no update / delete policy), so evidence cannot be swapped after
-- it was reviewed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('opportunity-evidence', 'opportunity-evidence', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Students upload evidence to their own folder" on storage.objects;
create policy "Students upload evidence to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'opportunity-evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students and admins read evidence" on storage.objects;
create policy "Students and admins read evidence"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'opportunity-evidence'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- 6. Student: submit or resubmit -------------------------------------------------
create or replace function public.submit_opportunity_completion(
  p_opportunity_id text,
  p_title          text,
  p_evidence_path  text,
  p_note           text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  v_id uuid;
begin
  if me is null then
    raise exception 'Please sign in first.';
  end if;
  if coalesce(btrim(p_opportunity_id), '') = '' or char_length(p_opportunity_id) > 160 then
    raise exception 'Unknown opportunity.';
  end if;
  if coalesce(btrim(p_title), '') = '' or char_length(p_title) > 300 then
    raise exception 'Missing opportunity title.';
  end if;
  if p_evidence_path is null or p_evidence_path not like (me::text || '/%') then
    raise exception 'Evidence must be uploaded to your own folder.';
  end if;
  if p_note is not null and char_length(p_note) > 500 then
    raise exception 'The explanation is limited to 500 characters.';
  end if;
  -- The photo has to really exist in the private bucket.
  if not exists (
    select 1 from storage.objects o
     where o.bucket_id = 'opportunity-evidence' and o.name = p_evidence_path
  ) then
    raise exception 'The photo was not uploaded. Please try again.';
  end if;

  -- New row, or - only if the previous attempt was rejected - the same row
  -- goes back to pending. A pending or approved row is left alone.
  insert into public.opportunity_completions as c
         (user_id, opportunity_id, opportunity_title, evidence_path, note)
  values (me, btrim(p_opportunity_id), btrim(p_title), p_evidence_path, nullif(btrim(p_note), ''))
  on conflict (user_id, opportunity_id) do update
    set evidence_path     = excluded.evidence_path,
        note              = excluded.note,
        opportunity_title = excluded.opportunity_title,
        status            = 'pending',
        reviewer_feedback = null,
        reviewed_at       = null,
        reviewed_by       = null,
        submitted_at      = now(),
        resubmit_count    = c.resubmit_count + 1
    where c.status = 'rejected'
  returning c.id into v_id;

  if v_id is null then
    raise exception 'You already have a submission for this opportunity that is pending review or approved.';
  end if;
  return v_id;
end;
$$;
revoke all on function public.submit_opportunity_completion(text, text, text, text) from public;
revoke all on function public.submit_opportunity_completion(text, text, text, text) from anon;
grant execute on function public.submit_opportunity_completion(text, text, text, text) to authenticated;

-- 7. Admin: who am I, review queue, approve / reject --------------------------
create or replace function public.am_i_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$ select public.is_admin(); $$;
revoke all on function public.am_i_admin() from public;
revoke all on function public.am_i_admin() from anon;
grant execute on function public.am_i_admin() to authenticated;

-- p_status: 'pending' (default), 'approved', 'rejected' or 'all'.
-- Oldest first, so the queue is chronological.
create or replace function public.admin_list_completions(p_status text default 'pending')
returns table (
  id uuid,
  user_id uuid,
  student_name text,
  student_email text,
  school text,
  grade text,
  opportunity_id text,
  opportunity_title text,
  evidence_path text,
  note text,
  status text,
  reviewer_feedback text,
  submitted_at timestamptz,
  resubmit_count integer,
  reviewed_at timestamptz
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized.';
  end if;
  return query
    select c.id, c.user_id, p.name, p.email, p.school, p.grade,
           c.opportunity_id, c.opportunity_title, c.evidence_path, c.note,
           c.status, c.reviewer_feedback, c.submitted_at, c.resubmit_count, c.reviewed_at
      from public.opportunity_completions c
      left join public.profiles p on p.id = c.user_id
     where p_status = 'all' or c.status = p_status
     order by c.submitted_at asc
     limit 300;
end;
$$;
revoke all on function public.admin_list_completions(text) from public;
revoke all on function public.admin_list_completions(text) from anon;
grant execute on function public.admin_list_completions(text) to authenticated;

-- Approve (+100 XP, once) or reject (reason required). Returns what happened.
create or replace function public.admin_review_completion(
  p_id       uuid,
  p_approve  boolean,
  p_feedback text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  c public.opportunity_completions%rowtype;
  reward constant integer := 100;   -- XP AMOUNT for an approved completion
  ledger_id uuid;
  xp integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Not authorized.';
  end if;

  -- Lock the row: a second click / request waits here and then sees that it
  -- is no longer pending.
  select * into c from public.opportunity_completions where id = p_id for update;
  if not found then
    raise exception 'Submission not found.';
  end if;
  if c.status <> 'pending' then
    raise exception 'This submission was already reviewed (%).', c.status;
  end if;
  if c.user_id = me then
    raise exception 'You cannot review your own submission.';
  end if;

  if p_approve then
    insert into public.xp_transactions (user_id, amount, reason, opportunity_id, completion_id)
    values (c.user_id, reward, 'opportunity_completion', c.opportunity_id, c.id)
    on conflict do nothing
    returning id into ledger_id;

    if ledger_id is not null then
      perform public._add_xp(c.user_id, reward);
      xp := reward;
    end if;

    update public.opportunity_completions
       set status = 'approved', reviewer_feedback = nullif(btrim(p_feedback), ''),
           reviewed_at = now(), reviewed_by = me
     where id = c.id;
  else
    if char_length(btrim(coalesce(p_feedback, ''))) = 0 then
      raise exception 'Please give a short reason for rejecting.';
    end if;
    if char_length(p_feedback) > 500 then
      raise exception 'The reason is limited to 500 characters.';
    end if;
    update public.opportunity_completions
       set status = 'rejected', reviewer_feedback = btrim(p_feedback),
           reviewed_at = now(), reviewed_by = me
     where id = c.id;
  end if;

  return jsonb_build_object(
    'id', c.id,
    'status', case when p_approve then 'approved' else 'rejected' end,
    'xp_awarded', xp
  );
end;
$$;
revoke all on function public.admin_review_completion(uuid, boolean, text) from public;
revoke all on function public.admin_review_completion(uuid, boolean, text) from anon;
grant execute on function public.admin_review_completion(uuid, boolean, text) to authenticated;

-- 8. Make yourself the admin: run SEPARATELY, after replacing the email --------
-- (Left commented out so nobody becomes an admin by accident.)
--
-- insert into public.admins (user_id)
-- select id from auth.users where lower(email) = lower('PUT-YOUR-SIGN-IN-EMAIL-HERE')
-- on conflict do nothing;
