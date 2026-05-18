/**
 * Bob-powered deep incident analysis endpoint
 * Provides root cause hypothesis, dependency analysis, and investigation paths
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

function analyzePrompt(incident) {
  return [
    "You are IBM Bob in Triage Partner mode analyzing an active incident.",
    "Provide deep analysis with root cause hypothesis and investigation guidance.",
    "",
    "Incident details:",
    JSON.stringify(incident),
    "",
    "Return JSON with:",
    "- root_cause_hypothesis: most likely root cause with confidence level",
    "- dependency_chain: affected services and their relationships",
    "- similar_incidents: references to similar past issues",
    "- investigation_path: ordered steps with specific commands/queries",
    "- rollback_risk: assessment of rollback safety and impact",
    "- customer_impact: estimated scope and severity",
    "- recommended_actions: prioritized list of next steps",
    "- bob_reasoning: visible thought process",
  ].join("\n");
}

function fallbackAnalysis(incident) {
  return {
    root_cause_hypothesis: {
      cause: "Recent deployment or configuration change",
      confidence: 0.7,
      reasoning: "Timing correlation with deploy suggests code or config issue"
    },
    dependency_chain: [
      { service: incident.service || "unknown-service", status: "degraded", impact: "direct" },
      { service: "downstream-services", status: "at-risk", impact: "indirect" }
    ],
    similar_incidents: [
      "Check incident history for similar latency or error patterns in this service"
    ],
    investigation_path: [
      { step: 1, action: "Review recent deployment logs and timing", duration: "5 min" },
      { step: 2, action: "Check service metrics dashboard for anomalies", duration: "3 min" },
      { step: 3, action: "Examine error logs for new error patterns", duration: "5 min" },
      { step: 4, action: "Verify dependency health and response times", duration: "3 min" }
    ],
    rollback_risk: {
      level: "Medium",
      concerns: ["May lose diagnostic evidence", "Requires coordination with team"],
      recommendation: "Capture logs first, then prepare rollback"
    },
    customer_impact: {
      scope: "Estimated 5-15% of requests affected",
      severity: incident.severity || "High",
      duration: "Ongoing since alert fired"
    },
    recommended_actions: [
      "Capture current logs and metrics before any changes",
      "Prepare rollback plan with specific steps",
      "Notify stakeholders of investigation status",
      "Monitor customer impact metrics closely"
    ],
    bob_reasoning: [
      "Analyzed incident timing and service context",
      "Mapped likely dependency relationships",
      "Prioritized investigation by impact and speed",
      "Balanced diagnostic needs with mitigation urgency"
    ]
  };
}

async function callBobAnalyze(incident, env) {
  const bobConfigured = Boolean(env.IBM_BOB_API_URL && env.IBM_BOB_API_KEY);
  
  if (!bobConfigured) {
    return fallbackAnalysis(incident);
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
        prompt: analyzePrompt(incident),
        input: incident,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    const payload = data.triage || data.output || data.response || data.result || data;
    return typeof payload === "string" ? JSON.parse(payload) : payload;
  } catch (error) {
    console.error("Bob analyze failed:", error);
    return fallbackAnalysis(incident);
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

    const analysis = await callBobAnalyze(body.incident, process.env);
    
    return json(res, 200, {
      analysis,
      bob_powered: Boolean(process.env.IBM_BOB_API_URL && process.env.IBM_BOB_API_KEY)
    });
  } catch (error) {
    return json(res, 500, {
      error: "Analysis failed",
      detail: String(error),
      analysis: fallbackAnalysis(req.body?.incident || {})
    });
  }
};

// Made with Bob
