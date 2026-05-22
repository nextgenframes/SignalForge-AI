create schema if not exists center_console_private;

revoke all on schema center_console_private from anon, authenticated;

create table if not exists public.center_console_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'operator' check (role in ('operator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.center_console_profiles enable row level security;

create or replace function center_console_private.touch_center_console_profile()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_center_console_profile on public.center_console_profiles;

create trigger touch_center_console_profile
  before update on public.center_console_profiles
  for each row
  execute function center_console_private.touch_center_console_profile();

create or replace function center_console_private.sync_center_console_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.center_console_profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(coalesce(new.raw_user_meta_data ->> 'full_name', ''), '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.center_console_profiles.full_name, excluded.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_center_console_profile on auth.users;

create trigger sync_center_console_profile
  after insert or update of email, raw_user_meta_data on auth.users
  for each row
  execute function center_console_private.sync_center_console_profile();

insert into public.center_console_profiles (id, email, full_name)
select
  users.id,
  coalesce(users.email, ''),
  nullif(coalesce(users.raw_user_meta_data ->> 'full_name', ''), '')
from auth.users
on conflict (id) do update set
  email = excluded.email,
  full_name = coalesce(public.center_console_profiles.full_name, excluded.full_name),
  updated_at = now();

drop policy if exists "Users can read their own console profile"
  on public.center_console_profiles;

drop policy if exists "Users can update their own console profile"
  on public.center_console_profiles;

create policy "Users can read their own console profile"
  on public.center_console_profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own console profile"
  on public.center_console_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

alter table public.center_console_troubleshooting_logs
  alter column requested_by set default auth.uid();

drop policy if exists "Authenticated users can write troubleshooting logs"
  on public.center_console_troubleshooting_logs;

drop policy if exists "Authenticated users can insert troubleshooting logs"
  on public.center_console_troubleshooting_logs;

drop policy if exists "Authenticated users can read their troubleshooting logs"
  on public.center_console_troubleshooting_logs;

create policy "Authenticated users can insert troubleshooting logs"
  on public.center_console_troubleshooting_logs for insert
  to authenticated
  with check (requested_by = auth.uid());

create policy "Authenticated users can read their troubleshooting logs"
  on public.center_console_troubleshooting_logs for select
  to authenticated
  using (requested_by = auth.uid());

revoke all on public.center_console_locations from anon, authenticated;
revoke all on public.center_console_assets from anon, authenticated;
revoke all on public.center_console_milestones from anon, authenticated;
revoke all on public.center_console_feedback from anon, authenticated;
revoke all on public.center_console_incidents from anon, authenticated;
revoke all on public.center_console_tickets from anon, authenticated;
revoke all on public.center_console_troubleshooting_logs from anon, authenticated;
revoke all on public.center_console_profiles from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.center_console_locations to anon, authenticated;
grant select on public.center_console_assets to anon, authenticated;
grant select on public.center_console_milestones to anon, authenticated;
grant insert on public.center_console_feedback to anon, authenticated;
grant select on public.center_console_incidents to anon, authenticated;
grant select on public.center_console_tickets to anon, authenticated;

grant insert, update, delete on public.center_console_assets to authenticated;
grant insert, update, delete on public.center_console_incidents to authenticated;
grant insert, update, delete on public.center_console_tickets to authenticated;
grant insert, select on public.center_console_troubleshooting_logs to authenticated;
grant select, update (full_name) on public.center_console_profiles to authenticated;

create index if not exists center_console_profiles_email_idx
  on public.center_console_profiles (email);
