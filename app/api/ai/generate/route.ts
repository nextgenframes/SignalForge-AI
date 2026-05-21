import OpenAI from "openai";
import { NextResponse } from "next/server";

const fallback = {
  summary:
    "SignalForge found buying triggers across hiring, funding, and CRM consolidation. Prioritize RevOps and GTM leadership with a data-quality angle.",
  outreach:
    "Subject: cleaner GTM signals for your next segment\n\nHi Maya,\n\nNoticed your team is expanding outbound while consolidating account data. SignalForge AI can surface high-intent accounts, summarize buying triggers, and generate persona-specific outreach before reps start manual research.\n\nWorth comparing notes next week?",
  score: 87
};

const demoLeadDiscovery = {
  leads: [
    {
      companyName: "HelioGrid Analytics",
      website: "https://heliogrid.ai",
      reason: "Climate data platform with Series B funding, 120-employee GTM team, and active RevOps hiring.",
      leadScore: 92,
      hiringActivity: "Hiring SDR Manager, Revenue Operations Analyst, and Enterprise AE.",
      outreachAngle: "Lead with faster territory prioritization for utility and energy accounts."
    },
    {
      companyName: "QuantLayer Health",
      website: "https://quantlayer.health",
      reason: "Healthcare AI vendor expanding enterprise sales after payer partnerships and new product launch.",
      leadScore: 88,
      hiringActivity: "Open roles in growth marketing, sales engineering, and customer success.",
      outreachAngle: "Show how SignalForge maps buying committees from clinical and financial signals."
    },
    {
      companyName: "OrbitOps",
      website: "https://orbitops.com",
      reason: "Mid-market workflow SaaS with public hiring spikes and intent around CRM enrichment.",
      leadScore: 84,
      hiringActivity: "Hiring outbound SDRs and lifecycle marketing lead.",
      outreachAngle: "Pitch AI lead scoring to improve outbound focus before SDR ramp."
    }
  ]
};

const demoOutreach = {
  coldEmail:
    "Subject: prioritizing the accounts already showing buying intent\n\nHi Jordan,\n\nNoticed your team is scaling outbound while hiring around RevOps and enterprise sales. SignalForge AI helps teams find high-fit accounts, explain why they match ICP, and turn that research into role-specific outreach.\n\nWorth a quick look at how your reps could prioritize the next 50 accounts?",
  linkedInDM:
    "Jordan, saw your team expanding GTM hiring. SignalForge AI helps surface accounts showing funding, hiring, and intent signals, then drafts outreach around the real trigger. Open to seeing a 3-minute example?",
  followUpSequence: [
    "Day 2: Share 3 signal examples and ask if account prioritization is active.",
    "Day 5: Send mini teardown of one target account and suggested angle.",
    "Day 9: Offer to build a sample lead list for their current segment."
  ],
  callOpener:
    "I’m calling because your team looks to be scaling outbound, and we help GTM teams identify which accounts are worth rep time before sequencing starts."
};

const demoCompanyIntel = {
  summary: "HelioGrid Analytics sells AI-powered grid forecasting software to energy operators and utilities.",
  businessModel: "B2B SaaS with enterprise annual contracts, implementation services, and expansion by region.",
  likelyPainPoints: ["Messy target account data", "Long enterprise buying committees", "Manual account research", "Slow SDR ramp"],
  growthIndicators: ["Recent Series B", "New VP Sales", "Hiring enterprise AEs", "Partner launch with utilities"],
  hiringTrends: ["Revenue Operations", "Sales Engineering", "Enterprise Account Executives", "Lifecycle Marketing"],
  gtmOpportunities: ["ABM list creation", "Persona-specific utility outreach", "CRM enrichment", "Expansion campaign triggers"]
};

const demoLeadScore = {
  score: 91,
  confidence: "High",
  reasoning:
    "Strong industry fit, fresh funding, accelerating GTM hiring, and clear account-data pain indicate near-term buying potential.",
  recommendedAction: "Route to enterprise SDR, generate CFO and RevOps variants, and start a 9-day follow-up sequence."
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const task = body.task ?? "lead-summary";
  const company = body.company ?? "target account";

  if (!process.env.OPENAI_API_KEY) {
    if (task === "lead-discovery") return NextResponse.json({ ...demoLeadDiscovery, source: "demo" });
    if (task === "outreach-suite") return NextResponse.json({ ...demoOutreach, source: "demo" });
    if (task === "company-intelligence") return NextResponse.json({ ...demoCompanyIntel, source: "demo" });
    if (task === "lead-score") return NextResponse.json({ ...demoLeadScore, source: "demo" });
    return NextResponse.json({ ...fallback, source: "demo" });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content:
          "You are SignalForge AI, a concise GTM intelligence agent. Return practical account research, lead discovery, lead scoring, and outreach for B2B SaaS sellers. Use concrete GTM reasoning."
      },
      {
        role: "user",
        content: `Task: ${task}\nContext: ${JSON.stringify({ company, inputs: body.inputs })}\nReturn JSON matching the schema.`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "signalforge_generation",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            outreach: { type: "string" },
            score: { type: "number" },
            leads: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  companyName: { type: "string" },
                  website: { type: "string" },
                  reason: { type: "string" },
                  leadScore: { type: "number" },
                  hiringActivity: { type: "string" },
                  outreachAngle: { type: "string" }
                },
                required: ["companyName", "website", "reason", "leadScore", "hiringActivity", "outreachAngle"]
              }
            },
            coldEmail: { type: "string" },
            linkedInDM: { type: "string" },
            followUpSequence: { type: "array", items: { type: "string" } },
            callOpener: { type: "string" },
            businessModel: { type: "string" },
            likelyPainPoints: { type: "array", items: { type: "string" } },
            growthIndicators: { type: "array", items: { type: "string" } },
            hiringTrends: { type: "array", items: { type: "string" } },
            gtmOpportunities: { type: "array", items: { type: "string" } },
            confidence: { type: "string" },
            reasoning: { type: "string" },
            recommendedAction: { type: "string" }
          },
          required: [
            "summary",
            "outreach",
            "score",
            "leads",
            "coldEmail",
            "linkedInDM",
            "followUpSequence",
            "callOpener",
            "businessModel",
            "likelyPainPoints",
            "growthIndicators",
            "hiringTrends",
            "gtmOpportunities",
            "confidence",
            "reasoning",
            "recommendedAction"
          ]
        }
      }
    }
  });

  const content = response.output_text;
  return NextResponse.json(JSON.parse(content));
}
