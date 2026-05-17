const HEALTH_CACHE_MS = 30_000;

let cachedProbe = {
  expiresAt: 0,
  value: null,
};

function baseStatus(env) {
  const bobConfigured = Boolean(env.IBM_BOB_API_URL && env.IBM_BOB_API_KEY);
  return {
    ibm_bob_configured: bobConfigured,
    ibm_bob_ready: bobConfigured,
    ibm_bob_mode: env.IBM_BOB_MODE || "triage-partner",
    ibm_bob_connection: bobConfigured ? "checking" : "not_configured",
    ibm_bob_message: bobConfigured ? "IBM Bob configured. Awaiting live check." : "IBM Bob not configured.",
    qwen_ready: Boolean(env.QWEN_API_KEY || env.DASHSCOPE_API_KEY || env.OPENROUTER_API_KEY),
    qwen_model: env.QWEN_MODEL || env.OPENROUTER_MODEL || "qwen-plus",
    supabase_ready: Boolean(env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY)),
    fallback_ready: true,
  };
}

async function probeIbmBob(env) {
  if (!env.IBM_BOB_API_URL || !env.IBM_BOB_API_KEY) {
    return {
      connection: "not_configured",
      message: "IBM Bob credentials missing.",
      checked_at: new Date().toISOString(),
    };
  }

  if (cachedProbe.value && cachedProbe.expiresAt > Date.now()) {
    return cachedProbe.value;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

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
        prompt: "Health check. Return JSON only.",
        input: {
          title: "health-check",
          service: "triage-status",
          raw_alert: "health-check",
        },
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    const result = response.ok
      ? {
          connection: "connected",
          message: "IBM Bob responded to live health check.",
          checked_at: new Date().toISOString(),
        }
      : {
          connection: "degraded",
          message: `IBM Bob returned HTTP ${response.status}.`,
          checked_at: new Date().toISOString(),
        };

    cachedProbe = {
      value: result,
      expiresAt: Date.now() + HEALTH_CACHE_MS,
    };
    return result;
  } catch (error) {
    const result = {
      connection: "degraded",
      message: `IBM Bob health check failed: ${String(error.message || error)}`,
      checked_at: new Date().toISOString(),
    };
    cachedProbe = {
      value: result,
      expiresAt: Date.now() + HEALTH_CACHE_MS,
    };
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

async function status(env) {
  const base = baseStatus(env);
  const probe = await probeIbmBob(env);
  return {
    ...base,
    ibm_bob_connection: probe.connection,
    ibm_bob_message: probe.message,
    ibm_bob_checked_at: probe.checked_at,
  };
}

module.exports = {
  baseStatus,
  probeIbmBob,
  status,
};
