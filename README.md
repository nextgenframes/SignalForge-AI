# Smart Dash AI Agent

AI-powered delivery operations command center built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase, and OpenAI.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
```

The AI route falls back to demo output when `OPENAI_API_KEY` is not set.

## App Surface

- Dashboard
- Multi-Agent Supervisor
- Executive Ops
- SmartScale Operations
- SmartScale Fraud
- Merchant Intelligence
- Dasher Operations
- Simulation Lab
- Incident Replay
- Voice Ops
- Dispatch Optimizer
- Fleet Health
- Customer Recovery
- Analytics
- Settings

## Backend

Supabase schema lives in `supabase/migrations/20260521084730_signalforge_ai_schema.sql` and `supabase/migrations/20260521161234_add_smartscale_support.sql`, with additional SmartScale store, device, check, and issue support in `supabase-schema.sql`.
