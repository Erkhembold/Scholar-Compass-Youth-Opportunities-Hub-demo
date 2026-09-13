-- ScholarCompass user profiles
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  school text,
  grade text,
  intended_major text,
  target_test text,
  points integer default 0,
  created_at timestamp with time zone default now()
);

-- Row Level Security: each person can only read/edit their own profile
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row the moment someone signs up, pulling their
-- name out of the sign-up form (passed in as metadata) and their email.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
