# Center Console Board

Center Console Board is an autonomous vehicle operations dashboard for triage, fleet health, response coordination, and regional risk monitoring.

It is built for shift leads, on-call triage engineers, fleet operations managers, and support teams who need one place to understand what is happening across vehicles, cities, assets, incidents, and response workflows.

## What App Does

Center Console Board combines live-style operations views into one command surface:

- Incident triage and review
- Fleet health tracking
- Asset status and maintenance visibility
- Ticket hotspot mapping by city
- Troubleshooting workflow tracking
- Weather risk monitoring by market
- Finance and cost rollups
- Milestone and progress tracking
- Settings, account, and feedback controls

## Core Dashboard Areas

### Command Board

Primary landing view for operations leadership.

Tracks:

- active incident volume by severity
- issue trend movement
- AI operations brief
- major city hotspot concentration
- daily fleet cost snapshot
- total fleet mileage and operational readiness

Use it to:

- get quick state of network
- spot highest-risk cluster fast
- decide where to send replay review or response owners

### Incidents

Focused triage workspace for current AV events.

Tracks:

- ticket id
- severity
- owner
- city
- age
- current state
- AI summary
- recommended actions

Use it to:

- review incoming tickets
- open incident detail modal
- inspect AI-generated summary
- update incident status
- hand off next actions to owner

### Fleet Health

High-level operational health view across vehicle population.

Tracks:

- total vehicles in fleet
- operational vehicles
- maintenance count
- degraded vehicles
- offline vehicles
- subsystem health by stack area
- watchlist of lowest-health assets

Use it to:

- identify weak subsystem trends
- detect health drift before incident volume spikes
- decide where service priority should go

### Assets

Vehicle registry and lifecycle panel.

Tracks:

- vehicle tag
- city / assigned market
- current status
- health score
- battery level
- mileage

Use it to:

- add demo assets
- edit asset records
- remove retired or test assets
- compare readiness across markets

If Supabase enabled, asset changes can persist to backend.

### Troubleshooting

Guided response panel for active technical investigation.

Tracks:

- current vehicle connection target
- stack module toggles
- troubleshooting run status
- owner assignment
- ETA
- confidence by diagnostic step

Use it to:

- request logs
- simulate stack checks
- coordinate debugging flow during live triage

### Tickets Map

Interactive city-based incident and ticket view using MapLibre.

Tracks:

- ticket density by city
- severity distribution
- issue type distribution
- regional clusters

Use it to:

- understand geographic concentration
- filter by severity or type
- compare city-level pressure across markets

### Weather

Market weather impact view for AV operations.

Tracks:

- current conditions by city
- 7-day forecast
- wind
- precipitation
- alert conditions
- AI weather risk summary

Use it to:

- anticipate risk from rain, fog, wind, heat, storms
- prepare routing or staffing changes in affected cities

### Finance

Operations cost monitoring for fleet program.

Tracks:

- daily cost drivers
- cost by category
- cost per mile trend
- total spend movement

Use it to:

- compare maintenance vs operations spend
- track cost efficiency over time
- identify where fleet issues are increasing cost

### Milestones

Program tracking view for delivery progress.

Tracks:

- milestone name
- target type
- due date
- progress %
- state

Use it to:

- monitor roadmap execution
- spot delayed goals
- connect operational issues to delivery risk

## Response Workflow

Typical flow inside app:

1. Open Command Board for global status.
2. Move into Incidents for active ticket review.
3. Use Fleet Health and Assets to inspect affected vehicles or subsystem weakness.
4. Check Tickets Map for city clustering.
5. Run Troubleshooting workflow for response actions.
6. Review Weather if environmental conditions may contribute.
7. Review Finance and Milestones for broader operational impact.

## AI + Operational Signals

Dashboard includes simulated AI operations support:

- AI incident summaries
- recommended next actions
- AI operations brief
- status and response cues inside command board

Goal: reduce time to understanding, ownership, and next move.

## Authentication

Sign-in screen supports:

- Supabase email/password sign in
- account registration
- password reset trigger
- password change while signed in
- logout
- demo bypass via Enter Demo

If Supabase not configured, app still works in local demo mode.

## Data Sources

App supports two modes.

### Demo Mode

Runs with seeded AV operations data in frontend.

Good for:

- demos
- design review
- local development
- stakeholder walkthroughs

### Supabase Mode

Hydrates from Supabase for persisted records.

Current integration covers:

- locations
- assets
- milestones
- incidents
- tickets
- troubleshooting logs
- feedback

## Supabase Setup

1. Run `supabase-schema.sql` in Supabase SQL editor.
2. Add environment variables:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Expected tables:

- `center_console_locations`
- `center_console_assets`
- `center_console_milestones`
- `center_console_incidents`
- `center_console_tickets`
- `center_console_troubleshooting_logs`
- `center_console_feedback`

## Tech Stack

- React
- Vite
- plain CSS with custom dashboard UI
- Supabase Auth + Postgres
- MapLibre GL for geographic ticket map

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4173/
```

Build production bundle:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

Serve built output:

```bash
npm run server
```

## Deployment

Recommended Vercel settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Optional environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Repo Structure

- `src/App.jsx` main app pages and flows
- `src/styles.css` dashboard styling
- `src/MapcnMap.jsx` map integration wrapper
- `src/supabaseClient.js` browser Supabase client
- `public/operations-map-photo.png` login/overview visual
- `supabase-schema.sql` optional database schema
- `vercel.json` deploy config

## Best For

This project is best for:

- AV fleet operations demos
- ops command center prototypes
- triage workflow reviews
- internal tools exploration
- incident + asset + map driven dashboard UX

## License

Private / internal demo project unless you add your own license.
