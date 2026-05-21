import type { Campaign, Lead } from "@/types";

export const leads: Lead[] = [
  {
    id: "lead_001",
    company: "Northstar BioSystems",
    domain: "northstarbio.io",
    segment: "Healthcare AI",
    location: "Boston, MA",
    employees: 420,
    revenue: "$84M",
    score: 94,
    intent: "Hiring RevOps + evaluating data enrichment",
    status: "Qualified",
    owner: "Maya",
    saved: true,
    signals: ["Series C", "New CRO", "HubSpot migration"],
    summary: "Fast-growing healthtech operator adding commercial analytics and looking to unify scattered account data."
  },
  {
    id: "lead_002",
    company: "AtlasGrid Energy",
    domain: "atlasgrid.energy",
    segment: "Climate SaaS",
    location: "Austin, TX",
    employees: 260,
    revenue: "$38M",
    score: 88,
    intent: "Expanded enterprise SDR team",
    status: "Researching",
    owner: "Noah",
    saved: false,
    signals: ["Funding", "G2 spike", "Outbound roles"],
    summary: "Grid analytics platform moving upmarket after a new utility partnership and higher demand-gen spend."
  },
  {
    id: "lead_003",
    company: "Quantora Finance",
    domain: "quantora.capital",
    segment: "Fintech",
    location: "New York, NY",
    employees: 780,
    revenue: "$140M",
    score: 82,
    intent: "Salesforce data hygiene initiative",
    status: "Contacted",
    owner: "Iris",
    saved: true,
    signals: ["New VP Sales", "Data quality posts", "SOC2 refresh"],
    summary: "Fintech team with complex buying groups and visible CRM cleanup pressure across revenue teams."
  },
  {
    id: "lead_004",
    company: "LuminaWorks",
    domain: "luminaworks.ai",
    segment: "B2B AI",
    location: "San Francisco, CA",
    employees: 150,
    revenue: "$22M",
    score: 76,
    intent: "Building founder-led outbound motion",
    status: "Nurture",
    owner: "Elle",
    saved: false,
    signals: ["Product launch", "Founder posts", "Clay stack"],
    summary: "Early GTM team testing persona-specific outbound after releasing a workflow automation suite."
  },
  {
    id: "lead_005",
    company: "Keystone Logistics",
    domain: "keystonelogistics.com",
    segment: "Supply Chain",
    location: "Chicago, IL",
    employees: 940,
    revenue: "$210M",
    score: 91,
    intent: "Target account expansion into manufacturing",
    status: "Qualified",
    owner: "Maya",
    saved: true,
    signals: ["Territory launch", "ABM agency", "Hiring AEs"],
    summary: "Established logistics provider with fresh enterprise territories and need for account intelligence at scale."
  }
];

export const campaigns: Campaign[] = [
  { name: "Healthcare AI CFOs", sent: 1280, replies: 164, pipeline: "$610K", conversion: 12.8 },
  { name: "Climate SaaS RevOps", sent: 840, replies: 112, pipeline: "$392K", conversion: 13.3 },
  { name: "Fintech Data Hygiene", sent: 1125, replies: 97, pipeline: "$455K", conversion: 8.6 },
  { name: "Supply Chain Expansion", sent: 690, replies: 89, pipeline: "$520K", conversion: 12.9 }
];

export const chartData = [
  { month: "Jan", leads: 180, pipeline: 240 },
  { month: "Feb", leads: 250, pipeline: 330 },
  { month: "Mar", leads: 310, pipeline: 380 },
  { month: "Apr", leads: 420, pipeline: 510 },
  { month: "May", leads: 520, pipeline: 760 },
  { month: "Jun", leads: 610, pipeline: 920 }
];

export const navItems = [
  "Dashboard",
  "Lead Explorer",
  "Company Intelligence",
  "Outreach",
  "Campaigns",
  "Analytics",
  "Settings"
] as const;
