# Bob on Call

Bob on Call is a lightweight hackathon prototype for real-time on-call triage powered by **IBM Bob**. It turns a raw production alert into a plain-English first-response brief, remembers investigation context across open incidents, and generates an end-of-shift handoff in one click.

## 🤖 Bob Integration Highlights

**Bob is integrated throughout every part of the incident response workflow:**

- **Alert Translator**: Bob converts raw alerts into structured triage briefs with severity, affected files, recent commits, and first response steps
- **Deep Analysis**: Bob provides root cause hypotheses, dependency mapping, and ordered investigation paths
- **Mitigation Strategies**: Bob suggests immediate actions, short-term fixes, and long-term solutions with risk assessments
- **Shift Brain**: Bob maintains context across incidents and generates instant re-briefs
- **Handoff Generator**: Bob creates structured end-of-shift summaries with all critical information
- **Regression Radar**: Bob compares PR diffs against active incidents to detect regression risks
- **Action Logging**: Real-time visibility into Bob's analysis with categorized, color-coded activity feed
- **Smart Fallbacks**: Three-tier system (IBM Bob → Model APIs → Local playbook) ensures reliability

## What It Shows

- **Alert Translator**: Raw alert → severity, affected area, likely files, relevant commits, and first checks
- **Deep Analysis**: Root cause hypothesis, dependency chains, investigation paths, and rollback risk assessment
- **Mitigation Strategies**: Immediate actions (0-5 min), short-term fixes (5-30 min), and long-term solutions
- **Shift Brain**: Open incident list, instant re-brief, investigation notes, and Bob-powered analysis
- **Handoff Generator**: Select incidents and export a structured Markdown handoff
- **Bob Action Log**: Categorized, color-coded evidence of Bob's real-time analysis and recommendations
- **Regression Radar**: Paste a PR diff and compare it against active incident areas
- **Local Fallback**: Useful demo output even when model credentials are not configured

## Local Use

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:4173
```

If that port is already busy, Vite will use the next available port and print the URL.

## Production Build

```bash
npm run build
node server.js
```

## IBM Bob Setup

This repo includes comprehensive IBM Bob integration:

### Bob Configuration Files

- **`.bob/custom_modes.yaml`** - Defines the `triage-partner` custom mode
- **`.bob/rules-triage-partner/`** - Response contracts and investigation guidance
  - `01-response-contract.md` - JSON structure for triage responses
  - `02-investigation-guidance.md` - Investigation best practices
  - `03-handoff-quality.md` - Handoff document standards
- **`.bob/commands/`** - Six specialized Bob commands:
  - `/triage-alert` - Translate raw alerts
  - `/analyze-incident` - Deep root cause analysis
  - `/generate-handoff` - Create shift handoffs
  - `/compare-regression` - Check PR regression risk
  - `/suggest-mitigation` - Get mitigation strategies
  - `/explain-metric` - Explain monitoring metrics
- **`.bob/BOB_INTEGRATION_GUIDE.md`** - Complete integration documentation
- **`.bob/BOB_USAGE_REPORT.md`** - Comprehensive usage report with examples and metrics

### Bob API Integration

When the project is opened in IBM Bob, Bob detects the project mode from `.bob/custom_modes.yaml`. The app backend calls IBM Bob through these endpoints:

- **`/api/av-triage`** - Alert translation and triage
- **`/api/ai-analyze`** - Deep incident analysis
- **`/api/ai-mitigation`** - Mitigation strategy generation

Configure these environment variables for full Bob integration:

```text
IBM_BOB_API_URL=https://your-bob-endpoint.example
IBM_BOB_API_KEY=your_bob_token
IBM_BOB_MODE=triage-partner
IBM_BOB_PROJECT_ID=optional_project_id
```

If those values are not configured, the app falls back to the optional model providers below, then to the local demo triage playbook.

## Optional Model Setup

The API can call Qwen through DashScope's OpenAI-compatible endpoint:

```text
QWEN_API_KEY=your_qwen_or_dashscope_key
QWEN_MODEL=qwen-plus
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

`DASHSCOPE_API_KEY` also works in place of `QWEN_API_KEY`.

Optional OpenRouter fallback:

```text
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=qwen/qwen3.6-plus
OPENROUTER_SITE_URL=https://your-site.example
OPENROUTER_APP_NAME=Bob on Call
```

## Optional Supabase Setup

Run the SQL in `supabase-schema.sql` in your Supabase SQL editor. The app writes through the server API with a server-side key.

```text
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_side_key
```

## Demo Story

### Basic Workflow
1. **Alert Translation**: Start with the checkout latency alert and run Alert Translator
   - Bob converts raw metrics into plain-English summary
   - Shows affected files, recent commits, and first three checks
   - Displays Bob's actions in the activity log

2. **Deep Analysis**: Switch to Shift Brain and click "Ask Bob for Deep Analysis"
   - Bob provides root cause hypothesis with confidence level
   - Maps dependency chains and service relationships
   - Generates ordered investigation path with time estimates

3. **Mitigation Strategies**: Click "Get Mitigation Strategies"
   - Bob suggests immediate actions (0-5 min) with commands
   - Provides short-term fixes (5-30 min) and long-term solutions
   - Includes rollback procedures and communication templates

4. **Investigation Notes**: Add investigation notes in Shift Brain
   - Bob maintains context across the incident timeline
   - Generates instant re-briefs incorporating new information

5. **Shift Handoff**: Open Handoff Generator
   - Select incidents for handoff
   - Bob creates structured Markdown summary
   - Copy or download for team communication

6. **Regression Detection**: Use Regression Radar
   - Paste a PR diff
   - Bob compares against active incident areas
   - Provides risk assessment and recommended guardrails

### Bob Action Log
Throughout the demo, watch the "Bob actions" panel showing:
- 🔄 Alert translation steps
- 🔍 Analysis activities
- 💡 Mitigation generation
- 📝 Context updates
- Color-coded categories for easy tracking

## Bob Commands

Use these commands in the IBM Bob interface:

```bash
/triage-alert <raw-alert-text>           # Quick alert analysis
/analyze-incident <incident-title>       # Deep investigation
/suggest-mitigation <description>        # Get mitigation options
/generate-handoff [incident-ids...]      # Create shift handoff
/compare-regression <pr-url-or-diff>     # Check regression risk
/explain-metric <metric-name>            # Understand metrics
```

## Architecture

### Bob Integration Flow

```
User Input → Bob on Call UI → API Endpoints → IBM Bob (Primary)
                                            ↓ (fallback)
                                          Qwen/OpenRouter (Secondary)
                                            ↓ (fallback)
                                          Local Playbook (Tertiary)
```

### Key Components

- **Frontend** (`src/App.jsx`): React UI with Bob-powered features
- **API Layer** (`api/`): Node.js endpoints calling Bob services
- **Bob Config** (`.bob/`): Custom mode, rules, and commands
- **Fallback System**: Three-tier reliability (Bob → Models → Local)
