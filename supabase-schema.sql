create table if not exists public.center_console_locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  state text not null,
  issue_count integer not null default 0 check (issue_count >= 0),
  severity text not null,
  daily_cost numeric not null default 0 check (daily_cost >= 0),
  map_x numeric not null check (map_x >= 0 and map_x <= 100),
  map_y numeric not null check (map_y >= 0 and map_y <= 100),
  created_at timestamptz not null default now()
);

alter table public.center_console_locations
  drop constraint if exists center_console_locations_severity_check;

alter table public.center_console_locations
  add constraint center_console_locations_severity_check
  check (severity in ('Critical', 'High', 'Medium', 'Low'));

create table if not exists public.center_console_assets (
  id uuid primary key default gen_random_uuid(),
  asset_tag text not null unique,
  location_id uuid references public.center_console_locations(id) on delete set null,
  health_score integer not null check (health_score >= 0 and health_score <= 100),
  mileage integer not null default 0 check (mileage >= 0),
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.center_console_milestones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  milestone_type text not null check (milestone_type in ('Project', 'Mileage', 'Finance')),
  due_on date not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz not null default now()
);

create table if not exists public.center_console_feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  page text not null default 'Command Board',
  user_email text,
  created_at timestamptz not null default now()
);

alter table public.center_console_locations enable row level security;
alter table public.center_console_assets enable row level security;
alter table public.center_console_milestones enable row level security;
alter table public.center_console_feedback enable row level security;

drop policy if exists "Authenticated users can read console locations"
  on public.center_console_locations;

drop policy if exists "Authenticated users can read console assets"
  on public.center_console_assets;

drop policy if exists "Authenticated users can read console milestones"
  on public.center_console_milestones;

drop policy if exists "Authenticated users can submit console feedback"
  on public.center_console_feedback;

drop policy if exists "Console dashboard data is publicly readable"
  on public.center_console_locations;

drop policy if exists "Console assets are publicly readable"
  on public.center_console_assets;

drop policy if exists "Console milestones are publicly readable"
  on public.center_console_milestones;

drop policy if exists "Console feedback can be submitted"
  on public.center_console_feedback;

create policy "Console dashboard data is publicly readable"
  on public.center_console_locations for select
  to anon, authenticated
  using (true);

create policy "Console assets are publicly readable"
  on public.center_console_assets for select
  to anon, authenticated
  using (true);

create policy "Console milestones are publicly readable"
  on public.center_console_milestones for select
  to anon, authenticated
  using (true);

create policy "Console feedback can be submitted"
  on public.center_console_feedback for insert
  to anon, authenticated
  with check (true);

create index if not exists center_console_locations_issue_count_idx
  on public.center_console_locations (issue_count desc);

create index if not exists center_console_assets_health_score_idx
  on public.center_console_assets (health_score asc);

create index if not exists center_console_milestones_due_on_idx
  on public.center_console_milestones (due_on asc);

comment on table public.center_console_locations is
  'Center Console Board demo and production location health rollups.';

comment on table public.center_console_assets is
  'Center Console Board AV fleet asset health and mileage records.';

comment on table public.center_console_milestones is
  'Center Console Board project, finance, and mileage milestone tracking.';

comment on table public.center_console_feedback is
  'User feedback submitted from the Center Console Board interface.';

insert into public.center_console_locations
  (id, city, state, issue_count, severity, daily_cost, map_x, map_y)
values
  ('00000000-0000-4000-8000-000000000101', 'San Francisco', 'CA', 42, 'Critical', 18420, 16, 52),
  ('00000000-0000-4000-8000-000000000102', 'Los Angeles', 'CA', 33, 'High', 14280, 20, 66),
  ('00000000-0000-4000-8000-000000000103', 'Seattle', 'WA', 21, 'Medium', 9820, 18, 22),
  ('00000000-0000-4000-8000-000000000104', 'Denver', 'CO', 18, 'Low', 7640, 43, 42),
  ('00000000-0000-4000-8000-000000000105', 'Austin', 'TX', 24, 'Medium', 11240, 51, 66),
  ('00000000-0000-4000-8000-000000000106', 'Miami', 'FL', 13, 'Low', 5420, 72, 78),
  ('00000000-0000-4000-8000-000000000107', 'New York', 'NY', 29, 'High', 13310, 82, 36)
on conflict (id) do update set
  issue_count = excluded.issue_count,
  severity = excluded.severity,
  daily_cost = excluded.daily_cost,
  map_x = excluded.map_x,
  map_y = excluded.map_y;

insert into public.center_console_assets
  (asset_tag, location_id, health_score, mileage, status)
values
  ('AV-204', '00000000-0000-4000-8000-000000000101', 87, 118420, 'Investigate'),
  ('AV-118', '00000000-0000-4000-8000-000000000102', 93, 91480, 'On route'),
  ('AV-077', '00000000-0000-4000-8000-000000000103', 91, 96510, 'Ready'),
  ('AV-331', '00000000-0000-4000-8000-000000000105', 79, 73680, 'Service bay'),
  ('AV-419', '00000000-0000-4000-8000-000000000106', 96, 62410, 'Ready')
on conflict (asset_tag) do update set
  location_id = excluded.location_id,
  health_score = excluded.health_score,
  mileage = excluded.mileage,
  status = excluded.status;

insert into public.center_console_milestones
  (id, name, milestone_type, due_on, progress)
values
  ('00000000-0000-4000-8000-000000000201', 'Q2 2025 Safety Milestone', 'Project', '2025-05-10', 100),
  ('00000000-0000-4000-8000-000000000202', 'LA Expansion Phase 2', 'Project', '2025-06-04', 68),
  ('00000000-0000-4000-8000-000000000203', 'System Uptime Target', 'Mileage', '2025-06-11', 92),
  ('00000000-0000-4000-8000-000000000204', 'Q2 Cost Optimization', 'Finance', '2025-06-28', 0)
on conflict (id) do update set
  milestone_type = excluded.milestone_type,
  due_on = excluded.due_on,
  progress = excluded.progress;

create table if not exists public.center_console_incidents (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  title text not null,
  city text not null,
  owner text not null,
  severity text not null check (severity in ('S1', 'S2', 'S3')),
  status text not null,
  age_minutes integer not null default 0 check (age_minutes >= 0),
  ai_summary text,
  recommended_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.center_console_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  city text not null,
  severity text not null check (severity in ('S1', 'S2', 'S3')),
  ticket_type text not null,
  title text not null,
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists public.center_console_troubleshooting_logs (
  id uuid primary key default gen_random_uuid(),
  asset_tag text not null,
  city text,
  online boolean not null default false,
  stack_state jsonb not null default '{}'::jsonb,
  action_type text not null check (action_type in ('connect', 'disconnect', 'toggle', 'request_logs')),
  logs_text text,
  requested_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.center_console_incidents enable row level security;
alter table public.center_console_tickets enable row level security;
alter table public.center_console_troubleshooting_logs enable row level security;

drop policy if exists "Console incidents are publicly readable"
  on public.center_console_incidents;

drop policy if exists "Console tickets are publicly readable"
  on public.center_console_tickets;

drop policy if exists "Authenticated users can manage console assets"
  on public.center_console_assets;

drop policy if exists "Authenticated users can manage console incidents"
  on public.center_console_incidents;

drop policy if exists "Authenticated users can manage console tickets"
  on public.center_console_tickets;

drop policy if exists "Authenticated users can write troubleshooting logs"
  on public.center_console_troubleshooting_logs;

create policy "Console incidents are publicly readable"
  on public.center_console_incidents for select
  to anon, authenticated
  using (true);

create policy "Console tickets are publicly readable"
  on public.center_console_tickets for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can manage console assets"
  on public.center_console_assets for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage console incidents"
  on public.center_console_incidents for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage console tickets"
  on public.center_console_tickets for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can write troubleshooting logs"
  on public.center_console_troubleshooting_logs for all
  to authenticated
  using (true)
  with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.center_console_locations to anon, authenticated;
grant select on public.center_console_assets to anon, authenticated;
grant select on public.center_console_milestones to anon, authenticated;
grant insert on public.center_console_feedback to anon, authenticated;
grant select on public.center_console_incidents to anon, authenticated;
grant select on public.center_console_tickets to anon, authenticated;
grant all on public.center_console_assets to authenticated;
grant all on public.center_console_incidents to authenticated;
grant all on public.center_console_tickets to authenticated;
grant all on public.center_console_troubleshooting_logs to authenticated;

create index if not exists center_console_incidents_city_idx
  on public.center_console_incidents (city, created_at desc);

create index if not exists center_console_tickets_city_idx
  on public.center_console_tickets (city, created_at desc);

create index if not exists center_console_troubleshooting_logs_asset_idx
  on public.center_console_troubleshooting_logs (asset_tag, created_at desc);

insert into public.center_console_incidents
  (ticket_id, title, city, owner, severity, status, age_minutes, ai_summary, recommended_actions)
values
  (
    'AVT-9421',
    'Hard brake near protected bike lane',
    'San Francisco',
    'Planning',
    'S1',
    'Live triage',
    7,
    'Localized edge-case detected near curb interaction. Review replay and fallback planning outputs before route release.',
    '["Pull replay bundle and route trace","Verify camera/lidar/radar health","Assign Planning handoff with evidence"]'::jsonb
  ),
  (
    'AVT-9418',
    'Thermal camera dropout at dusk',
    'Los Angeles',
    'Sensors',
    'S1',
    'Owner assigned',
    13,
    'Repeated thermal instability during lighting transition. Check calibration and thermal camera health.',
    '["Run sensor calibration check","Inspect thermal camera signal loss","Confirm owner follow-up window"]'::jsonb
  ),
  (
    'AVT-9414',
    'Late cone classification in work zone',
    'Seattle',
    'Perception',
    'S2',
    'Replay queued',
    19,
    'Likely perception confidence drop under cluttered work-zone conditions.',
    '["Queue replay review","Compare model confidence on cones","Validate route holdout"]'::jsonb
  ),
  (
    'AVT-9409',
    'Stale closure map on frontage road',
    'Austin',
    'Maps',
    'S2',
    'Monitoring',
    41,
    'Map freshness issue may be causing outdated closure guidance.',
    '["Diff latest map build","Check closure ingestion feed","Confirm city-specific fallback"]'::jsonb
  ),
  (
    'AVT-9402',
    'Remote assist latency over threshold',
    'Miami',
    'Operations',
    'S3',
    'Waiting vendor',
    60,
    'Latency spike appears external; maintain monitoring while vendor investigates.',
    '["Capture latency traces","Escalate to vendor","Monitor dispatch impact"]'::jsonb
  )
on conflict (ticket_id) do update set
  title = excluded.title,
  city = excluded.city,
  owner = excluded.owner,
  severity = excluded.severity,
  status = excluded.status,
  age_minutes = excluded.age_minutes,
  ai_summary = excluded.ai_summary,
  recommended_actions = excluded.recommended_actions;

insert into public.center_console_tickets
  (ticket_id, city, severity, ticket_type, title, status)
values
  ('TM-3012', 'San Francisco', 'S1', 'Perception', 'Pedestrian misclass near curb cut', 'Active'),
  ('TM-3016', 'San Francisco', 'S2', 'Sensors', 'Camera exposure swing at sunset', 'In Progress'),
  ('TM-3019', 'San Francisco', 'S3', 'Maps', 'Workzone lanelet mismatch', 'Active'),
  ('TM-3021', 'Los Angeles', 'S1', 'Planning', 'Aggressive merge fallback', 'Active'),
  ('TM-3024', 'Los Angeles', 'S2', 'Sensors', 'Radar dropout burst', 'In Progress'),
  ('TM-3029', 'Seattle', 'S2', 'Operations', 'Remote assist call volume spike', 'Active'),
  ('TM-3031', 'Seattle', 'S3', 'Compute', 'GPU thermal throttling warning', 'Active'),
  ('TM-3034', 'Denver', 'S3', 'Maps', 'Speed limit data stale', 'Active'),
  ('TM-3039', 'Austin', 'S2', 'Perception', 'Cone tracking drift in construction', 'Active'),
  ('TM-3044', 'Austin', 'S1', 'Planning', 'Hard brake near crosswalk', 'Active'),
  ('TM-3048', 'Miami', 'S3', 'Sensors', 'LiDAR reflectivity noise in rain', 'Active'),
  ('TM-3052', 'Miami', 'S2', 'Operations', 'Dispatch handoff delay', 'In Progress'),
  ('TM-3056', 'New York', 'S1', 'Operations', 'Blocked lane incident escalation', 'Active'),
  ('TM-3059', 'New York', 'S2', 'Perception', 'Occlusion confidence drop downtown', 'Active')
on conflict (ticket_id) do update set
  city = excluded.city,
  severity = excluded.severity,
  ticket_type = excluded.ticket_type,
  title = excluded.title,
  status = excluded.status;

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
