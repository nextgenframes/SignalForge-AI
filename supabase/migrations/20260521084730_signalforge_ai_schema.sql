create extension if not exists pgcrypto;

create table if not exists public.signalforge_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signalforge_leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  company text not null,
  domain text not null,
  segment text not null,
  location text,
  employees integer check (employees >= 0),
  revenue text,
  score integer not null default 0 check (score >= 0 and score <= 100),
  status text not null default 'Researching' check (status in ('Qualified', 'Researching', 'Contacted', 'Nurture')),
  intent text,
  summary text,
  signals text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signalforge_lead_lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.signalforge_lead_list_items (
  list_id uuid not null references public.signalforge_lead_lists(id) on delete cascade,
  lead_id uuid not null references public.signalforge_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (list_id, lead_id)
);

create table if not exists public.signalforge_campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  audience text,
  status text not null default 'Draft' check (status in ('Draft', 'Active', 'Paused', 'Complete')),
  sent_count integer not null default 0 check (sent_count >= 0),
  reply_count integer not null default 0 check (reply_count >= 0),
  pipeline_value numeric not null default 0 check (pipeline_value >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signalforge_activity_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.signalforge_leads(id) on delete cascade,
  campaign_id uuid references public.signalforge_campaigns(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.signalforge_profiles enable row level security;
alter table public.signalforge_leads enable row level security;
alter table public.signalforge_lead_lists enable row level security;
alter table public.signalforge_lead_list_items enable row level security;
alter table public.signalforge_campaigns enable row level security;
alter table public.signalforge_activity_events enable row level security;

drop policy if exists "Users manage own profile" on public.signalforge_profiles;
drop policy if exists "Users manage own leads" on public.signalforge_leads;
drop policy if exists "Users manage own lists" on public.signalforge_lead_lists;
drop policy if exists "Users manage own list items" on public.signalforge_lead_list_items;
drop policy if exists "Users manage own campaigns" on public.signalforge_campaigns;
drop policy if exists "Users manage own events" on public.signalforge_activity_events;

create policy "Users manage own profile"
  on public.signalforge_profiles for all
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Users manage own leads"
  on public.signalforge_leads for all
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Users manage own lists"
  on public.signalforge_lead_lists for all
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Users manage own list items"
  on public.signalforge_lead_list_items for all
  to authenticated
  using (
    exists (
      select 1 from public.signalforge_lead_lists lists
      where lists.id = list_id and lists.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.signalforge_lead_lists lists
      where lists.id = list_id and lists.owner_id = (select auth.uid())
    )
  );

create policy "Users manage own campaigns"
  on public.signalforge_campaigns for all
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Users manage own events"
  on public.signalforge_activity_events for all
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create index if not exists signalforge_leads_owner_score_idx
  on public.signalforge_leads (owner_id, score desc);

create index if not exists signalforge_leads_search_idx
  on public.signalforge_leads using gin (
    to_tsvector('english', company || ' ' || domain || ' ' || segment || ' ' || coalesce(intent, ''))
  );

create index if not exists signalforge_campaigns_owner_status_idx
  on public.signalforge_campaigns (owner_id, status);

create index if not exists signalforge_events_owner_created_idx
  on public.signalforge_activity_events (owner_id, created_at desc);

comment on table public.signalforge_leads is
  'SignalForge AI lead discovery, research, scoring, and saved account intelligence.';

comment on table public.signalforge_campaigns is
  'SignalForge AI outbound campaign tracking and CRM pipeline metrics.';
