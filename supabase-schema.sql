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

create table if not exists public.merchant_stores (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  brand text not null,
  market text not null,
  smartscale_enabled boolean not null default false,
  adoption_score integer not null default 0 check (adoption_score >= 0 and adoption_score <= 100),
  missing_item_claim_rate numeric not null default 0 check (missing_item_claim_rate >= 0 and missing_item_claim_rate <= 100),
  avg_handoff_time integer not null default 0 check (avg_handoff_time >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.smartscale_devices (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.merchant_stores(id) on delete cascade,
  device_name text not null,
  status text not null default 'online'
    check (status in ('online', 'offline', 'maintenance')),
  last_check_in timestamptz,
  firmware_version text,
  calibration_status text not null default 'current'
    check (calibration_status in ('current', 'due', 'overdue', 'failed')),
  location_in_store text,
  created_at timestamptz not null default now(),
  unique (store_id, device_name)
);

create table if not exists public.smartscale_checks (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  store_id uuid not null references public.merchant_stores(id) on delete cascade,
  device_id uuid references public.smartscale_devices(id) on delete set null,
  expected_weight numeric not null check (expected_weight > 0),
  actual_weight numeric not null check (actual_weight >= 0),
  weight_difference numeric generated always as (actual_weight - expected_weight) stored,
  tolerance_range numeric not null check (tolerance_range >= 0),
  check_result text not null
    check (check_result in ('pass', 'review', 'fail', 'skipped')),
  issue_type text
    check (issue_type in (
      'missing_item',
      'incorrect_item',
      'weight_mismatch',
      'scale_skipped',
      'calibration_drift',
      'customization_false_positive',
      'dasher_delay'
    )),
  staff_action text not null default 'none'
    check (staff_action in (
      'none',
      'accepted',
      'repacked',
      'manager_review',
      'marked_customization',
      'escalated'
    )),
  dasher_wait_time integer not null default 0 check (dasher_wait_time >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.smartscale_issues (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  store_id uuid not null references public.merchant_stores(id) on delete cascade,
  device_id uuid references public.smartscale_devices(id) on delete set null,
  severity text not null
    check (severity in ('low', 'medium', 'high', 'critical')),
  issue_type text not null
    check (issue_type in (
      'missing_item',
      'incorrect_item',
      'weight_mismatch',
      'scale_skipped',
      'calibration_drift',
      'customization_false_positive',
      'dasher_delay'
    )),
  ai_summary text not null,
  likely_root_cause text,
  recommended_action text not null,
  status text not null default 'open'
    check (status in ('open', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check (resolved_at is null or resolved_at >= created_at)
);

alter table public.merchant_stores enable row level security;
alter table public.smartscale_devices enable row level security;
alter table public.smartscale_checks enable row level security;
alter table public.smartscale_issues enable row level security;

drop policy if exists "SmartScale stores are publicly readable" on public.merchant_stores;
drop policy if exists "SmartScale devices are publicly readable" on public.smartscale_devices;
drop policy if exists "SmartScale checks are publicly readable" on public.smartscale_checks;
drop policy if exists "SmartScale issues are publicly readable" on public.smartscale_issues;
drop policy if exists "Authenticated users can manage SmartScale stores" on public.merchant_stores;
drop policy if exists "Authenticated users can manage SmartScale devices" on public.smartscale_devices;
drop policy if exists "Authenticated users can manage SmartScale checks" on public.smartscale_checks;
drop policy if exists "Authenticated users can manage SmartScale issues" on public.smartscale_issues;

create policy "SmartScale stores are publicly readable"
  on public.merchant_stores for select
  to anon, authenticated
  using (true);

create policy "SmartScale devices are publicly readable"
  on public.smartscale_devices for select
  to anon, authenticated
  using (true);

create policy "SmartScale checks are publicly readable"
  on public.smartscale_checks for select
  to anon, authenticated
  using (true);

create policy "SmartScale issues are publicly readable"
  on public.smartscale_issues for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can manage SmartScale stores"
  on public.merchant_stores for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage SmartScale devices"
  on public.smartscale_devices for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage SmartScale checks"
  on public.smartscale_checks for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage SmartScale issues"
  on public.smartscale_issues for all
  to authenticated
  using (true)
  with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.merchant_stores to anon, authenticated;
grant select on public.smartscale_devices to anon, authenticated;
grant select on public.smartscale_checks to anon, authenticated;
grant select on public.smartscale_issues to anon, authenticated;
grant insert, update, delete on public.merchant_stores to authenticated;
grant insert, update, delete on public.smartscale_devices to authenticated;
grant insert, update, delete on public.smartscale_checks to authenticated;
grant insert, update, delete on public.smartscale_issues to authenticated;

create index if not exists merchant_stores_brand_market_idx
  on public.merchant_stores (brand, market);

create index if not exists merchant_stores_smartscale_enabled_idx
  on public.merchant_stores (smartscale_enabled, adoption_score desc);

create index if not exists smartscale_devices_store_status_idx
  on public.smartscale_devices (store_id, status);

create index if not exists smartscale_devices_calibration_idx
  on public.smartscale_devices (calibration_status, last_check_in desc);

create index if not exists smartscale_checks_order_idx
  on public.smartscale_checks (order_id);

create index if not exists smartscale_checks_store_created_idx
  on public.smartscale_checks (store_id, created_at desc);

create index if not exists smartscale_checks_device_created_idx
  on public.smartscale_checks (device_id, created_at desc);

create index if not exists smartscale_checks_result_issue_idx
  on public.smartscale_checks (check_result, issue_type);

create index if not exists smartscale_issues_order_idx
  on public.smartscale_issues (order_id);

create index if not exists smartscale_issues_store_status_idx
  on public.smartscale_issues (store_id, status, created_at desc);

create index if not exists smartscale_issues_severity_idx
  on public.smartscale_issues (severity, created_at desc);

create index if not exists smartscale_issues_device_idx
  on public.smartscale_issues (device_id, created_at desc);

comment on table public.merchant_stores is
  'Merchant store rollups for SmartScale adoption, missing-item risk, and handoff performance.';

comment on table public.smartscale_devices is
  'SmartScale hardware registry, health, firmware, calibration, and in-store placement.';

comment on table public.smartscale_checks is
  'Order-level SmartScale weigh checks before Dasher handoff.';

comment on table public.smartscale_issues is
  'AI-triaged SmartScale order accuracy issues and resolution workflow.';

insert into public.merchant_stores
  (id, store_name, brand, market, smartscale_enabled, adoption_score, missing_item_claim_rate, avg_handoff_time)
values
  ('00000000-0000-4000-8000-000000000401', 'Mission Taqueria 18th St', 'Mission Taqueria', 'San Francisco', true, 91, 1.20, 6),
  ('00000000-0000-4000-8000-000000000402', 'BurgerCraft Sunset', 'BurgerCraft', 'Los Angeles', true, 74, 2.80, 9),
  ('00000000-0000-4000-8000-000000000403', 'Green Bowl Capitol Hill', 'Green Bowl', 'Seattle', true, 82, 1.90, 7),
  ('00000000-0000-4000-8000-000000000404', 'NoodleWorks South Congress', 'NoodleWorks', 'Austin', false, 38, 4.60, 12)
on conflict (id) do update set
  store_name = excluded.store_name,
  brand = excluded.brand,
  market = excluded.market,
  smartscale_enabled = excluded.smartscale_enabled,
  adoption_score = excluded.adoption_score,
  missing_item_claim_rate = excluded.missing_item_claim_rate,
  avg_handoff_time = excluded.avg_handoff_time;

insert into public.smartscale_devices
  (id, store_id, device_name, status, last_check_in, firmware_version, calibration_status, location_in_store)
values
  ('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000401', 'Scale A - Expo Line', 'online', now() - interval '4 minutes', '3.8.2', 'current', 'Expo counter'),
  ('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000402', 'Scale B - Pickup Shelf', 'online', now() - interval '8 minutes', '3.8.1', 'due', 'Pickup shelf'),
  ('00000000-0000-4000-8000-000000000503', '00000000-0000-4000-8000-000000000403', 'Scale A - Salad Station', 'maintenance', now() - interval '47 minutes', '3.7.9', 'overdue', 'Salad station'),
  ('00000000-0000-4000-8000-000000000504', '00000000-0000-4000-8000-000000000404', 'Scale Pilot - Front Counter', 'offline', now() - interval '3 hours', '3.6.4', 'failed', 'Front counter')
on conflict (id) do update set
  store_id = excluded.store_id,
  device_name = excluded.device_name,
  status = excluded.status,
  last_check_in = excluded.last_check_in,
  firmware_version = excluded.firmware_version,
  calibration_status = excluded.calibration_status,
  location_in_store = excluded.location_in_store;

insert into public.smartscale_checks
  (id, order_id, store_id, device_id, expected_weight, actual_weight, tolerance_range, check_result, issue_type, staff_action, dasher_wait_time, created_at)
values
  ('00000000-0000-4000-8000-000000000601', 'DD-883104', '00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000501', 842, 846, 30, 'pass', null, 'accepted', 2, now() - interval '35 minutes'),
  ('00000000-0000-4000-8000-000000000602', 'DD-883219', '00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000502', 1180, 940, 45, 'fail', 'missing_item', 'repacked', 11, now() - interval '28 minutes'),
  ('00000000-0000-4000-8000-000000000603', 'DD-883276', '00000000-0000-4000-8000-000000000403', '00000000-0000-4000-8000-000000000503', 705, 762, 35, 'review', 'customization_false_positive', 'marked_customization', 6, now() - interval '19 minutes'),
  ('00000000-0000-4000-8000-000000000604', 'DD-883301', '00000000-0000-4000-8000-000000000404', '00000000-0000-4000-8000-000000000504', 990, 0, 40, 'skipped', 'scale_skipped', 'manager_review', 14, now() - interval '12 minutes')
on conflict (id) do update set
  order_id = excluded.order_id,
  store_id = excluded.store_id,
  device_id = excluded.device_id,
  expected_weight = excluded.expected_weight,
  actual_weight = excluded.actual_weight,
  tolerance_range = excluded.tolerance_range,
  check_result = excluded.check_result,
  issue_type = excluded.issue_type,
  staff_action = excluded.staff_action,
  dasher_wait_time = excluded.dasher_wait_time,
  created_at = excluded.created_at;

insert into public.smartscale_issues
  (id, order_id, store_id, device_id, severity, issue_type, ai_summary, likely_root_cause, recommended_action, status, created_at, resolved_at)
values
  (
    '00000000-0000-4000-8000-000000000701',
    'DD-883219',
    '00000000-0000-4000-8000-000000000402',
    '00000000-0000-4000-8000-000000000502',
    'high',
    'missing_item',
    'Actual weight is 240g below expected range; likely missing side item before pickup.',
    'Expo packed entree but missed fries during rush handoff.',
    'Reopen bag, verify item checklist, and repack before Dasher release.',
    'investigating',
    now() - interval '27 minutes',
    null
  ),
  (
    '00000000-0000-4000-8000-000000000702',
    'DD-883276',
    '00000000-0000-4000-8000-000000000403',
    '00000000-0000-4000-8000-000000000503',
    'medium',
    'customization_false_positive',
    'Weight overage aligns with extra protein customization; no missing-item risk detected.',
    'Menu modifier added weight beyond baseline model.',
    'Mark customization and update expected weight profile for this modifier set.',
    'resolved',
    now() - interval '18 minutes',
    now() - interval '9 minutes'
  ),
  (
    '00000000-0000-4000-8000-000000000703',
    'DD-883301',
    '00000000-0000-4000-8000-000000000404',
    '00000000-0000-4000-8000-000000000504',
    'critical',
    'scale_skipped',
    'Order bypassed SmartScale because device is offline; handoff delay and accuracy risk are elevated.',
    'Pilot device failed calibration and staff skipped backup check.',
    'Move order to manual checklist, recalibrate device, and coach shift lead on fallback flow.',
    'open',
    now() - interval '11 minutes',
    null
  )
on conflict (id) do update set
  order_id = excluded.order_id,
  store_id = excluded.store_id,
  device_id = excluded.device_id,
  severity = excluded.severity,
  issue_type = excluded.issue_type,
  ai_summary = excluded.ai_summary,
  likely_root_cause = excluded.likely_root_cause,
  recommended_action = excluded.recommended_action,
  status = excluded.status,
  created_at = excluded.created_at,
  resolved_at = excluded.resolved_at;
