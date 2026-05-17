const { status } = require("./_bob-status");

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed." });
  }

  const current = await status(process.env);
  return json(res, 200, {
    ready: current.ibm_bob_connection === "connected",
    provider: current.ibm_bob_connection === "connected" ? "IBM Bob" : current.qwen_ready ? "Fallback model" : "Local fallback",
    model: current.ibm_bob_mode,
    status: current,
  });
};
