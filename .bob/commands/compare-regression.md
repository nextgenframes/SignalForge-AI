---
description: Compare a PR diff against active incidents to detect potential regressions
argument-hint: <pr-url-or-diff>
---

Analyze this PR for regression risk using Triage Partner mode:

$1

Compare against all active incidents and provide:
1. Overlap score (0-100) with each active incident
2. Specific code areas that intersect with incident symptoms
3. Risk level (Critical/High/Medium/Low) with justification
4. Recommended pre-merge validation steps
5. Monitoring metrics to watch post-deploy
6. Rollback plan if regression occurs

Return structured JSON for the Regression Radar panel.