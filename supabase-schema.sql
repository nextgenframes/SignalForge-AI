create table if not exists public.av_triage_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,
  environment text not null,
  severity text not null check (severity in ('Critical', 'High', 'Medium', 'Low')),
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  av_data jsonb not null,
  triage jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.av_triage_events enable row level security;

create index if not exists av_triage_events_created_at_idx
  on public.av_triage_events (created_at desc);

create index if not exists av_triage_events_severity_idx
  on public.av_triage_events (severity);

comment on table public.av_triage_events is
  'Bob on Call incident alerts and generated triage briefs.';

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
  ('00000000-0000-4000-8000-000000000101', 'San Francisco', 'CA', 42, 'Critical', 18420, 19, 39),
  ('00000000-0000-4000-8000-000000000102', 'Los Angeles', 'CA', 33, 'High', 14280, 33, 70),
  ('00000000-0000-4000-8000-000000000103', 'Phoenix', 'AZ', 28, 'Medium', 12660, 42, 57),
  ('00000000-0000-4000-8000-000000000104', 'Austin', 'TX', 24, 'Medium', 11240, 61, 68),
  ('00000000-0000-4000-8000-000000000105', 'Pittsburgh', 'PA', 17, 'Low', 6640, 76, 34),
  ('00000000-0000-4000-8000-000000000106', 'Miami', 'FL', 13, 'Low', 5420, 86, 76)
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
  ('AV-331', '00000000-0000-4000-8000-000000000104', 79, 73680, 'Service bay'),
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
