import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  dasherOperationsRecords,
  merchantPerformanceRecords,
  predictiveIncidentPredictions,
  remoteAssistanceIncidents,
  smartscaleChecks
} from "@/lib/data";

function demoVoiceAnswer(query: string) {
  const lowered = query.toLowerCase();

  if (lowered.includes("critical incident")) {
    const incidents = remoteAssistanceIncidents
      .filter((incident) => incident.escalationUrgency === "critical" || incident.escalationUrgency === "high")
      .map((incident) => `${incident.robotName} in ${incident.city}: ${incident.operationalSummary}`);
    return incidents.length ? incidents.join(" ") : "No critical incidents right now.";
  }

  if (lowered.includes("mismatch")) {
    const storeRates = merchantPerformanceRecords
      .map((record) => {
        const storeChecks = smartscaleChecks.filter((check) => check.storeId === record.storeId);
        const mismatches = storeChecks.filter((check) => check.result === "fail" || check.result === "review" || check.result === "skipped").length;
        const rate = Math.round((mismatches / Math.max(storeChecks.length, 1)) * 100);
        return `${record.storeName}: ${rate}% mismatch rate`;
      })
      .sort((a, b) => b.localeCompare(a));
    return `Highest SmartScale mismatch leaders: ${storeRates.slice(0, 3).join(". ")}.`;
  }

  if (lowered.includes("robot r102") || lowered.includes("r102")) {
    return "Robot R102 is not in current demo fleet. Highest active robot risk is Robot R-331 in Austin with high recovery risk from battery sag and offline store delays.";
  }

  if (lowered.includes("dasher friction") || lowered.includes("merchant")) {
    const topStores = dasherOperationsRecords
      .slice()
      .sort((a, b) => b.dasherFrictionScore - a.dasherFrictionScore)
      .slice(0, 3)
      .map((record) => `${record.storeName} at friction ${record.dasherFrictionScore}`);
    return `Top Dasher friction stores: ${topStores.join(", ")}.`;
  }

  const topPrediction = predictiveIncidentPredictions[0];
  return `Top operational risk is ${topPrediction.entityName}. ${topPrediction.predictedIssue}. Recommended action: ${topPrediction.recommendedPreventionAction}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = String(body.query ?? "").trim();

  if (!query) {
    return NextResponse.json({ answer: "Ask about incidents, SmartScale mismatch rates, store risk, or robot status.", source: "demo" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ answer: demoVoiceAnswer(query), source: "demo" });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const context = {
    incidents: remoteAssistanceIncidents,
    smartscale: merchantPerformanceRecords.map((record) => ({ storeName: record.storeName, market: record.market, mainOperationalIssue: record.mainOperationalIssue })),
    dashers: dasherOperationsRecords.map((record) => ({ storeName: record.storeName, friction: record.dasherFrictionScore })),
    predictions: predictiveIncidentPredictions.map((prediction) => ({
      entityName: prediction.entityName,
      riskScore: prediction.riskScore,
      predictedIssue: prediction.predictedIssue
    }))
  };

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content:
          "You are a concise voice operations assistant for autonomous delivery operations. Answer with short spoken-style summaries for operators using provided context only."
      },
      {
        role: "user",
        content: `Voice query: ${query}\nContext: ${JSON.stringify(context)}`
      }
    ]
  });

  return NextResponse.json({ answer: response.output_text, source: "openai" });
}
