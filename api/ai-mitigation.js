/**
 * Bob-powered mitigation strategy endpoint
 * Provides immediate, short-term, and long-term mitigation recommendations
 */

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body) {
      resolve(typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body);
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });
}

function mitigationPrompt(incident) {
  return [
    "You are IBM Bob in Triage Partner mode suggesting mitigation strategies.",
    "Provide actionable, time-boxed mitigation options prioritized by impact and speed.",
    "",
    "Incident details:",
    JSON.stringify(incident),
    "",
    "Return JSON with:",
    "- immediate_actions: 0-5 minute actions to stop the bleeding (array of {action, impact, risk, command})",
    "- short_term_fixes: 5-30 minute stabilization steps (array of {action, impact, risk, duration})",
    "- long_term_solutions: prevent recurrence (array of {solution, effort, priority})",
    "- rollback_procedure: step-by-step rollback if needed",
    "- communication_templates: stakeholder update templates",
    "- monitoring_checklist: metrics to watch during and after mitigation",
    "- success_criteria: how to know if mitigation worked",
    "- bob_recommendations: prioritized recommendation with reasoning",
  ].join("\n");
}

function fallbackMitigation(incident) {
  const isCritical = incident.severity === "Critical";
  
  return {
    immediate_actions: [
      {
        action: "Enable feature flag to disable recent changes",
        impact: "High - stops issue immediately",
        risk: "Low - reversible",
        command: "kubectl set env deployment/service FEATURE_FLAG=false"
      },
      {
        action: "Scale up service replicas to handle load",
        impact: "Medium - distributes load",
        risk: "Low - may increase costs",
        command: "kubectl scale deployment/service --replicas=10"
      },
      {
        action: "Increase timeout values temporarily",
        impact: "Medium - reduces timeout errors",
        risk: "Medium - may mask underlying issue",
        command: "Update config: timeout_ms=5000"
      }
    ],
    short_term_fixes: [
      {
        action: "Roll back to previous stable deployment",
        impact: "High - restores known good state",
        risk: "Medium - loses recent features",
        duration: "10-15 minutes"
      },
      {
        action: "Restart affected service pods",
        impact: "Medium - clears transient state",
        risk: "Low - brief service interruption",
        duration: "5 minutes"
      },
      {
        action: "Clear cache to force fresh data",
        impact: "Medium - eliminates stale data",
        risk: "Medium - temporary performance hit",
        duration: "2 minutes"
      }
    ],
    long_term_solutions: [
      {
        solution: "Implement circuit breaker pattern for dependency calls",
        effort: "Medium - 2-3 days",
        priority: "High"
      },
      {
        solution: "Add comprehensive retry logic with exponential backoff",
        effort: "Low - 1 day",
        priority: "High"
      },
      {
        solution: "Improve monitoring and alerting thresholds",
        effort: "Low - 4 hours",
        priority: "Medium"
      },
      {
        solution: "Add automated canary deployment validation",
        effort: "High - 1 week",
        priority: "Medium"
      }
    ],
    rollback_procedure: [
      "1. Notify team in incident channel",
      "2. Capture current logs: kubectl logs deployment/service > pre-rollback.log",
      "3. Execute rollback: kubectl rollout undo deployment/service",
      "4. Monitor metrics for 5 minutes to confirm stability",
      "5. Update incident status and notify stakeholders",
      "6. Schedule post-mortem within 24 hours"
    ],
    communication_templates: {
      initial: `🚨 Incident Update: ${incident.title}\nStatus: Investigating\nImpact: ${incident.severity}\nNext update: 15 minutes`,
      mitigating: `🔧 Mitigation in progress for: ${incident.title}\nAction: [specific action]\nExpected resolution: [timeframe]`,
      resolved: `✅ Resolved: ${incident.title}\nDuration: [duration]\nRoot cause: [brief cause]\nFollow-up: Post-mortem scheduled`
    },
    monitoring_checklist: [
      "Error rate returning to baseline (<1%)",
      "Latency p99 below threshold (<500ms)",
      "CPU and memory usage stable",
      "Dependency health checks passing",
      "No new error patterns in logs",
      "Customer impact metrics improving"
    ],
    success_criteria: {
      immediate: "Error rate drops by 50% within 5 minutes",
      short_term: "Service returns to normal SLO within 30 minutes",
      long_term: "No recurrence for 7 days after fix deployment"
    },
    bob_recommendations: [
      {
        priority: 1,
        action: isCritical ? "Immediate rollback" : "Enable feature flag",
        reasoning: isCritical 
          ? "Critical severity requires fastest path to stability"
          : "Feature flag provides quick mitigation with easy reversal",
        next_steps: "Monitor for 5 minutes, then proceed to short-term fixes if needed"
      }
    ]
  };
}

async function callBobMitigation(incident, env) {
  const bobConfigured = Boolean(env.IBM_BOB_API_URL && env.IBM_BOB_API_KEY);
  
  if (!bobConfigured) {
    return fallbackMitigation(incident);
  }

  try {
    const response = await fetch(env.IBM_BOB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.IBM_BOB_API_KEY}`,
        ...(env.IBM_BOB_PROJECT_ID ? { "X-IBM-Bob-Project": env.IBM_BOB_PROJECT_ID } : {}),
      },
      body: JSON.stringify({
        mode: env.IBM_BOB_MODE || "triage-partner",
        prompt: mitigationPrompt(incident),
        input: incident,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    const payload = data.mitigation || data.output || data.response || data.result || data;
    return typeof payload === "string" ? JSON.parse(payload) : payload;
  } catch (error) {
    console.error("Bob mitigation failed:", error);
    return fallbackMitigation(incident);
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { error: "Method not allowed." });
    }

    const body = await readBody(req);
    
    if (!body.incident) {
      return json(res, 400, { error: "incident object is required." });
    }

    const mitigation = await callBobMitigation(body.incident, process.env);
    
    return json(res, 200, {
      mitigation,
      bob_powered: Boolean(process.env.IBM_BOB_API_URL && process.env.IBM_BOB_API_KEY)
    });
  } catch (error) {
    return json(res, 500, {
      error: "Mitigation suggestion failed",
      detail: String(error),
      mitigation: fallbackMitigation(req.body?.incident || {})
    });
  }
};

// Made with Bob
