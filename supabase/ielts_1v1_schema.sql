-- IELTS 1v1 challenges. Run in the Supabase SQL editor after the existing profile schema.
-- The functions are the only write path used by the browser; answer keys are never readable by players.

create table if not exists public.ielts_challenges (
  id uuid primary key default gen_random_uuid(),
  pin char(4) not null,
  creator_id uuid not null references auth.users(id) on delete cascade,
  skill text not null check (skill in ('reading', 'writing')),
  exercise_count integer not null check (exercise_count >= 5),
  seconds_per_exercise integer not null check (seconds_per_exercise >= 30),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'completed', 'abandoned', 'expired')),
  started_at timestamptz,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);
create unique index if not exists ielts_challenges_waiting_pin_idx
  on public.ielts_challenges(pin) where status = 'waiting';

create table if not exists public.ielts_challenge_players (
  challenge_id uuid not null references public.ielts_challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  seat smallint not null check (seat in (1, 2)),
  current_exercise integer not null default 0 check (current_exercise >= 0),
  score integer not null default 0 check (score >= 0),
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),
  primary key (challenge_id, user_id),
  unique (challenge_id, seat)
);

create table if not exists public.ielts_challenge_questions (
  challenge_id uuid not null references public.ielts_challenges(id) on delete cascade,
  position integer not null check (position >= 0),
  kind text not null check (kind in ('reading', 'writing')),
  payload jsonb not null,
  primary key (challenge_id, position)
);

-- Kept in a separate table with no player SELECT policy. Only submit_ielts_challenge_answer
-- reads these values, so a client cannot retrieve answers before submitting.
create table if not exists public.ielts_challenge_answer_keys (
  challenge_id uuid not null references public.ielts_challenges(id) on delete cascade,
  position integer not null check (position >= 0),
  answer jsonb,
  primary key (challenge_id, position)
);

create table if not exists public.ielts_challenge_answers (
  challenge_id uuid not null references public.ielts_challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  position integer not null check (position >= 0),
  answer jsonb,
  is_correct boolean,
  submitted_at timestamptz not null default now(),
  primary key (challenge_id, user_id, position)
);

alter table public.ielts_challenges enable row level security;
alter table public.ielts_challenge_players enable row level security;
alter table public.ielts_challenge_questions enable row level security;
alter table public.ielts_challenge_answer_keys enable row level security;
alter table public.ielts_challenge_answers enable row level security;

create or replace function public.is_ielts_challenge_player(p_challenge_id uuid)
returns boolean language sql stable security definer set search_path = public as $member$
  select exists (select 1 from public.ielts_challenge_players where challenge_id = p_challenge_id and user_id = auth.uid());
$member$;

drop policy if exists "Challenge members read challenges" on public.ielts_challenges;
create policy "Challenge members read challenges" on public.ielts_challenges for select
  using (exists (select 1 from public.ielts_challenge_players p where p.challenge_id = id and p.user_id = auth.uid()));
drop policy if exists "Challenge members read players" on public.ielts_challenge_players;
create policy "Challenge members read players" on public.ielts_challenge_players for select
  using (public.is_ielts_challenge_player(challenge_id));
drop policy if exists "Challenge members read questions" on public.ielts_challenge_questions;
create policy "Challenge members read questions" on public.ielts_challenge_questions for select
  using (exists (select 1 from public.ielts_challenge_players me where me.challenge_id = challenge_id and me.user_id = auth.uid()));
drop policy if exists "Players read their answers" on public.ielts_challenge_answers;
create policy "Players read their answers" on public.ielts_challenge_answers for select using (user_id = auth.uid());

create or replace function public.create_ielts_challenge(
  p_skill text, p_exercise_count integer, p_seconds_per_exercise integer,
  p_questions jsonb, p_answers jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid := gen_random_uuid(); v_pin char(4); v_try integer := 0;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_skill not in ('reading', 'writing') or p_exercise_count < 5 or p_seconds_per_exercise < 30
    or jsonb_array_length(p_questions) <> p_exercise_count or jsonb_array_length(p_answers) <> p_exercise_count then
    raise exception 'Invalid challenge configuration';
  end if;
  loop
    v_pin := lpad((floor(random() * 10000))::int::text, 4, '0');
    begin
      insert into ielts_challenges(id, pin, creator_id, skill, exercise_count, seconds_per_exercise)
      values (v_id, v_pin, auth.uid(), p_skill, p_exercise_count, p_seconds_per_exercise);
      exit;
    exception when unique_violation then
      v_try := v_try + 1; if v_try > 20 then raise exception 'Could not allocate PIN'; end if;
    end;
  end loop;
  insert into ielts_challenge_players(challenge_id, user_id, seat) values (v_id, auth.uid(), 1);
  insert into ielts_challenge_questions(challenge_id, position, kind, payload)
    select v_id, ordinality - 1, p_skill, value from jsonb_array_elements(p_questions) with ordinality;
  insert into ielts_challenge_answer_keys(challenge_id, position, answer)
    select v_id, ordinality - 1, case when value = 'null'::jsonb then null else value end from jsonb_array_elements(p_answers) with ordinality;
  return v_id;
end $$;

create or replace function public.join_ielts_challenge(p_pin text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_challenge ielts_challenges%rowtype; v_count integer;
begin
  if auth.uid() is null or p_pin !~ '^[0-9]{4}$' then raise exception 'Invalid PIN'; end if;
  select * into v_challenge from ielts_challenges where pin = p_pin and status = 'waiting' and expires_at > now() for update;
  if not found then raise exception 'This challenge is unavailable or has expired'; end if;
  if v_challenge.creator_id = auth.uid() then raise exception 'You already created this challenge'; end if;
  select count(*) into v_count from ielts_challenge_players where challenge_id = v_challenge.id;
  if v_count <> 1 then raise exception 'This challenge is full'; end if;
  insert into ielts_challenge_players(challenge_id, user_id, seat) values (v_challenge.id, auth.uid(), 2);
  update ielts_challenges set status = 'active', started_at = now() where id = v_challenge.id;
  return v_challenge.id;
end $$;

create or replace function public.submit_ielts_challenge_answer(p_challenge_id uuid, p_position integer, p_answer jsonb)
returns table(is_correct boolean, completed boolean) language plpgsql security definer set search_path = public as $$
declare v_challenge ielts_challenges%rowtype; v_expected jsonb; v_correct boolean; v_complete boolean;
begin
  select * into v_challenge from ielts_challenges where id = p_challenge_id;
  if auth.uid() is null or not exists(select 1 from ielts_challenge_players where challenge_id = p_challenge_id and user_id = auth.uid()) then raise exception 'Not a player'; end if;
  if v_challenge.status <> 'active' or p_position < 0 or p_position >= v_challenge.exercise_count then
    raise exception 'This answer is no longer accepted';
  end if;
  -- Late non-blank answers are rejected. A null timeout submission is accepted
  -- as an incorrect/unfinished answer so a disconnected player cannot trap a match.
  if now() > v_challenge.started_at + ((p_position + 1) * v_challenge.seconds_per_exercise) * interval '1 second'
    and p_answer is not null then raise exception 'This answer is no longer accepted'; end if;
  if exists(select 1 from ielts_challenge_answers where challenge_id=p_challenge_id and user_id=auth.uid() and position=p_position) then raise exception 'Already submitted'; end if;
  select answer into v_expected from ielts_challenge_answer_keys where challenge_id=p_challenge_id and position=p_position;
  v_correct := case when v_expected is null then null else v_expected = p_answer end;
  insert into ielts_challenge_answers(challenge_id,user_id,position,answer,is_correct) values(p_challenge_id,auth.uid(),p_position,p_answer,v_correct);
  update ielts_challenge_players set current_exercise = greatest(current_exercise,p_position+1), score = score + case when v_correct then 1 else 0 end, last_seen_at=now()
    where challenge_id=p_challenge_id and user_id=auth.uid();
  select count(*) >= v_challenge.exercise_count into v_complete from ielts_challenge_answers where challenge_id=p_challenge_id and user_id=auth.uid();
  if v_complete then update ielts_challenge_players set completed_at=now() where challenge_id=p_challenge_id and user_id=auth.uid(); end if;
  if (select count(*) from ielts_challenge_players where challenge_id=p_challenge_id and completed_at is not null) = 2 then update ielts_challenges set status='completed' where id=p_challenge_id; end if;
  return query select v_correct, v_complete;
end $$;

grant execute on function public.create_ielts_challenge(text,integer,integer,jsonb,jsonb) to authenticated;
grant execute on function public.join_ielts_challenge(text) to authenticated;
grant execute on function public.submit_ielts_challenge_answer(uuid,integer,jsonb) to authenticated;
