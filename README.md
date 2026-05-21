# SignalForge AI

Modern AI-powered GTM SaaS app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase, and OpenAI.

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

- Landing page
- Dashboard
- Lead Explorer
- Company Intelligence
- Outreach Generator
- Campaign Manager
- Analytics
- Settings

## Backend

Supabase schema lives in `supabase/migrations/20260521084730_signalforge_ai_schema.sql` and includes RLS-ready tables for profiles, leads, lead lists, list items, campaigns, and activity events.
