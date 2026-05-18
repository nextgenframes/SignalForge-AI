# Center Console Board

AV (Autonomous Vehicle) triage + fleet operations demo web app.

Built for "center console" workflow: triage incidents, monitor fleet health, manage assets, view ticket heat by city, run finance rollups, track milestones/mileage, troubleshoot vehicle stack, and review weather risk.

## Highlights

- Sidebar navigation with pages for: Command Board, Incidents, Fleet Health, Assets, Troubleshooting, Tickets Map, Weather, Finance, Milestones, Settings
- Supabase auth login/register/password-change/logout plus "Enter Demo" bypass
- Command Board dashboard layout inspired by mockup (dark UI, dense panels)
- Ticket Monitoring Map upgraded to interactive MapLibre map (mapcn-style integration)
- Assets: add/edit/remove demo vehicles with confirm on delete
- Incidents: click any ticket to open details modal (sim data + AI summary)
- Troubleshooting: connect to vehicle tag, toggle stack modules, request logs, online/offline blinking status
- Weather: per-city forecast + AI rain-risk + alerting list
- Alerts bell popover + account menu (change password demo + logout)
- Light/Dark theme toggle + version display + feedback modal

## Tech

- React + Vite
- Plain CSS (custom dashboard styling)
- Supabase Auth + Postgres
- MapLibre GL (interactive maps)

## Quick Start

Install + run dev server:

```bash
npm install
npm run dev
```

Open:

- `http://127.0.0.1:4173/`

## Demo Login

Sign-in screen includes:

- Email/password fields wired for Supabase Auth
- "Enter Demo" button (bypass auth)
- "Create an account" link (Supabase signup)
- "Forgot password?" trigger (Supabase reset email)

## Map / Locations

Ticket Monitoring Map renders real geographic markers for:

- San Francisco, CA
- Los Angeles, CA
- Seattle, WA
- Denver, CO
- Austin, TX
- Miami, FL
- New York, NY

Filters (dropdowns):

- Severity: All / S1 / S2 / S3
- Type: All Types / Planning / Sensors / Perception / Operations / Maps / Compute

## Supabase

App works fully with simulated data by default.

To enable full backend, do both:

1. Run `supabase-schema.sql` in Supabase SQL Editor
2. Add env vars:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Tables expected (see `supabase-schema.sql`):

- `center_console_locations`
- `center_console_assets`
- `center_console_milestones`
- `center_console_incidents`
- `center_console_tickets`
- `center_console_troubleshooting_logs`
- `center_console_feedback`

Auth-backed features:

- Email/password sign in
- Sign up
- Password reset email
- Password change while signed in
- Logout

Persisted app actions:

- Asset add/edit/remove
- Incident status updates
- Ticket map reads
- Troubleshooting connect/toggle/log requests
- Feedback submissions

## Scripts

```bash
npm run dev      # Vite dev server
npm run build    # Production build to dist/
npm run preview  # Preview built app
npm run server   # Simple static server for dist/
```

## Deploy (Vercel)

Suggested Vercel settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Environment variables (optional):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Repo Structure

- `src/App.jsx` main app (pages, routing, demo data)
- `src/supabaseClient.js` Supabase browser client
- `src/styles.css` dashboard styling
- `src/MapcnMap.jsx` MapLibre wrapper used by Ticket Monitoring Map panels
- `public/operations-map-photo.png` sign-in background map image
- `supabase-schema.sql` optional DB schema for demo hydration

## License

Private/internal demo project unless you add your own license.
