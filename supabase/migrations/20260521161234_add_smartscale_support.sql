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
