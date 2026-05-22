"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ChevronRight,
  Copy,
  Cpu,
  Download,
  Filter,
  Flame,
  Headphones,
  Heart,
  LayoutDashboard,
  Link,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Pause,
  Phone,
  Play,
  PlugZap,
  Route,
  Scale,
  Radar,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Siren,
  SkipBack,
  SkipForward,
  Sparkles,
  TriangleAlert,
  Truck,
  Target,
  Upload,
  Users,
  Wand2,
  Wrench,
  Workflow,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  campaigns,
  chartData,
  customerRecoveryCases,
  dasherOperationsRecords,
  dispatchOptimizationRecommendations,
  deliverySimulationScenarios,
  executiveOperationsSnapshot,
  fleetHealthPredictions,
  incidentReplayRecords,
  leads,
  merchantPerformanceRecords,
  multiAgentSupervisorSnapshot,
  navItems,
  predictiveIncidentPredictions,
  pickupZoneHeatmap,
  remoteAssistanceIncidents,
  smartscaleChecks,
  smartscaleDevices,
  smartscaleFraudRecords,
  smartscaleStores,
  voiceOpsCommandExamples,
  type CustomerRecoveryCase,
  type DasherOperationsRecord,
  type DispatchOptimizationRecommendation,
  type DeliverySimulationScenario,
  type ExecutiveOperationsSnapshot,
  type FleetHealthPrediction,
  type IncidentReplayRecord,
  type MerchantPerformanceRecord,
  type MultiAgentSupervisorSnapshot,
  type PredictiveIncidentPrediction,
  type PickupZoneHeatmapPoint,
  type RemoteAssistanceIncident,
  type SmartScaleCheck,
  type SmartScaleDeviceStatus,
  type SmartScaleFraudRecord,
  type SmartScaleIssueType,
  type SmartScaleSeverity
} from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types";

const navIcons = [LayoutDashboard, Users, BarChart3, Scale, CircleAlert, Building2, Truck, Rocket, Route, Headphones, Workflow, ShieldCheck, MessageSquare, Search, Bot, Mail, Target, BarChart3, Settings];

type DiscoveredLead = {
  companyName: string;
  website: string;
  reason: string;
  leadScore: number;
  hiringActivity: string;
  outreachAngle: string;
};

type OutreachSuite = {
  coldEmail: string;
  linkedInDM: string;
  followUpSequence: string[];
  callOpener: string;
};

type ShellProps = {
  activePage?: string;
  landing?: boolean;
};

function pageHref(item: string) {
  if (item === "Dashboard") return "/dashboard";
  if (item === "Multi-Agent Supervisor") return "/multi-agent-supervisor";
  if (item === "Executive Ops") return "/executive-ops";
  if (item === "SmartScale Operations") return "/smartscale-operations";
  if (item === "SmartScale Fraud") return "/smartscale-fraud";
  if (item === "Merchant Intelligence") return "/merchant-intelligence";
  if (item === "Dasher Operations") return "/dasher-operations";
  if (item === "Simulation Lab") return "/simulation-lab";
  if (item === "Incident Replay") return "/incident-replay";
  if (item === "Voice Ops") return "/voice-ops";
  if (item === "Dispatch Optimizer") return "/dispatch-optimizer";
  if (item === "Fleet Health") return "/fleet-health";
  if (item === "Customer Recovery") return "/customer-recovery";
  return `/${item.toLowerCase().replaceAll(" ", "-").replace("outreach", "outreach-generator").replace("campaigns", "campaign-manager")}`;
}

function formatIssueLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function SignalForgeShell({ activePage = "Dashboard", landing = false }: ShellProps) {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead>(leads[0]);
  const [savedIds, setSavedIds] = useState(() => new Set(leads.filter((lead) => lead.saved).map((lead) => lead.id)));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aiResult, setAiResult] = useState(selectedLead.summary);
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentLauncherOpen, setAgentLauncherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [smartscaleStore, setSmartscaleStore] = useState("All stores");
  const [smartscaleIssueType, setSmartscaleIssueType] = useState("All issues");
  const [smartscaleSeverity, setSmartscaleSeverity] = useState("All severities");
  const [smartscaleDeviceStatus, setSmartscaleDeviceStatus] = useState("All devices");
  const [smartscaleDateRange, setSmartscaleDateRange] = useState("Today");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesQuery = [lead.company, lead.segment, lead.location, lead.intent]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesSegment = segment === "All" || lead.segment === segment;
      return matchesQuery && matchesSegment;
    });
  }, [query, segment]);

  const segments = ["All", ...Array.from(new Set(leads.map((lead) => lead.segment)))];
  const smartscaleStoreOptions = ["All stores", ...smartscaleStores.map((store) => store.store)];
  const smartscaleIssueOptions = ["All issues", ...Array.from(new Set(smartscaleChecks.map((check) => check.issueType)))];
  const smartscaleSeverityOptions = ["All severities", "low", "medium", "high", "critical"];
  const smartscaleDeviceOptions = ["All devices", "online", "offline", "maintenance"];

  const visibleSmartScaleChecks = useMemo(() => {
    const now = new Date("2026-05-21T16:00:00.000Z");
    const todayKey = now.toISOString().slice(0, 10);

    return smartscaleChecks.filter((check) => {
      const store = smartscaleStores.find((item) => item.id === check.storeId);
      const device = smartscaleDevices.find((item) => item.id === check.deviceId);
      const checkDate = new Date(check.date);
      const diffMs = now.getTime() - checkDate.getTime();
      const daysDiff = diffMs / (1000 * 60 * 60 * 24);
      const checkDayKey = checkDate.toISOString().slice(0, 10);

      const matchesStore = smartscaleStore === "All stores" || store?.store === smartscaleStore;
      const matchesIssue = smartscaleIssueType === "All issues" || check.issueType === smartscaleIssueType;
      const matchesSeverity = smartscaleSeverity === "All severities" || check.severity === smartscaleSeverity;
      const matchesDevice = smartscaleDeviceStatus === "All devices" || device?.status === smartscaleDeviceStatus;
      const matchesDate =
        smartscaleDateRange === "Today" ? checkDayKey === todayKey :
        smartscaleDateRange === "Last 7 days" ? daysDiff < 7 :
        smartscaleDateRange === "Last 30 days" ? daysDiff < 30 :
        true;

      return matchesStore && matchesIssue && matchesSeverity && matchesDevice && matchesDate;
    });
  }, [smartscaleStore, smartscaleIssueType, smartscaleSeverity, smartscaleDeviceStatus, smartscaleDateRange]);

  async function runGeneration(task: "summary" | "outreach") {
    setIsGenerating(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, company: selectedLead })
    });
    const data = await response.json();
    setAiResult(data.summary);
    setEmail(data.outreach);
    setIsGenerating(false);
  }

  function toggleSaved(id: string) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const mainContent = activePage === "Lead Explorer" ? (
    <LeadExplorer
      query={query}
      setQuery={setQuery}
      segment={segment}
      setSegment={setSegment}
      segments={segments}
      leads={filteredLeads}
      selectedLead={selectedLead}
      setSelectedLead={setSelectedLead}
      savedIds={savedIds}
      toggleSaved={toggleSaved}
    />
  ) : activePage === "SmartScale Operations" ? (
    <SmartScaleOperations
      checks={visibleSmartScaleChecks}
      storeFilter={smartscaleStore}
      setStoreFilter={setSmartscaleStore}
      storeOptions={smartscaleStoreOptions}
      issueFilter={smartscaleIssueType}
      setIssueFilter={setSmartscaleIssueType}
      issueOptions={smartscaleIssueOptions}
      severityFilter={smartscaleSeverity}
      setSeverityFilter={setSmartscaleSeverity}
      severityOptions={smartscaleSeverityOptions}
      deviceFilter={smartscaleDeviceStatus}
      setDeviceFilter={setSmartscaleDeviceStatus}
      deviceOptions={smartscaleDeviceOptions}
      dateRange={smartscaleDateRange}
      setDateRange={setSmartscaleDateRange}
    />
  ) : activePage === "SmartScale Fraud" ? (
    <SmartScaleFraudDashboard />
  ) : activePage === "Multi-Agent Supervisor" ? (
    <MultiAgentSupervisorDashboard />
  ) : activePage === "Executive Ops" ? (
    <ExecutiveOpsDashboard />
  ) : activePage === "Merchant Intelligence" ? (
    <MerchantIntelligenceDashboard />
  ) : activePage === "Dasher Operations" ? (
    <DasherOperationsDashboard />
  ) : activePage === "Simulation Lab" ? (
    <SimulationLabDashboard />
  ) : activePage === "Incident Replay" ? (
    <IncidentReplayDashboard />
  ) : activePage === "Voice Ops" ? (
    <VoiceOpsDashboard />
  ) : activePage === "Dispatch Optimizer" ? (
    <DispatchOptimizerDashboard />
  ) : activePage === "Fleet Health" ? (
    <FleetHealthDashboard />
  ) : activePage === "Customer Recovery" ? (
    <CustomerRecoveryDashboard />
  ) : activePage === "Company Intelligence" ? (
    <CompanyIntelligence selectedLead={selectedLead} aiResult={aiResult} runGeneration={runGeneration} isGenerating={isGenerating} />
  ) : activePage === "Outreach" ? (
    <OutreachGenerator selectedLead={selectedLead} email={email} setEmail={setEmail} runGeneration={runGeneration} isGenerating={isGenerating} />
  ) : activePage === "Campaigns" ? (
    <CampaignManager />
  ) : activePage === "Analytics" ? (
    <Analytics />
  ) : activePage === "Settings" ? (
    <SettingsPanel />
  ) : (
    <DashboardOverview
      query={query}
      setQuery={setQuery}
      leads={filteredLeads}
      selectedLead={selectedLead}
      setSelectedLead={setSelectedLead}
      savedIds={savedIds}
      toggleSaved={toggleSaved}
      runGeneration={runGeneration}
      aiResult={aiResult}
      isGenerating={isGenerating}
    />
  );

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="grid-fade pointer-events-none fixed inset-0 opacity-60" />
      <div className="relative flex min-h-screen">
        <Sidebar activePage={activePage} open={mobileNavOpen} setOpen={setMobileNavOpen} />
        <section className="flex min-w-0 flex-1 flex-col">
          <Topbar
            activePage={activePage}
            notificationsOpen={notificationsOpen}
            setAgentLauncherOpen={setAgentLauncherOpen}
            setMobileNavOpen={setMobileNavOpen}
            setNotificationsOpen={setNotificationsOpen}
          />
          {landing ? (
            <>
              <LandingHero />
              <LandingSections />
            </>
          ) : (
            <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-6">
              <div className="min-w-0">{mainContent}</div>
              {activePage === "SmartScale Operations" ? (
                <SmartScaleRail checks={visibleSmartScaleChecks} />
              ) : (
                <RightRail selectedLead={selectedLead} savedIds={savedIds} runGeneration={runGeneration} isGenerating={isGenerating} />
              )}
            </div>
          )}
        </section>
        {agentLauncherOpen ? <AgentLauncher onClose={() => setAgentLauncherOpen(false)} /> : null}
      </div>
    </main>
  );
}

function Sidebar({ activePage, open, setOpen }: { activePage: string; open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <aside
      className={cn(
        "glass-panel fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col p-4 transition-transform lg:static lg:translate-x-0",
        open && "translate-x-0"
      )}
    >
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="signal-ring grid size-10 place-items-center rounded-lg">
            <Sparkles className="size-5 text-background" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Smart Dash</p>
            <h1 className="text-xl font-bold tracking-tight">AI Agent</h1>
          </div>
        </a>
        <Button className="lg:hidden" size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close navigation">
          <X className="size-4" />
        </Button>
      </div>
      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item, index) => {
          const Icon = navIcons[index];
          return (
            <a
              key={item}
              href={pageHref(item)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground",
                activePage === item && "bg-primary/12 text-primary"
              )}
            >
              <Icon className="size-4" />
              {item}
            </a>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="size-4 text-accent" />
          Supabase Auth
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">Cookie-backed sessions, RLS-ready saved leads, and realtime CRM updates.</p>
      </div>
    </aside>
  );
}

function Topbar({
  activePage,
  notificationsOpen,
  setAgentLauncherOpen,
  setMobileNavOpen,
  setNotificationsOpen
}: {
  activePage: string;
  notificationsOpen: boolean;
  setAgentLauncherOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-background/76 px-4 backdrop-blur-xl lg:px-6">
      <Button className="lg:hidden" size="icon" variant="ghost" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
        <Menu className="size-4" />
      </Button>
      <div className="min-w-0">
        <p className="hidden text-xs text-muted-foreground sm:block">Revenue command center</p>
        <h2 className="truncate text-lg font-semibold">{activePage}</h2>
      </div>
      <div className="ml-auto hidden min-w-72 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 md:flex">
        <Search className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search accounts, campaigns, personas</span>
      </div>
      <div className="relative">
      <Button size="icon" variant="outline" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}>
        <Bell className="size-4" />
      </Button>
      {notificationsOpen ? (
        <div className="glass-panel absolute right-0 top-12 z-50 w-72 rounded-lg p-3">
          {[
            "3 new ICP accounts detected",
            "Healthcare AI campaign reply rate up 3.8%",
            "Northstar BioSystems ready for outreach"
          ].map((item) => (
            <div key={item} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-white/5">
              {item}
            </div>
          ))}
        </div>
      ) : null}
      </div>
      <Button onClick={() => setAgentLauncherOpen(true)}>
        <Sparkles className="size-4" data-icon="inline-start" />
        <span className="hidden sm:inline">New agent</span>
        <span className="sm:hidden">New</span>
      </Button>
    </header>
  );
}

function AgentLauncher({ onClose }: { onClose: () => void }) {
  const agents = [
    ["Lead Discovery Agent", "Find ICP-matched companies from GTM signals.", "/lead-explorer", Radar],
    ["Multi-Agent Supervisor", "Coordinate fleet, SmartScale, dispatch, merchant, customer, and maintenance agents.", "/multi-agent-supervisor", Users],
    ["Executive Operations Dashboard", "Track uptime, success, savings, trends, forecasts, and market comparisons.", "/executive-ops", BarChart3],
    ["SmartScale Fraud and Abuse Detection", "Detect override abuse, suspicious weight patterns, fake ready signals, and abnormal refunds.", "/smartscale-fraud", CircleAlert],
    ["Merchant Performance Intelligence", "Score store operations risk and recommend merchant actions.", "/merchant-intelligence", Building2],
    ["Dasher Operations AI Agent", "Track pickup friction, failed handoffs, and pickup-zone risk.", "/dasher-operations", Truck],
    ["Simulation Engine", "Replay incidents, test recovery actions, and simulate dispatch decisions.", "/simulation-lab", Rocket],
    ["Incident Replay System", "Reconstruct incident timelines, AI decisions, operator actions, and export replay reports.", "/incident-replay", Route],
    ["Voice Operations Assistant", "Handle spoken queries, spoken alerts, and realtime operator voice responses.", "/voice-ops", Headphones],
    ["Dispatch Optimization System", "Recommend robot assignment, route, batching, and charging decisions.", "/dispatch-optimizer", Workflow],
    ["Fleet Health Prediction System", "Predict component failures, maintenance urgency, and downtime risk across the robot fleet.", "/fleet-health", ShieldCheck],
    ["Customer Recovery AI Agent", "Generate explanations, refunds, escalation, coupons, and ETA recovery plans.", "/customer-recovery", MessageSquare],
    ["Company Intelligence Agent", "Summarize business model, pain, growth, hiring, and GTM opportunities.", "/company-intelligence", Bot],
    ["Outreach Generator", "Create email, LinkedIn DM, follow-ups, and call opener.", "/outreach-generator", Mail],
    ["Lead Scoring Engine", "Score accounts and recommend next action.", "/dashboard", Flame],
    ["Predictive Incident Prevention Agent", "Predict delivery failures, ETA drift, and recovery risk before incidents occur.", "/dashboard", Siren],
    ["Remote Assistance AI Copilot", "Summarize robot incidents, flag hazards, and suggest safe operator recovery commands.", "/dashboard", Headphones]
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/56 p-4 backdrop-blur-sm sm:place-items-center" role="dialog" aria-modal="true" aria-label="New agent">
      <div className="glass-panel w-full max-w-2xl rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Launch new AI agent</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose workflow. Agent opens with live demo inputs ready.</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close agent launcher">
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {agents.map(([title, body, href, Icon]) => (
            <a
              key={title as string}
              href={href as string}
              className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/40 hover:bg-primary/8"
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md bg-primary/12">
                  <Icon className="size-4 text-primary" />
                </div>
                <p className="font-semibold">{title as string}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body as string}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandingHero() {
  return (
    <section className="px-4 py-10 lg:px-6 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">The AI-Powered GTM Operating System</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Find high-intent accounts, research buying signals, score leads, and launch personalized outbound from one AI-native GTM workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/dashboard" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_32px_rgba(88,246,255,0.24)] transition-colors hover:bg-primary/90">
              Open dashboard <ChevronRight className="size-4" />
            </a>
            <a href="/analytics" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white/4 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-white/8">
              View live pipeline
            </a>
          </div>
        </div>
        <div className="glass-panel overflow-hidden rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">AI discovery pulse</span>
            <Badge variant="accent">Live</Badge>
          </div>
          <div className="mt-5 h-64">
            <Chart />
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingSections() {
  return (
    <div className="flex flex-col gap-6 px-4 pb-10 lg:px-6">
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["Problem", "Revenue teams waste hours stitching together funding, hiring, intent, CRM, and outreach data before reps can act."],
          ["Impact", "Good accounts go cold while SDRs manually research, score, personalize, follow up, and update CRM fields."],
          ["SignalForge fix", "AI agents turn market signals into scored lead lists, account briefs, outreach, and automated GTM workflows."]
        ].map(([title, body]) => (
          <Card key={title} className="glass-panel">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="leading-6">{body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Everything a modern GTM pod expects from an AI-native operating layer.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              "AI lead discovery",
              "Company intelligence",
              "Outreach generation",
              "Lead scoring",
              "Campaign CRM",
              "Realtime analytics"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-md bg-white/5 p-3">
                <CheckCircle2 className="size-4 text-accent" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="glass-panel overflow-hidden">
          <CardHeader>
            <CardTitle>Demo Preview</CardTitle>
            <CardDescription>Animated dashboard preview with pipeline, lead score, and AI agent output.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr]">
              <div className="h-64 rounded-lg border border-white/10 bg-white/5 p-4">
                <Chart />
              </div>
              <div className="flex flex-col gap-3">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{lead.company}</span>
                      <Badge variant="accent">{lead.score}</Badge>
                    </div>
                    <Progress className="mt-3" value={lead.score} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["Maya Chen", "VP Sales, Northstar BioSystems", "SignalForge turned account research into a repeatable SDR motion in one week."],
          ["Eli Grant", "RevOps Lead, AtlasGrid", "The scoring rationale helped sales and marketing agree on which accounts deserved spend."],
          ["Priya Rao", "Founder, LuminaWorks", "We moved from founder-led guessing to AI-built target lists and personalized outbound."]
        ].map(([name, role, quote]) => (
          <Card key={name} className="glass-panel">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">“{quote}”</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["Launch", "$99/mo", "Lead discovery, intelligence cards, AI outreach, and exports."],
          ["Scale", "$299/mo", "Campaign automation, CRM sync, Slack alerts, and AI SDR workflows."],
          ["Enterprise", "Custom", "Voice agents, LinkedIn automation, SSO, permissions, and managed rollout."]
        ].map(([plan, price, copy]) => (
          <Card key={plan} className="glass-panel">
            <CardHeader>
              <CardTitle>{plan}</CardTitle>
              <CardDescription>{copy}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{price}</p>
              <a
                href={plan === "Enterprise" ? "/settings" : "/lead-explorer"}
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_32px_rgba(88,246,255,0.24)] transition-colors hover:bg-primary/90"
              >
                {plan === "Enterprise" ? "Talk to sales" : "Start now"}
              </a>
            </CardContent>
          </Card>
        ))}
      </section>

      <AutomationGrid />

      <section className="glass-panel rounded-lg p-6 text-center md:p-10">
        <h2 className="text-3xl font-bold tracking-tight">Forge your next pipeline wave with AI.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Launch a lead discovery agent, score accounts, generate outreach, sync CRM activity, and book meetings from one workspace.
        </p>
        <a href="/lead-explorer" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Start discovering leads <ChevronRight className="size-4" />
        </a>
      </section>
    </div>
  );
}

function DashboardOverview(props: {
  query: string;
  setQuery: (query: string) => void;
  leads: Lead[];
  selectedLead: Lead;
  setSelectedLead: (lead: Lead) => void;
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
  runGeneration: (task: "summary" | "outreach") => void;
  aiResult: string;
  isGenerating: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <MetricGrid />
      <PredictiveIncidentOverview />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <LeadTable {...props} />
        <AgentPanel selectedLead={props.selectedLead} aiResult={props.aiResult} runGeneration={props.runGeneration} isGenerating={props.isGenerating} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <CampaignManager compact />
        <Analytics compact />
      </div>
      <RemoteAssistanceCopilot />
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <LeadScoringEngine selectedLead={props.selectedLead} />
        <AutomationGrid compact />
      </div>
    </div>
  );
}

function MetricGrid() {
  const metrics = [
    ["Qualified leads", "2,418", "+18.6%", Users],
    ["AI score lift", "34%", "+7.2%", Flame],
    ["Pipeline sourced", "$2.4M", "+$420K", Target],
    ["Reply rate", "12.1%", "+3.8%", Mail]
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value, delta, Icon]) => (
        <Card key={label as string} className="glass-panel">
          <CardHeader className="flex-row items-start justify-between p-4">
            <div>
              <CardDescription>{label as string}</CardDescription>
              <CardTitle className="mt-2 text-2xl">{value as string}</CardTitle>
            </div>
            <div className="grid size-10 place-items-center rounded-md bg-white/8">
              <Icon className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Badge variant="accent">{delta as string} this month</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PredictiveIncidentOverview() {
  const highRiskCount = predictiveIncidentPredictions.filter((prediction) => prediction.riskScore >= 80).length;
  const avgRisk = Math.round(
    predictiveIncidentPredictions.reduce((sum, prediction) => sum + prediction.riskScore, 0) /
      Math.max(predictiveIncidentPredictions.length, 1)
  );
  const maxEtaDrift = Math.max(...predictiveIncidentPredictions.map((prediction) => prediction.etaDegradationMinutes));
  const topRisk = predictiveIncidentPredictions[0];

  return (
    <div className="grid gap-4">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,92,122,0.14),rgba(88,246,255,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Predictive Incident Prevention Agent</CardTitle>
            <CardDescription>Pre-incident delivery failure, ETA drift, recovery risk, and customer dissatisfaction forecast.</CardDescription>
          </div>
          <Badge variant="accent">{highRiskCount} high-risk routes</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <RiskMetric label="Average risk score" value={avgRisk.toString()} caption="Across live predictions" icon={Siren} />
            <RiskMetric label="Largest ETA drift" value={`${maxEtaDrift} min`} caption="Before incident occurs" icon={Clock3} />
            <RiskMetric label="Top failure probability" value={`${topRisk.deliveryFailureProbability}%`} caption="Most exposed active route" icon={CircleAlert} />
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Highest risk right now</p>
                <p className="mt-2 text-xl font-semibold">{topRisk.entityName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{topRisk.predictedIssue}</p>
              </div>
              <div className="signal-ring grid size-16 place-items-center rounded-full p-[1px]">
                <div className="grid size-full place-items-center rounded-full bg-background text-lg font-bold">{topRisk.riskScore}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{topRisk.recommendedPreventionAction}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <PredictiveIncidentTable predictions={predictiveIncidentPredictions} />
        <PredictiveIncidentActions predictions={predictiveIncidentPredictions} />
      </div>
    </div>
  );
}

function MerchantIntelligenceDashboard() {
  const averageScore = Math.round(
    merchantPerformanceRecords.reduce((sum, record) => sum + record.storeScore, 0) / Math.max(merchantPerformanceRecords.length, 1)
  );
  const criticalStores = merchantPerformanceRecords.filter((record) => record.riskLevel === "critical").length;
  const decliningStores = merchantPerformanceRecords.filter((record) => record.trendDirection === "declining").length;
  const averageRefundRate =
    Math.round(
      (merchantPerformanceRecords.reduce((sum, record) => sum + record.refundRate, 0) / Math.max(merchantPerformanceRecords.length, 1)) * 10
    ) / 10;
  const highlightedRecord = [...merchantPerformanceRecords].sort((a, b) => a.storeScore - b.storeScore)[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Average store score" value={averageScore.toString()} caption="Network-wide merchant ops health" icon={Building2} />
        <RiskMetric label="Critical-risk stores" value={criticalStores.toString()} caption="Need immediate intervention" icon={TriangleAlert} />
        <RiskMetric label="Declining stores" value={decliningStores.toString()} caption="Week-over-week performance slip" icon={CircleAlert} />
        <RiskMetric label="Avg refund rate" value={`${averageRefundRate}%`} caption="Customer recovery pressure" icon={RefreshCw} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(204,255,77,0.08),rgba(88,246,255,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Merchant Performance Intelligence</CardTitle>
            <CardDescription>Store operations score from order accuracy, SmartScale usage, prep delays, Dasher wait, complaints, refunds, and issue recurrence.</CardDescription>
          </div>
          <Badge variant="accent">{highlightedRecord.storeName} highest priority</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <MerchantScoreTable records={merchantPerformanceRecords} />
          <MerchantActionPanel highlightedRecord={highlightedRecord} records={merchantPerformanceRecords} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        {merchantPerformanceRecords.map((record) => (
          <Card key={record.id} className="glass-panel">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{record.storeName}</CardTitle>
                  <CardDescription>{record.market}</CardDescription>
                </div>
                <Badge variant={record.riskLevel === "critical" || record.riskLevel === "high" ? "accent" : "secondary"}>
                  {record.trendDirection}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Store score</span>
                <span className="text-2xl font-semibold">{record.storeScore}</span>
              </div>
              <Progress value={record.storeScore} />
              <MetricLine label="Main operational issue" value={record.mainOperationalIssue} />
              <MetricLine label="Risk level" value={record.riskLevel} />
              <MetricLine label="Recommended actions" value={record.recommendedStoreActions.join(", ")} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DasherOperationsDashboard() {
  const avgFriction = Math.round(
    dasherOperationsRecords.reduce((sum, record) => sum + record.dasherFrictionScore, 0) / Math.max(dasherOperationsRecords.length, 1)
  );
  const avgEfficiency = Math.round(
    dasherOperationsRecords.reduce((sum, record) => sum + record.pickupEfficiency, 0) / Math.max(dasherOperationsRecords.length, 1)
  );
  const highRiskStores = dasherOperationsRecords.filter((record) => record.dasherFrictionScore >= 75).length;
  const worstStore = [...dasherOperationsRecords].sort((a, b) => b.dasherFrictionScore - a.dasherFrictionScore)[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Avg Dasher friction" value={avgFriction.toString()} caption="Pickup pain across live stores" icon={Truck} />
        <RiskMetric label="Pickup efficiency" value={`${avgEfficiency}%`} caption="Successful handoff flow health" icon={CheckCircle2} />
        <RiskMetric label="High-risk stores" value={highRiskStores.toString()} caption="Need ops intervention" icon={TriangleAlert} />
        <RiskMetric label="Worst pickup zone" value={worstStore.zoneName} caption="Highest friction hot spot" icon={MapPin} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(255,92,122,0.08))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Dasher Operations AI Agent</CardTitle>
            <CardDescription>Pickup delays, wait times, failed handoffs, wrong orders, congestion, parking friction, and repeated merchant issue tracking.</CardDescription>
          </div>
          <Badge variant="accent">{worstStore.storeName} highest friction</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <DasherOperationsTable records={dasherOperationsRecords} />
          <DasherRecommendationsPanel records={dasherOperationsRecords} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <PickupZoneHeatmapCard points={pickupZoneHeatmap} />
        <HighRiskStoresCard records={dasherOperationsRecords} />
      </div>
    </div>
  );
}

function SimulationLabDashboard() {
  const [scenarioId, setScenarioId] = useState(deliverySimulationScenarios[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [minute, setMinute] = useState(0);
  const scenario =
    deliverySimulationScenarios.find((item) => item.id === scenarioId) ?? deliverySimulationScenarios[0];

  useEffect(() => {
    setMinute(0);
    setIsPlaying(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setMinute((current) => {
        if (current >= scenario.durationMinutes) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 600);
    return () => window.clearInterval(timer);
  }, [isPlaying, scenario.durationMinutes]);

  const progress = (minute / Math.max(scenario.durationMinutes, 1)) * 100;
  const visibleIncidents = scenario.incidentOverlays.filter((overlay) => overlay.time <= minute);
  const currentPoint =
    [...scenario.routePoints].reverse().find((point) => point.eventTime <= minute) ?? scenario.routePoints[0];

  return (
    <div className="flex flex-col gap-4">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(204,255,77,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Autonomous Delivery Simulation Engine</CardTitle>
            <CardDescription>Replay routes, stress-test recovery actions, and evaluate dispatch decisions before live incidents occur.</CardDescription>
          </div>
          <select
            className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
            value={scenarioId}
            onChange={(event) => setScenarioId(event.target.value)}
            aria-label="Scenario"
          >
            {deliverySimulationScenarios.map((item) => (
              <option key={item.id} className="bg-card" value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Playback controls</CardTitle>
                <CardDescription>Replay incidents, step through timeline, and test operator decisions.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMinute((current) => Math.max(0, current - 1))} aria-label="Back one minute">
                    <SkipBack className="size-4" />
                  </Button>
                  <Button onClick={() => setIsPlaying((current) => !current)}>
                    {isPlaying ? <Pause className="size-4" data-icon="inline-start" /> : <Play className="size-4" data-icon="inline-start" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setMinute((current) => Math.min(scenario.durationMinutes, current + 1))} aria-label="Forward one minute">
                    <SkipForward className="size-4" />
                  </Button>
                  <Button variant="outline" onClick={() => { setMinute(0); setIsPlaying(false); }}>
                    <RefreshCw className="size-4" data-icon="inline-start" />
                    Reset
                  </Button>
                  <Badge variant="secondary">Minute {minute} / {scenario.durationMinutes}</Badge>
                </div>
                <Progress value={progress} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricLine label="Pedestrian density" value={scenario.pedestrianDensity} />
                  <MetricLine label="Weather impact" value={scenario.weatherImpact} />
                  <MetricLine label="Robot failure mode" value={scenario.robotFailureMode} />
                  <MetricLine label="Merchant delay" value={`${scenario.merchantDelayMinutes} min`} />
                  <MetricLine label="Dasher arrival" value={`${scenario.dasherArrivalOffset > 0 ? "+" : ""}${scenario.dasherArrivalOffset} min`} />
                  <MetricLine label="SmartScale issue" value={formatIssueLabel(scenario.smartscaleIssue)} />
                </div>
              </CardContent>
            </Card>

            <SimulationRouteCard scenario={scenario} minute={minute} currentPoint={currentPoint} visibleIncidents={visibleIncidents} />
          </div>

          <SimulationDecisionPanel scenario={scenario} visibleIncidents={visibleIncidents} />
        </CardContent>
      </Card>
    </div>
  );
}

function VoiceOpsDashboard() {
  const [query, setQuery] = useState("");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState(
    "Voice assistant ready. Ask about critical incidents, SmartScale mismatch leaders, or robot status."
  );
  const [status, setStatus] = useState("Idle");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [voiceSessionState, setVoiceSessionState] = useState("Disconnected");
  const criticalIncidents = remoteAssistanceIncidents.filter(
    (incident) => incident.escalationUrgency === "critical" || incident.escalationUrgency === "high"
  );

  async function runQuery(nextQuery?: string) {
    const prompt = (nextQuery ?? query).trim();
    if (!prompt) return;
    setStatus("Thinking");
    try {
      const res = await fetch("/api/voice/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt })
      });
      const data = await res.json();
      setTranscript(prompt);
      setResponseText(data.answer ?? "No answer returned.");
      setStatus(data.source === "demo" ? "Answered from demo ops data" : "Answered with AI");
    } catch {
      setStatus("Query failed");
    }
  }

  async function speakResponse(text: string) {
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text })
      });
      if (!res.ok) throw new Error("speech-failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
      };
      await audio.play();
    } catch {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    }
  }

  async function startListening() {
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? ((window as typeof window & {
            SpeechRecognition?: new () => {
              lang: string;
              interimResults: boolean;
              maxAlternatives: number;
              onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
              onerror: (() => void) | null;
              onend: (() => void) | null;
              start: () => void;
            };
            webkitSpeechRecognition?: new () => {
              lang: string;
              interimResults: boolean;
              maxAlternatives: number;
              onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
              onerror: (() => void) | null;
              onend: (() => void) | null;
              start: () => void;
            };
          }).SpeechRecognition ??
            (window as typeof window & { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition)
        : undefined;

    if (!SpeechRecognitionCtor) {
      setStatus("Browser speech recognition unavailable");
      return;
    }

    const recognition = new SpeechRecognitionCtor() as {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
    };

    setIsListening(true);
    setStatus("Listening");
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const spokenText = event.results[0]?.[0]?.transcript ?? "";
      setQuery(spokenText);
      void runQuery(spokenText);
    };
    recognition.onerror = () => {
      setStatus("Speech recognition failed");
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }

  async function connectRealtimeVoice() {
    setVoiceSessionState("Connecting");
    try {
      const res = await fetch("/api/voice/token");
      const data = await res.json();
      setVoiceSessionState(data.client_secret?.value ? "Realtime token ready" : "Demo mode");
      if (data.client_secret?.value) {
        setStatus("Realtime voice token minted");
      } else {
        setStatus("Realtime token unavailable; demo mode");
      }
    } catch {
      setVoiceSessionState("Failed");
    }
  }

  async function transcribeUpload(file: File) {
    setIsUploading(true);
    setStatus("Transcribing upload");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      const text = String(data.text ?? "").trim();
      if (text) {
        setQuery(text);
        void runQuery(text);
      } else {
        setStatus("No speech detected in upload");
      }
    } catch {
      setStatus("Upload transcription failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(255,255,255,0.04))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Voice-Enabled Operations Assistant</CardTitle>
            <CardDescription>Voice queries, spoken alerts, operator commands, and AI responses with STT, TTS, and Realtime session support.</CardDescription>
          </div>
          <Badge variant="accent">{voiceSessionState}</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Voice query console</CardTitle>
                <CardDescription>Ask spoken or typed questions about incidents, stores, robots, and SmartScale operations.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask operations question" />
                  <Button onClick={() => void runQuery()}>
                    <Bot className="size-4" data-icon="inline-start" />
                    Ask
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant={isListening ? "secondary" : "outline"} onClick={() => void startListening()}>
                    <Headphones className="size-4" data-icon="inline-start" />
                    {isListening ? "Listening..." : "Start voice query"}
                  </Button>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-white/5 px-4 py-2 text-sm font-medium text-foreground">
                    <Upload className="size-4" />
                    {isUploading ? "Uploading..." : "Upload voice clip"}
                    <input
                      className="hidden"
                      type="file"
                      accept="audio/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void transcribeUpload(file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <Button variant="outline" onClick={() => void connectRealtimeVoice()}>
                    <Workflow className="size-4" data-icon="inline-start" />
                    Connect realtime
                  </Button>
                  <Button variant="outline" onClick={() => void speakResponse(responseText)} disabled={isSpeaking}>
                    <Bell className="size-4" data-icon="inline-start" />
                    {isSpeaking ? "Speaking..." : "Play voice response"}
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {voiceOpsCommandExamples.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      className="rounded-lg border border-white/10 bg-background/60 p-3 text-left transition-colors hover:bg-background"
                      onClick={() => {
                        setQuery(example.command);
                        void runQuery(example.command);
                      }}
                    >
                      <p className="text-sm font-medium">{example.command}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{example.category}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>AI voice response</CardTitle>
                <CardDescription>Transcript, incident summary, and spoken answer output.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <MetricLine label="Status" value={status} />
                <MetricLine label="Latest transcript" value={transcript || "No voice query captured yet."} />
                <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
                  {responseText}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Spoken alerts</CardTitle>
                <CardDescription>High-priority incidents ready for voice playback.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {criticalIncidents.map((incident) => (
                  <div key={incident.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{incident.robotName}</p>
                        <p className="text-sm text-muted-foreground">{incident.city}</p>
                      </div>
                      <Badge variant="accent">{incident.escalationUrgency}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{incident.operationalSummary}</p>
                    <Button className="mt-3" variant="outline" onClick={() => void speakResponse(`${incident.robotName}. ${incident.operationalSummary}`)}>
                      <Bell className="size-4" data-icon="inline-start" />
                      Speak alert
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Operator command deck</CardTitle>
                <CardDescription>Quick command targets surfaced from active operations signals.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {["show_critical_incidents", "rank_mismatch_stores", "summarize_robot_status", "read_high_risk_merchants"].map((command) => (
                  <div key={command} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/60 px-4 py-3">
                    <span className="text-sm font-medium">{command}</span>
                    <Badge variant="secondary">command</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DispatchOptimizerDashboard() {
  const [selectedId, setSelectedId] = useState(dispatchOptimizationRecommendations[0]?.id ?? "");
  const selected =
    dispatchOptimizationRecommendations.find((item) => item.id === selectedId) ?? dispatchOptimizationRecommendations[0];
  const avgEfficiency = Math.round(
    dispatchOptimizationRecommendations.reduce((sum, item) => sum + item.routeEfficiencyScore, 0) /
      Math.max(dispatchOptimizationRecommendations.length, 1)
  );
  const criticalCount = dispatchOptimizationRecommendations.filter((item) => item.priorityLevel === "critical").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Average route efficiency" value={`${avgEfficiency}%`} caption="Across optimization batches" icon={Route} />
        <RiskMetric label="Critical dispatch groups" value={criticalCount.toString()} caption="Need immediate optimizer action" icon={TriangleAlert} />
        <RiskMetric label="Best robot choice" value={selected.recommendedRobot} caption="Current active recommendation" icon={Bot} />
        <RiskMetric label="Estimated time saved" value={selected.estimatedTimeSaved} caption="From optimized plan" icon={Clock3} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(204,255,77,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>AI Dispatch Optimization System</CardTitle>
            <CardDescription>Optimize robot assignment, batching, charging, route efficiency, congestion avoidance, and delivery priority under live constraints.</CardDescription>
          </div>
          <select
            className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            aria-label="Dispatch batch"
          >
            {dispatchOptimizationRecommendations.map((item) => (
              <option key={item.id} value={item.id} className="bg-card">
                {item.orderGroup}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <DispatchRecommendationCard recommendation={selected} />
          <DispatchConstraintsPanel recommendation={selected} allRecommendations={dispatchOptimizationRecommendations} />
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerRecoveryDashboard() {
  const [selectedId, setSelectedId] = useState(customerRecoveryCases[0]?.id ?? "");
  const selected =
    customerRecoveryCases.find((item) => item.id === selectedId) ?? customerRecoveryCases[0];
  const avgPriority = Math.round(
    customerRecoveryCases.reduce((sum, item) => sum + item.satisfactionPriority, 0) / Math.max(customerRecoveryCases.length, 1)
  );
  const fullRefundCount = customerRecoveryCases.filter((item) => item.refundRecommendation.toLowerCase().includes("full refund")).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Avg satisfaction priority" value={avgPriority.toString()} caption="Customer impact weighting" icon={Heart} />
        <RiskMetric label="Full refund cases" value={fullRefundCount.toString()} caption="Highest cost recoveries" icon={RefreshCw} />
        <RiskMetric label="Active recovery case" value={selected.orderId} caption="Current selected order" icon={MessageSquare} />
        <RiskMetric label="Recovery cost" value={selected.estimatedRecoveryCost} caption="Cost-aware recommendation" icon={Target} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,92,122,0.08),rgba(88,246,255,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Customer Recovery AI Agent</CardTitle>
            <CardDescription>Generate customer explanation, refund guidance, support escalation, coupon suggestion, and ETA updates while balancing satisfaction and operational cost.</CardDescription>
          </div>
          <select
            className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            aria-label="Customer recovery case"
          >
            {customerRecoveryCases.map((item) => (
              <option key={item.id} value={item.id} className="bg-card">
                {item.orderId}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <CustomerRecoveryOutputCard caseItem={selected} />
          <CustomerRecoveryQueuePanel cases={customerRecoveryCases} selectedId={selected.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function FleetHealthDashboard() {
  const [selectedId, setSelectedId] = useState(fleetHealthPredictions[0]?.id ?? "");
  const selected =
    fleetHealthPredictions.find((item) => item.id === selectedId) ?? fleetHealthPredictions[0];
  const criticalCount = fleetHealthPredictions.filter((item) => item.maintenanceUrgency === "critical").length;
  const avgDowntimeRisk = Math.round(
    fleetHealthPredictions.reduce((sum, item) => sum + item.fleetDowntimeRisk, 0) / Math.max(fleetHealthPredictions.length, 1)
  );
  const hottestMotor = Math.max(...fleetHealthPredictions.map((item) => item.motorTemperatureC));
  const avgSensorHealth = Math.round(
    fleetHealthPredictions.reduce((sum, item) => sum + item.sensorHealth, 0) / Math.max(fleetHealthPredictions.length, 1)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Critical maintenance" value={criticalCount.toString()} caption="Robots needing immediate attention" icon={TriangleAlert} />
        <RiskMetric label="Avg downtime risk" value={`${avgDowntimeRisk}%`} caption="Predicted fleet interruption exposure" icon={ShieldCheck} />
        <RiskMetric label="Peak motor temp" value={`${hottestMotor}C`} caption="Highest live thermal reading" icon={Flame} />
        <RiskMetric label="Avg sensor health" value={`${avgSensorHealth}%`} caption="Navigation readiness across fleet" icon={Radar} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,176,81,0.1),rgba(88,246,255,0.05))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Fleet Health Prediction System</CardTitle>
            <CardDescription>Monitor motor temperatures, battery degradation, sensor health, network reliability, CPU usage, braking anomalies, and wheel resistance to predict failures before they become downtime.</CardDescription>
          </div>
          <select
            className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            aria-label="Fleet health robot"
          >
            {fleetHealthPredictions.map((item) => (
              <option key={item.id} value={item.id} className="bg-card">
                {item.robotName}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <FleetHealthDetailCard prediction={selected} />
          <FleetHealthQueuePanel predictions={fleetHealthPredictions} selectedId={selected.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function FleetHealthDetailCard({ prediction }: { prediction: FleetHealthPrediction }) {
  const signals = [
    ["Motor temp", `${prediction.motorTemperatureC}C`],
    ["Battery degradation", `${prediction.batteryDegradation}%`],
    ["Sensor health", `${prediction.sensorHealth}%`],
    ["Network reliability", `${prediction.networkReliability}%`],
    ["CPU usage", `${prediction.cpuUsage}%`],
    ["Braking anomalies", prediction.brakingAnomalies.toString()],
    ["Wheel resistance", prediction.wheelResistance.toString()],
    ["Downtime risk", `${prediction.fleetDowntimeRisk}%`]
  ];

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Predicted maintenance output</CardTitle>
        <CardDescription>Component failure forecast and recommended maintenance plan.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-lg border border-white/10 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{prediction.robotName}</p>
              <p className="text-sm text-muted-foreground">{prediction.market}</p>
            </div>
            <Badge variant={prediction.maintenanceUrgency === "critical" ? "accent" : prediction.maintenanceUrgency === "high" ? "default" : "secondary"}>
              {prediction.maintenanceUrgency}
            </Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MetricLine label="Likely component failure" value={prediction.likelyComponentFailure} />
            <MetricLine label="Maintenance window" value={prediction.recommendedMaintenanceWindow} />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {signals.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Auto-generated maintenance recommendations</CardTitle>
            <CardDescription>Suggested interventions to lower failure risk and avoid downtime.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {prediction.maintenanceRecommendations.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function FleetHealthQueuePanel({
  predictions,
  selectedId
}: {
  predictions: FleetHealthPrediction[];
  selectedId: string;
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Maintenance urgency queue</CardTitle>
          <CardDescription>Robots ranked by downtime risk and failure urgency.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {predictions
            .slice()
            .sort((a, b) => b.fleetDowntimeRisk - a.fleetDowntimeRisk)
            .map((item) => (
              <div key={item.id} className={cn("rounded-lg border border-white/10 bg-background/60 p-4", item.id === selectedId && "border-primary/40")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.robotName}</p>
                    <p className="text-sm text-muted-foreground">{item.likelyComponentFailure}</p>
                  </div>
                  <Badge variant={item.maintenanceUrgency === "critical" ? "accent" : item.maintenanceUrgency === "high" ? "default" : "secondary"}>
                    {item.maintenanceUrgency}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MetricLine label="Downtime risk" value={`${item.fleetDowntimeRisk}%`} />
                  <MetricLine label="CPU / network" value={`${item.cpuUsage}% / ${item.networkReliability}%`} />
                  <MetricLine label="Brake anomalies" value={item.brakingAnomalies.toString()} />
                  <MetricLine label="Wheel resistance" value={item.wheelResistance.toString()} />
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Failure pattern summary</CardTitle>
          <CardDescription>Quick read on what is driving fleet health risk.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <Flame className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Thermal stress is the strongest near-term predictor in San Francisco and Austin, driven by heavy routes and braking load.</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <Cpu className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>High CPU and lower network reliability are correlating with slower recovery behavior on already degraded robots.</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Preemptive maintenance windows are lowering expected downtime more cheaply than field rescues or same-day part swaps.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SmartScaleFraudDashboard() {
  const [selectedId, setSelectedId] = useState(smartscaleFraudRecords[0]?.id ?? "");
  const selected = smartscaleFraudRecords.find((item) => item.id === selectedId) ?? smartscaleFraudRecords[0];
  const highRiskCount = smartscaleFraudRecords.filter((item) => item.riskLevel === "high" || item.riskLevel === "critical").length;
  const avgRisk = Math.round(
    smartscaleFraudRecords.reduce((sum, item) => sum + item.fraudRiskScore, 0) / Math.max(smartscaleFraudRecords.length, 1)
  );
  const overrideClusters = smartscaleFraudRecords.reduce((sum, item) => sum + item.repeatedStaffOverrides, 0);
  const refundOutlierCount = smartscaleFraudRecords.filter((item) => item.abnormalRefundRate >= 6).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Avg fraud risk" value={avgRisk.toString()} caption="Network SmartScale abuse score" icon={CircleAlert} />
        <RiskMetric label="High-risk merchants" value={highRiskCount.toString()} caption="High or critical abuse signals" icon={ShieldCheck} />
        <RiskMetric label="Override clusters" value={overrideClusters.toString()} caption="Repeated staff override events" icon={ListChecks} />
        <RiskMetric label="Refund outliers" value={refundOutlierCount.toString()} caption="Merchants with abnormal refund behavior" icon={RefreshCw} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,92,122,0.08),rgba(255,186,64,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>SmartScale fraud and abuse detection</CardTitle>
            <CardDescription>Detect repeated staff overrides, suspicious weight behavior, fake ready signals, repeated missing-item claims, and abnormal refund activity.</CardDescription>
          </div>
          <select
            className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            aria-label="Fraud risk merchant"
          >
            {smartscaleFraudRecords.map((item) => {
              const store = smartscaleStores.find((storeItem) => storeItem.id === item.storeId);
              return (
                <option key={item.id} value={item.id} className="bg-card">
                  {store?.store ?? item.id}
                </option>
              );
            })}
          </select>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <SmartScaleFraudDetailCard record={selected} />
          <SmartScaleFraudQueuePanel records={smartscaleFraudRecords} selectedId={selected.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function SmartScaleFraudDetailCard({ record }: { record: SmartScaleFraudRecord }) {
  const store = smartscaleStores.find((item) => item.id === record.storeId);
  const device = smartscaleDevices.find((item) => item.id === record.deviceId);

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Fraud detection output</CardTitle>
        <CardDescription>Risk score, suspicious activity summary, abuse alerts, and recommended operational response.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-lg border border-white/10 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{store?.store ?? record.storeId}</p>
              <p className="text-sm text-muted-foreground">{store?.market ?? "Unknown market"} · {device?.name ?? record.deviceId}</p>
            </div>
            <Badge variant={record.riskLevel === "critical" || record.riskLevel === "high" ? "accent" : "secondary"}>
              {record.riskLevel}
            </Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MetricLine label="Fraud risk score" value={record.fraudRiskScore.toString()} />
            <MetricLine label="Staff overrides" value={record.repeatedStaffOverrides.toString()} />
            <MetricLine label="Fake ready signals" value={record.fakeOrderReadySignals.toString()} />
            <MetricLine label="Missing-item claims" value={record.repeatedMissingItemClaims.toString()} />
            <MetricLine label="Abnormal refund rate" value={`${record.abnormalRefundRate}%`} />
            <MetricLine label="Weight pattern" value={record.suspiciousWeightPatterns} />
          </div>
        </div>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Suspicious activity summary</CardTitle>
            <CardDescription>Returned narrative of the strongest fraud and abuse signals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
              {record.suspiciousActivitySummary}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Merchant abuse alerts</CardTitle>
            <CardDescription>Warnings that should trigger merchant or trust review.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {record.merchantAbuseAlerts.map((alert) => (
              <div key={alert} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{alert}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Operational recommendations</CardTitle>
            <CardDescription>Actions to reduce abuse risk and tighten workflow integrity.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {record.operationalRecommendations.map((action) => (
              <div key={action} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{action}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function SmartScaleFraudQueuePanel({
  records,
  selectedId
}: {
  records: SmartScaleFraudRecord[];
  selectedId: string;
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Merchant abuse queue</CardTitle>
          <CardDescription>Stores ranked by fraud risk score and workflow abuse intensity.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {records
            .slice()
            .sort((a, b) => b.fraudRiskScore - a.fraudRiskScore)
            .map((record) => {
              const store = smartscaleStores.find((item) => item.id === record.storeId);
              return (
                <div key={record.id} className={cn("rounded-lg border border-white/10 bg-background/60 p-4", record.id === selectedId && "border-primary/40")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{store?.store ?? record.storeId}</p>
                      <p className="text-sm text-muted-foreground">{record.suspiciousWeightPatterns}</p>
                    </div>
                    <Badge variant={record.riskLevel === "critical" || record.riskLevel === "high" ? "accent" : "secondary"}>
                      {record.fraudRiskScore}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MetricLine label="Overrides" value={record.repeatedStaffOverrides.toString()} />
                    <MetricLine label="Refund rate" value={`${record.abnormalRefundRate}%`} />
                    <MetricLine label="Ready signal abuse" value={record.fakeOrderReadySignals.toString()} />
                    <MetricLine label="Claims" value={record.repeatedMissingItemClaims.toString()} />
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Detection coverage</CardTitle>
          <CardDescription>Signals combined into the fraud and abuse model.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <ListChecks className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Repeated staff overrides are weighted highest when they cluster with later customer claims and refunds.</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <Scale className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Suspicious weight patterns look for impossible repetitions, staged readings, and repeated mismatches that bypass normal tolerance behavior.</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Refund and missing-item claim anomalies are used as downstream validation so benign customization noise does not dominate the score.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerRecoveryOutputCard({ caseItem }: { caseItem: CustomerRecoveryCase }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Recovery output</CardTitle>
        <CardDescription>Returned recovery plan for current customer issue.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-lg border border-white/10 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{caseItem.orderId}</p>
              <p className="text-sm text-muted-foreground">{caseItem.storeName} · {caseItem.market}</p>
            </div>
            <Badge variant="accent">{formatIssueLabel(caseItem.issueType)}</Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MetricLine label="ETA update" value={caseItem.etaUpdate} />
            <MetricLine label="Estimated recovery cost" value={caseItem.estimatedRecoveryCost} />
            <MetricLine label="Refund recommendation" value={caseItem.refundRecommendation} />
            <MetricLine label="Support escalation" value={caseItem.supportEscalation} />
          </div>
        </div>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Customer explanation</CardTitle>
            <CardDescription>Clear customer-facing recovery message.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
              {caseItem.customerExplanation}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Recovery coupon suggestion</CardTitle>
            <CardDescription>Low-cost loyalty recovery when appropriate.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
              {caseItem.recoveryCouponSuggestion}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function CustomerRecoveryQueuePanel({
  cases,
  selectedId
}: {
  cases: CustomerRecoveryCase[];
  selectedId: string;
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Recovery priority queue</CardTitle>
          <CardDescription>Cases ranked for satisfaction impact and support cost.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {cases
            .slice()
            .sort((a, b) => b.satisfactionPriority - a.satisfactionPriority)
            .map((item) => (
              <div key={item.id} className={cn("rounded-lg border border-white/10 bg-background/60 p-4", item.id === selectedId && "border-primary/40")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.orderId}</p>
                    <p className="text-sm text-muted-foreground">{formatIssueLabel(item.issueType)}</p>
                  </div>
                  <Badge variant={item.satisfactionPriority >= 90 ? "accent" : "secondary"}>{item.satisfactionPriority}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{item.estimatedRecoveryCost}</p>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Issue-type dashboard</CardTitle>
          <CardDescription>Recovery patterns by issue class.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {cases.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{formatIssueLabel(item.issueType)}</p>
                <Badge variant="secondary">{item.orderId}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <MetricLine label="Refund" value={item.refundRecommendation} />
                <MetricLine label="Escalation" value={item.supportEscalation} />
                <MetricLine label="Coupon" value={item.recoveryCouponSuggestion} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DispatchRecommendationCard({ recommendation }: { recommendation: DispatchOptimizationRecommendation }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Optimization output</CardTitle>
        <CardDescription>Returned dispatch recommendation and route plan.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-lg border border-white/10 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{recommendation.orderGroup}</p>
              <p className="text-sm text-muted-foreground">{recommendation.market}</p>
            </div>
            <Badge variant={recommendation.priorityLevel === "critical" || recommendation.priorityLevel === "high" ? "accent" : "secondary"}>
              {recommendation.priorityLevel}
            </Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MetricLine label="Recommended robot" value={recommendation.recommendedRobot} />
            <MetricLine label="Estimated time saved" value={recommendation.estimatedTimeSaved} />
            <MetricLine label="Battery impact" value={recommendation.batteryImpact} />
            <MetricLine label="Priority level" value={recommendation.priorityLevel} />
          </div>
        </div>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Optimized route</CardTitle>
            <CardDescription>Sequence chosen for ETA, readiness, and congestion avoidance.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recommendation.optimizedRoute.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-3">
                <div className="grid size-7 shrink-0 place-items-center rounded-full border border-white/10 bg-black/20 text-xs text-muted-foreground">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/40">
          <CardHeader>
            <CardTitle>Dispatch decision notes</CardTitle>
            <CardDescription>Batching, charging, and congestion tradeoffs.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <MetricLine label="Batching decision" value={recommendation.batchingDecision} />
            <MetricLine label="Charging schedule" value={recommendation.chargingSchedule} />
            <MetricLine label="Congestion avoidance" value={recommendation.congestionAvoidanceNote} />
            <div className="grid grid-cols-[140px_1fr] items-center gap-3 text-sm">
              <span className="text-muted-foreground">Route efficiency</span>
              <div className="flex items-center gap-3">
                <Progress className="w-32" value={recommendation.routeEfficiencyScore} />
                <span className="font-medium">{recommendation.routeEfficiencyScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function DispatchConstraintsPanel({
  recommendation,
  allRecommendations
}: {
  recommendation: DispatchOptimizationRecommendation;
  allRecommendations: DispatchOptimizationRecommendation[];
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Constraint inputs</CardTitle>
          <CardDescription>Battery, robot health, merchant readiness, ETA, and traffic conditions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <MetricLine label="Battery" value={recommendation.batteryConstraint} />
          <MetricLine label="Robot health" value={recommendation.robotHealth} />
          <MetricLine label="Merchant readiness" value={recommendation.merchantReadiness} />
          <MetricLine label="Customer ETA" value={recommendation.customerEtaTarget} />
          <MetricLine label="Traffic conditions" value={recommendation.trafficConditions} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Robot assignment board</CardTitle>
          <CardDescription>Candidate robots and selected dispatch winner.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {recommendation.robotCandidates.map((candidate) => (
            <div key={candidate} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/60 px-4 py-3">
              <span className="text-sm font-medium">{candidate}</span>
              <Badge variant={candidate === recommendation.recommendedRobot ? "accent" : "secondary"}>
                {candidate === recommendation.recommendedRobot ? "selected" : "candidate"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Priority queue</CardTitle>
          <CardDescription>Dispatch groups ranked by urgency and optimizer output.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {allRecommendations.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.orderGroup}</p>
                  <p className="text-sm text-muted-foreground">{item.recommendedRobot}</p>
                </div>
                <Badge variant={item.priorityLevel === "critical" || item.priorityLevel === "high" ? "accent" : "secondary"}>
                  {item.priorityLevel}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.estimatedTimeSaved} saved · {item.batteryImpact}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SimulationRouteCard({
  scenario,
  minute,
  currentPoint,
  visibleIncidents
}: {
  scenario: DeliverySimulationScenario;
  minute: number;
  currentPoint: { x: number; y: number; eventTime: number; label: string };
  visibleIncidents: DeliverySimulationScenario["incidentOverlays"];
}) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Route visualization</CardTitle>
        <CardDescription>Live playback with route progress and incident overlays.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative aspect-[1.45/1] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Simulation route map">
            <polyline
              fill="none"
              stroke="rgba(88,246,255,0.8)"
              strokeWidth="2.2"
              points={scenario.routePoints.map((point) => `${point.x},${point.y}`).join(" ")}
            />
            {scenario.routePoints.map((point) => (
              <g key={`${point.label}-${point.eventTime}`}>
                <circle cx={point.x} cy={point.y} r="2.2" fill="rgba(204,255,77,0.9)" />
                <text x={point.x + 1.5} y={point.y - 1.8} fill="rgba(248,251,255,0.92)" fontSize="3.3">
                  {point.label}
                </text>
              </g>
            ))}
            {visibleIncidents.map((incident) => (
              <g key={incident.id}>
                <circle cx={incident.x} cy={incident.y} r="4.6" fill="rgba(255,92,122,0.18)" />
                <circle cx={incident.x} cy={incident.y} r="2.4" fill="rgba(255,92,122,0.9)" />
              </g>
            ))}
            <circle cx={currentPoint.x} cy={currentPoint.y} r="3.2" fill="rgba(255,255,255,0.96)" />
          </svg>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <MetricLine label="Current route node" value={`${currentPoint.label} at minute ${minute}`} />
          <MetricLine label="Visible incident overlays" value={visibleIncidents.length.toString()} />
        </div>
        <div className="grid gap-3">
          {visibleIncidents.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">No incident overlays yet. Start playback or step timeline forward.</div>
          ) : (
            visibleIncidents.map((incident) => (
              <div key={incident.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{formatIssueLabel(incident.type)}</p>
                    <p className="text-sm text-muted-foreground">Minute {incident.time}</p>
                  </div>
                  <Badge variant={incident.severity === "critical" || incident.severity === "high" ? "accent" : "secondary"}>
                    {incident.severity}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{incident.description}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SimulationDecisionPanel({
  scenario,
  visibleIncidents
}: {
  scenario: DeliverySimulationScenario;
  visibleIncidents: DeliverySimulationScenario["incidentOverlays"];
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Simulate recovery actions</CardTitle>
          <CardDescription>Test operator response and compare safe recovery paths.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {scenario.recoveryActions.map((action, index) => (
            <button key={action} type="button" className="flex items-center justify-between rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-left transition-colors hover:bg-background">
              <span className="text-sm font-medium">{action}</span>
              <Badge variant="secondary">Action {index + 1}</Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Test dispatch decisions</CardTitle>
          <CardDescription>Evaluate queue holds, reroutes, and release timing before incident escalation.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {scenario.dispatchDecisions.map((decision, index) => (
            <div key={decision} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-3">
              <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">{decision}</p>
                <p className="mt-1 text-xs text-muted-foreground">Decision path {index + 1}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>AI simulation summary</CardTitle>
          <CardDescription>Model-generated readout from route, incidents, recovery, weather, merchant, and Dasher timing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
            {scenario.aiSummary}
          </div>
          <MetricLine label="Incidents triggered" value={visibleIncidents.length.toString()} />
          <MetricLine label="Total scenario incidents" value={scenario.incidentOverlays.length.toString()} />
        </CardContent>
      </Card>
    </div>
  );
}

function IncidentReplayDashboard() {
  const [incidentId, setIncidentId] = useState(incidentReplayRecords[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [minute, setMinute] = useState(0);
  const incident = incidentReplayRecords.find((item) => item.id === incidentId) ?? incidentReplayRecords[0];

  useEffect(() => {
    setMinute(0);
    setIsPlaying(false);
  }, [incidentId]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setMinute((current) => {
        if (current >= incident.durationMinutes) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 650);
    return () => window.clearInterval(timer);
  }, [incident.durationMinutes, isPlaying]);

  const progress = (minute / Math.max(incident.durationMinutes, 1)) * 100;
  const currentPoint =
    [...incident.routePoints].reverse().find((point) => point.eventTime <= minute) ?? incident.routePoints[0];
  const visibleEvents = incident.timeline.filter((event) => event.minute <= minute);
  const currentTelemetry =
    [...incident.telemetry].reverse().find((snapshot) => snapshot.minute <= minute) ?? incident.telemetry[0];

  function exportReplayReport() {
    const report = {
      incident_id: incident.incidentId,
      robot: incident.robotName,
      market: incident.market,
      incident_type: incident.incidentType,
      summary: incident.summary,
      root_cause_analysis: incident.rootCauseAnalysis,
      ai_decisions: incident.aiDecisions,
      operator_actions: incident.operatorActions,
      timeline: incident.timeline,
      telemetry: incident.telemetry
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${incident.exportLabel}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(255,92,122,0.05))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Incident Replay System</CardTitle>
            <CardDescription>Reconstruct the full incident timeline, review telemetry, compare AI and operator decisions, and export replay reports.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
              value={incidentId}
              onChange={(event) => setIncidentId(event.target.value)}
              aria-label="Incident replay"
            >
              {incidentReplayRecords.map((item) => (
                <option key={item.id} className="bg-card" value={item.id}>
                  {item.incidentId}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={exportReplayReport}>
              <Download className="size-4" data-icon="inline-start" />
              Export report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Playback controls</CardTitle>
                <CardDescription>Scrub route events, AI decisions, and operator interventions minute by minute.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMinute((current) => Math.max(0, current - 1))} aria-label="Back one minute">
                    <SkipBack className="size-4" />
                  </Button>
                  <Button onClick={() => setIsPlaying((current) => !current)}>
                    {isPlaying ? <Pause className="size-4" data-icon="inline-start" /> : <Play className="size-4" data-icon="inline-start" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setMinute((current) => Math.min(incident.durationMinutes, current + 1))} aria-label="Forward one minute">
                    <SkipForward className="size-4" />
                  </Button>
                  <Button variant="outline" onClick={() => { setMinute(0); setIsPlaying(false); }}>
                    <RefreshCw className="size-4" data-icon="inline-start" />
                    Reset
                  </Button>
                  <Badge variant="secondary">Minute {minute} / {incident.durationMinutes}</Badge>
                </div>
                <Progress value={progress} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricLine label="Incident ID" value={incident.incidentId} />
                  <MetricLine label="Robot" value={incident.robotName} />
                  <MetricLine label="Incident type" value={formatIssueLabel(incident.incidentType)} />
                  <MetricLine label="Battery" value={`${currentTelemetry.battery}%`} />
                  <MetricLine label="Speed" value={`${currentTelemetry.speed.toFixed(1)} mph`} />
                  <MetricLine label="Localization" value={`${currentTelemetry.localizationConfidence}%`} />
                </div>
              </CardContent>
            </Card>

            <IncidentReplayMapCard incident={incident} minute={minute} currentPoint={currentPoint} visibleEvents={visibleEvents} />
          </div>

          <IncidentReplayDecisionPanel incident={incident} currentTelemetry={currentTelemetry} visibleEvents={visibleEvents} />
        </CardContent>
      </Card>
    </div>
  );
}

function IncidentReplayMapCard({
  incident,
  minute,
  currentPoint,
  visibleEvents
}: {
  incident: IncidentReplayRecord;
  minute: number;
  currentPoint: { x: number; y: number; eventTime: number; label: string };
  visibleEvents: IncidentReplayRecord["timeline"];
}) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Map playback</CardTitle>
        <CardDescription>Replay route events with event markers across the incident path.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative aspect-[1.45/1] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Incident replay map">
            <polyline
              fill="none"
              stroke="rgba(88,246,255,0.8)"
              strokeWidth="2.2"
              points={incident.routePoints.map((point) => `${point.x},${point.y}`).join(" ")}
            />
            {incident.routePoints.map((point) => (
              <g key={`${point.label}-${point.eventTime}`}>
                <circle cx={point.x} cy={point.y} r="2.2" fill="rgba(204,255,77,0.9)" />
                <text x={point.x + 1.5} y={point.y - 1.8} fill="rgba(248,251,255,0.92)" fontSize="3.3">
                  {point.label}
                </text>
              </g>
            ))}
            {visibleEvents.map((event) => (
              <g key={event.id}>
                <circle cx={event.x} cy={event.y} r="4.8" fill="rgba(255,92,122,0.18)" />
                <circle cx={event.x} cy={event.y} r="2.5" fill={event.type === "operator_action" ? "rgba(204,255,77,0.95)" : event.type === "ai_decision" ? "rgba(88,246,255,0.92)" : "rgba(255,92,122,0.92)"} />
              </g>
            ))}
            <circle cx={currentPoint.x} cy={currentPoint.y} r="3.2" fill="rgba(255,255,255,0.96)" />
          </svg>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <MetricLine label="Current route node" value={`${currentPoint.label} at minute ${minute}`} />
          <MetricLine label="Visible event markers" value={visibleEvents.length.toString()} />
        </div>
        <div className="grid gap-3">
          {visibleEvents.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">No replay markers visible yet. Start playback or step forward.</div>
          ) : (
            visibleEvents.map((event) => (
              <div key={event.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">Minute {event.minute} · {formatIssueLabel(event.type)}</p>
                  </div>
                  <Badge variant={event.severity === "critical" || event.severity === "high" ? "accent" : "secondary"}>
                    {event.severity}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{event.detail}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IncidentReplayDecisionPanel({
  incident,
  currentTelemetry,
  visibleEvents
}: {
  incident: IncidentReplayRecord;
  currentTelemetry: IncidentReplayRecord["telemetry"][number];
  visibleEvents: IncidentReplayRecord["timeline"];
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Robot telemetry</CardTitle>
          <CardDescription>Current playback snapshot from the incident timeline.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <MetricLine label="Battery" value={`${currentTelemetry.battery}%`} />
          <MetricLine label="Network reliability" value={`${currentTelemetry.networkReliability}%`} />
          <MetricLine label="Localization confidence" value={`${currentTelemetry.localizationConfidence}%`} />
          <MetricLine label="Motor temperature" value={`${currentTelemetry.motorTemperatureC}C`} />
          <MetricLine label="Speed" value={`${currentTelemetry.speed.toFixed(1)} mph`} />
          <MetricLine label="Replay markers" value={visibleEvents.length.toString()} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>AI decisions</CardTitle>
          <CardDescription>Model actions taken during the incident.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {incident.aiDecisions.map((decision, index) => (
            <div key={decision} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
              <Bot className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Decision {index + 1}</p>
                <p className="mt-1">{decision}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Operator actions</CardTitle>
          <CardDescription>Human interventions recorded during the replay.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {incident.operatorActions.map((action, index) => (
            <div key={action} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
              <Headphones className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Action {index + 1}</p>
                <p className="mt-1">{action}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Incident summary</CardTitle>
          <CardDescription>Replay synopsis and root cause analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
            {incident.summary}
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">Root cause analysis:</span> {incident.rootCauseAnalysis}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DasherOperationsTable({ records }: { records: DasherOperationsRecord[] }) {
  return (
    <Card className="border-white/10 bg-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle>Pickup efficiency dashboard</CardTitle>
        <CardDescription>Dasher friction score, pickup efficiency, and high-risk merchant performance.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 md:hidden">
          {records.map((record) => (
            <div key={record.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{record.storeName}</p>
                  <p className="text-xs text-muted-foreground">{record.market}</p>
                </div>
                <Badge variant={record.dasherFrictionScore >= 75 ? "accent" : "secondary"}>{record.dasherFrictionScore}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <MetricLine label="Efficiency" value={`${record.pickupEfficiency}%`} />
                <MetricLine label="Wait time" value={`${record.waitTimeMinutes} min`} />
                <MetricLine label="Failed handoffs" value={record.failedHandoffs.toString()} />
                <MetricLine label="Wrong orders" value={record.wrongOrders.toString()} />
              </div>
            </div>
          ))}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="border-y border-white/10 bg-background/60 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Store</th>
                <th className="px-5 py-3 font-medium">Friction</th>
                <th className="px-5 py-3 font-medium">Efficiency</th>
                <th className="px-5 py-3 font-medium">Pickup delays</th>
                <th className="px-5 py-3 font-medium">Wait time</th>
                <th className="px-5 py-3 font-medium">Failed handoffs</th>
                <th className="px-5 py-3 font-medium">Wrong orders</th>
                <th className="px-5 py-3 font-medium">Parking zone</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-white/8 transition-colors hover:bg-white/5">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{record.storeName}</p>
                    <p className="text-xs text-muted-foreground">{record.market}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{record.dasherFrictionScore}</span>
                      <Progress className="w-20" value={record.dasherFrictionScore} />
                    </div>
                  </td>
                  <td className="px-5 py-4">{record.pickupEfficiency}%</td>
                  <td className="px-5 py-4">{record.pickupDelays}</td>
                  <td className="px-5 py-4">{record.waitTimeMinutes} min</td>
                  <td className="px-5 py-4">{record.failedHandoffs}</td>
                  <td className="px-5 py-4">{record.wrongOrders}</td>
                  <td className="px-5 py-4">{record.difficultParkingZone ? "Difficult" : "Normal"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function DasherRecommendationsPanel({ records }: { records: DasherOperationsRecord[] }) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Operational recommendations</CardTitle>
          <CardDescription>AI-generated fixes for pickup friction and repeated merchant pain.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {records.map((record) => (
            <div key={record.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{record.storeName}</p>
                  <p className="text-sm text-muted-foreground">{record.zoneName}</p>
                </div>
                <Badge variant={record.dasherFrictionScore >= 75 ? "accent" : "secondary"}>{record.pickupEfficiency}% eff.</Badge>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {record.operationalRecommendations.map((action) => (
                  <div key={action} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PickupZoneHeatmapCard({ points }: { points: PickupZoneHeatmapPoint[] }) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Pickup zone heatmap</CardTitle>
        <CardDescription>Problematic pickup zones with friction intensity and primary cause.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative aspect-[1.4/1] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
          {points.map((point) => (
            <div
              key={point.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${26 + point.intensity * 0.65}px`,
                height: `${26 + point.intensity * 0.65}px`,
                background: `radial-gradient(circle, rgba(255,92,122,${0.22 + point.intensity / 180}) 0%, rgba(255,186,64,${0.16 + point.intensity / 220}) 45%, rgba(88,246,255,0.08) 100%)`
              }}
            />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {points
            .slice()
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, 6)
            .map((point) => (
              <div key={point.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{point.zoneName}</p>
                  <Badge variant={point.intensity >= 80 ? "accent" : "secondary"}>{point.intensity}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{point.market}</p>
                <p className="mt-2 text-sm text-muted-foreground">Cause: {point.primaryCause}</p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HighRiskStoresCard({ records }: { records: DasherOperationsRecord[] }) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>High-risk stores</CardTitle>
        <CardDescription>Merchants with highest Dasher friction and repeated pickup breakdowns.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {records
          .slice()
          .sort((a, b) => b.dasherFrictionScore - a.dasherFrictionScore)
          .map((record) => (
            <div key={record.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{record.storeName}</p>
                  <p className="text-sm text-muted-foreground">{record.market}</p>
                </div>
                <Badge variant={record.dasherFrictionScore >= 75 ? "accent" : "secondary"}>{record.dasherFrictionScore}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <MetricLine label="Restaurant congestion" value={`${record.restaurantCongestion}%`} />
                <MetricLine label="Repeated merchant issues" value={record.repeatedMerchantIssues.toString()} />
                <MetricLine label="Zone" value={record.zoneName} />
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

function MerchantScoreTable({ records }: { records: MerchantPerformanceRecord[] }) {
  return (
    <Card className="border-white/10 bg-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle>Merchant analytics dashboard</CardTitle>
        <CardDescription>Returned intelligence score, main issue, risk, actions, and trend per store.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 md:hidden">
          {records.map((record) => (
            <div key={record.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{record.storeName}</p>
                  <p className="text-xs text-muted-foreground">{record.market}</p>
                </div>
                <Badge variant={record.riskLevel === "critical" || record.riskLevel === "high" ? "accent" : "secondary"}>
                  {record.storeScore}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.mainOperationalIssue}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <MetricLine label="Risk" value={record.riskLevel} />
                <MetricLine label="Trend" value={record.trendDirection} />
                <MetricLine label="Refunds" value={`${record.refundRate}%`} />
                <MetricLine label="Recurrence" value={record.issueRecurrence.toString()} />
              </div>
            </div>
          ))}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="border-y border-white/10 bg-background/60 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Store</th>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">Main operational issue</th>
                <th className="px-5 py-3 font-medium">Risk</th>
                <th className="px-5 py-3 font-medium">Trend</th>
                <th className="px-5 py-3 font-medium">Complaints</th>
                <th className="px-5 py-3 font-medium">Refunds</th>
                <th className="px-5 py-3 font-medium">Recurrence</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-white/8 transition-colors hover:bg-white/5">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{record.storeName}</p>
                    <p className="text-xs text-muted-foreground">{record.market}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{record.storeScore}</span>
                      <Progress className="w-20" value={record.storeScore} />
                    </div>
                  </td>
                  <td className="max-w-sm px-5 py-4 text-muted-foreground">{record.mainOperationalIssue}</td>
                  <td className="px-5 py-4">
                    <Badge variant={record.riskLevel === "critical" || record.riskLevel === "high" ? "accent" : "secondary"}>
                      {record.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">{record.trendDirection}</td>
                  <td className="px-5 py-4">{record.customerComplaints}</td>
                  <td className="px-5 py-4">{record.refundRate}%</td>
                  <td className="px-5 py-4">{record.issueRecurrence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function MerchantActionPanel({
  highlightedRecord,
  records
}: {
  highlightedRecord: MerchantPerformanceRecord;
  records: MerchantPerformanceRecord[];
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Highest-risk store</CardTitle>
          <CardDescription>{highlightedRecord.storeName} needs fastest merchant ops response.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{highlightedRecord.storeName}</p>
                <p className="text-sm text-muted-foreground">{highlightedRecord.market}</p>
              </div>
              <Badge variant="accent">{highlightedRecord.riskLevel}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{highlightedRecord.mainOperationalIssue}</p>
          </div>
          {highlightedRecord.recommendedStoreActions.map((action) => (
            <div key={action} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">{action}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Store factor dashboard</CardTitle>
          <CardDescription>Input metrics feeding merchant score model.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {records.map((record) => (
            <div key={record.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{record.storeName}</p>
                <Badge variant="secondary">{record.storeScore}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <MetricLine label="Order accuracy" value={`${record.orderAccuracy}%`} />
                <MetricLine label="SmartScale usage" value={`${record.smartscaleUsage}%`} />
                <MetricLine label="Prep delays" value={`${record.prepDelayMinutes} min`} />
                <MetricLine label="Dasher wait time" value={`${record.dasherWaitTime} min`} />
                <MetricLine label="Customer complaints" value={record.customerComplaints.toString()} />
                <MetricLine label="Refund rate" value={`${record.refundRate}%`} />
                <MetricLine label="Issue recurrence" value={record.issueRecurrence.toString()} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ExecutiveOpsDashboard() {
  const snapshot = executiveOperationsSnapshot;
  const bestMarket = [...snapshot.marketComparisons].sort((a, b) => b.deliverySuccessRate - a.deliverySuccessRate)[0];
  const mostImprovedWeek = snapshot.weeklyTrends[snapshot.weeklyTrends.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Fleet uptime" value={`${snapshot.fleetUptime}%`} caption="Current network availability" icon={ShieldCheck} />
        <RiskMetric label="Delivery success" value={`${snapshot.deliverySuccessRate}%`} caption="Completed without operational failure" icon={CheckCircle2} />
        <RiskMetric label="Cost savings" value={snapshot.operationalCostSavings} caption="Operational savings realized" icon={Target} />
        <RiskMetric label="Customer satisfaction" value={`${snapshot.customerSatisfaction}%`} caption="Blended customer health score" icon={Heart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="glass-panel overflow-hidden">
          <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(204,255,77,0.05))] md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Executive operations dashboard</CardTitle>
              <CardDescription>Leadership view of uptime, success, savings, SmartScale impact, robot efficiency, and customer experience.</CardDescription>
            </div>
            <Badge variant="accent">{bestMarket.market} leading market</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricLine label="Missing-item reduction" value={`${snapshot.missingItemReduction}%`} />
              <MetricLine label="SmartScale impact" value={snapshot.smartscaleImpact} />
              <MetricLine label="AI escalation reduction" value={`${snapshot.aiEscalationReduction}%`} />
              <MetricLine label="Robot efficiency" value={`${snapshot.robotEfficiency}%`} />
            </div>
            <ExecutiveTrendsChart snapshot={snapshot} />
          </CardContent>
        </Card>

        <ExecutiveSummaryPanel snapshot={snapshot} bestMarket={bestMarket.market} mostImprovedWeek={mostImprovedWeek.week} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <ExecutiveMarketComparisonTable snapshot={snapshot} />
        <ExecutiveForecastPanel snapshot={snapshot} />
      </div>
    </div>
  );
}

function ExecutiveTrendsChart({ snapshot }: { snapshot: ExecutiveOperationsSnapshot }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Weekly trends</CardTitle>
        <CardDescription>Week-over-week movement in network reliability, success, savings, and customer sentiment.</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={snapshot.weeklyTrends} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(88,246,255,0.7)" />
                <stop offset="95%" stopColor="rgba(88,246,255,0.05)" />
              </linearGradient>
              <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(204,255,77,0.7)" />
                <stop offset="95%" stopColor="rgba(204,255,77,0.05)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} width={36} />
            <Tooltip
              contentStyle={{
                background: "rgba(9, 12, 18, 0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12
              }}
            />
            <Area type="monotone" dataKey="fleetUptime" stroke="rgba(88,246,255,0.95)" fill="url(#uptimeFill)" strokeWidth={2.2} />
            <Area type="monotone" dataKey="deliverySuccessRate" stroke="rgba(204,255,77,0.95)" fill="url(#successFill)" strokeWidth={2.2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ExecutiveSummaryPanel({
  snapshot,
  bestMarket,
  mostImprovedWeek
}: {
  snapshot: ExecutiveOperationsSnapshot;
  bestMarket: string;
  mostImprovedWeek: string;
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Executive summary</CardTitle>
          <CardDescription>Short reads for leadership review.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.executiveSummaries.map((summary) => (
            <div key={summary} className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
              {summary}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Snapshot highlights</CardTitle>
          <CardDescription>Fast read for leadership syncs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4">
            <MetricLine label="Leading market" value={bestMarket} />
            <MetricLine label="Most improved week" value={mostImprovedWeek} />
            <MetricLine label="SmartScale lift" value={snapshot.smartscaleImpact} />
            <MetricLine label="Escalation reduction" value={`${snapshot.aiEscalationReduction}%`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExecutiveMarketComparisonTable({ snapshot }: { snapshot: ExecutiveOperationsSnapshot }) {
  return (
    <Card className="border-white/10 bg-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle>Market comparisons</CardTitle>
        <CardDescription>Cross-market view of delivery quality, SmartScale impact, efficiency, and customer outcomes.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 md:hidden">
          {snapshot.marketComparisons.map((market) => (
            <div key={market.market} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{market.market}</p>
                <Badge variant={market.deliverySuccessRate >= 96.5 ? "accent" : "secondary"}>{market.deliverySuccessRate}%</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <MetricLine label="Uptime" value={`${market.fleetUptime}%`} />
                <MetricLine label="SmartScale" value={`${market.smartscaleImpact}%`} />
                <MetricLine label="Efficiency" value={`${market.robotEfficiency}%`} />
                <MetricLine label="Satisfaction" value={`${market.customerSatisfaction}%`} />
              </div>
            </div>
          ))}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="border-y border-white/10 bg-background/60 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Market</th>
                <th className="px-5 py-3 font-medium">Fleet uptime</th>
                <th className="px-5 py-3 font-medium">Delivery success</th>
                <th className="px-5 py-3 font-medium">SmartScale impact</th>
                <th className="px-5 py-3 font-medium">Robot efficiency</th>
                <th className="px-5 py-3 font-medium">Customer satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.marketComparisons.map((market) => (
                <tr key={market.market} className="border-b border-white/8 transition-colors hover:bg-white/5">
                  <td className="px-5 py-4 font-semibold">{market.market}</td>
                  <td className="px-5 py-4">{market.fleetUptime}%</td>
                  <td className="px-5 py-4">{market.deliverySuccessRate}%</td>
                  <td className="px-5 py-4">{market.smartscaleImpact}%</td>
                  <td className="px-5 py-4">{market.robotEfficiency}%</td>
                  <td className="px-5 py-4">{market.customerSatisfaction}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutiveForecastPanel({ snapshot }: { snapshot: ExecutiveOperationsSnapshot }) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Operational forecasts</CardTitle>
          <CardDescription>Forward view of uptime, success, savings, and customer experience.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.operationalForecasts.map((forecast) => (
            <div key={forecast.period} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{forecast.period}</p>
                  <p className="text-sm text-muted-foreground">Projected operating state</p>
                </div>
                <Badge variant="secondary">{forecast.deliverySuccessRate}% success</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <MetricLine label="Fleet uptime" value={`${forecast.fleetUptime}%`} />
                <MetricLine label="Delivery success" value={`${forecast.deliverySuccessRate}%`} />
                <MetricLine label="Cost savings" value={`$${forecast.operationalCostSavings}K`} />
                <MetricLine label="Customer satisfaction" value={`${forecast.customerSatisfaction}%`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Impact stack</CardTitle>
          <CardDescription>Where the current gains are coming from.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
            SmartScale verification and lower remake volume are the clearest drivers of missing-item reduction and cost savings.
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
            AI escalation reduction is improving robot utilization by keeping more recoveries inside automated or guided workflows.
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm text-muted-foreground">
            The next executive lift will come from closing Austin and Los Angeles market gaps rather than pushing already strong markets harder.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MultiAgentSupervisorDashboard() {
  const snapshot = multiAgentSupervisorSnapshot;
  const activeCount = snapshot.activeAgents.filter((agent) => agent.status === "active").length;
  const criticalQueue = snapshot.operationalQueue.filter((item) => item.priority === "critical").length;
  const avgConfidence = Math.round(
    snapshot.activeAgents.reduce((sum, agent) => sum + agent.confidenceScore, 0) / Math.max(snapshot.activeAgents.length, 1)
  );
  const escalatedCount = snapshot.activeAgents.filter((agent) => agent.status === "escalated").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RiskMetric label="Active agents" value={activeCount.toString()} caption="Agents actively handling live work" icon={Users} />
        <RiskMetric label="Critical queue" value={criticalQueue.toString()} caption="Highest-priority supervisor decisions" icon={TriangleAlert} />
        <RiskMetric label="Avg confidence" value={`${avgConfidence}%`} caption="Blended agent confidence level" icon={ShieldCheck} />
        <RiskMetric label="Escalated agents" value={escalatedCount.toString()} caption="Need human or critical ops support" icon={Siren} />
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(255,92,122,0.06))] md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Multi-Agent Supervisor system</CardTitle>
            <CardDescription>Prioritize incidents, coordinate specialist agents, resolve conflicting recommendations, escalate critical operations, and maintain operational efficiency.</CardDescription>
          </div>
          <Badge variant="accent">{snapshot.operationalQueue.length} live supervisor tasks</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <MultiAgentSupervisorMain snapshot={snapshot} />
          <MultiAgentSupervisorRail snapshot={snapshot} />
        </CardContent>
      </Card>
    </div>
  );
}

function MultiAgentSupervisorMain({ snapshot }: { snapshot: MultiAgentSupervisorSnapshot }) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Active agents</CardTitle>
          <CardDescription>Live agent roster with status, current task, recommendation, and confidence.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.activeAgents.map((agent) => (
            <div key={agent.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.currentTask}</p>
                </div>
                <Badge variant={agent.status === "escalated" ? "accent" : agent.status === "active" ? "default" : "secondary"}>
                  {agent.status}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <MetricLine label="Current task" value={agent.currentTask} />
                <MetricLine label="Confidence score" value={`${agent.confidenceScore}%`} />
              </div>
              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-6 text-muted-foreground">
                {agent.recommendation}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 overflow-hidden">
        <CardHeader>
          <CardTitle>Operational queue</CardTitle>
          <CardDescription>Supervisor queue for prioritized incidents and coordination decisions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-3 p-4 md:hidden">
            {snapshot.operationalQueue.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.incidentTitle}</p>
                    <p className="text-xs text-muted-foreground">{item.ownerAgent}</p>
                  </div>
                  <Badge variant={item.priority === "critical" || item.priority === "high" ? "accent" : "secondary"}>
                    {item.priority}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{item.supervisorDecision}</p>
              </div>
            ))}
          </div>
          <div className="scrollbar-thin hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead className="border-y border-white/10 bg-background/60 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Incident</th>
                  <th className="px-5 py-3 font-medium">Owner agent</th>
                  <th className="px-5 py-3 font-medium">Conflict</th>
                  <th className="px-5 py-3 font-medium">Supervisor decision</th>
                  <th className="px-5 py-3 font-medium">Escalation</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.operationalQueue.map((item) => (
                  <tr key={item.id} className="border-b border-white/8 transition-colors hover:bg-white/5">
                    <td className="px-5 py-4">
                      <Badge variant={item.priority === "critical" || item.priority === "high" ? "accent" : "secondary"}>
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="max-w-xs px-5 py-4 font-semibold">{item.incidentTitle}</td>
                    <td className="px-5 py-4">{item.ownerAgent}</td>
                    <td className="max-w-sm px-5 py-4 text-muted-foreground">{item.conflictingRecommendation}</td>
                    <td className="max-w-sm px-5 py-4 text-muted-foreground">{item.supervisorDecision}</td>
                    <td className="px-5 py-4">{item.escalationTarget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MultiAgentSupervisorRail({ snapshot }: { snapshot: MultiAgentSupervisorSnapshot }) {
  return (
    <div className="grid gap-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Supervisor summary</CardTitle>
          <CardDescription>Top-level orchestration readout.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
            {snapshot.supervisorSummary}
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
            {snapshot.efficiencyStatus}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Current tasks</CardTitle>
          <CardDescription>Quick scan of what each agent owns right now.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.activeAgents.map((agent) => (
            <div key={agent.id} className="rounded-lg border border-white/10 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{agent.name}</p>
                <Badge variant="secondary">{agent.confidenceScore}%</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{agent.currentTask}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Conflict resolution rules</CardTitle>
          <CardDescription>How the supervisor maintains operational efficiency.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Safety and maintenance recommendations outrank efficiency recommendations when failure risk is critical.</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <Workflow className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Dispatch and merchant recommendations are blended when the same fix can preserve ETA and handoff quality together.</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
            <Heart className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Customer recovery actions are delayed unless the supervisor predicts a real promise-window breach or quality failure.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RiskMetric({ label, value, caption, icon: Icon }: { label: string; value: string; caption: string; icon: typeof Siren }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-md bg-white/8">
          <Icon className="size-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

function PredictiveIncidentTable({ predictions }: { predictions: PredictiveIncidentPrediction[] }) {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader>
        <CardTitle>Pre-incident predictions</CardTitle>
        <CardDescription>Forecasted operational failures before dispatch quality drops into incident state.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 md:hidden">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{prediction.entityName}</p>
                  <p className="text-xs text-muted-foreground">{prediction.city}</p>
                </div>
                <Badge variant={prediction.riskScore >= 80 ? "accent" : "secondary"}>{prediction.riskScore}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{prediction.predictedIssue}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <MetricLine label="Confidence" value={`${prediction.confidence}%`} />
                <MetricLine label="ETA drift" value={`${prediction.etaDegradationMinutes} min`} />
                <MetricLine label="Recovery risk" value={prediction.robotRecoveryRisk} />
                <MetricLine label="Customer risk" value={`${prediction.customerDissatisfactionRisk}%`} />
              </div>
            </div>
          ))}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="border-y border-white/10 bg-white/5 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Entity</th>
                <th className="px-5 py-3 font-medium">Risk</th>
                <th className="px-5 py-3 font-medium">Predicted issue</th>
                <th className="px-5 py-3 font-medium">Confidence</th>
                <th className="px-5 py-3 font-medium">Failure prob.</th>
                <th className="px-5 py-3 font-medium">Recovery risk</th>
                <th className="px-5 py-3 font-medium">ETA degradation</th>
                <th className="px-5 py-3 font-medium">Customer risk</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction.id} className="border-b border-white/8 transition-colors hover:bg-white/5">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{prediction.entityName}</p>
                    <p className="text-xs text-muted-foreground">{prediction.city}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{prediction.riskScore}</span>
                      <Progress className="w-20" value={prediction.riskScore} />
                    </div>
                  </td>
                  <td className="max-w-sm px-5 py-4 text-muted-foreground">{prediction.predictedIssue}</td>
                  <td className="px-5 py-4">{prediction.confidence}%</td>
                  <td className="px-5 py-4">{prediction.deliveryFailureProbability}%</td>
                  <td className="px-5 py-4">
                    <Badge variant={prediction.robotRecoveryRisk === "high" ? "accent" : "secondary"}>{prediction.robotRecoveryRisk}</Badge>
                  </td>
                  <td className="px-5 py-4">{prediction.etaDegradationMinutes} min</td>
                  <td className="px-5 py-4">{prediction.customerDissatisfactionRisk}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PredictiveIncidentActions({ predictions }: { predictions: PredictiveIncidentPrediction[] }) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Recommended prevention actions</CardTitle>
        <CardDescription>AI-selected interventions before live incident creation.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{prediction.entityName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{prediction.estimatedOperationalImpact}</p>
              </div>
              <Badge variant={prediction.riskScore >= 80 ? "accent" : "secondary"}>{prediction.confidence}% conf.</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{prediction.recommendedPreventionAction}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <MetricLine label="Telemetry" value={prediction.robotTelemetry} />
              <MetricLine label="Battery" value={prediction.batteryTrend} />
              <MetricLine label="Route congestion" value={prediction.routeCongestion} />
              <MetricLine label="Weather" value={prediction.weather} />
              <MetricLine label="Delivery delays" value={prediction.deliveryDelays} />
              <MetricLine label="SmartScale mismatch" value={`${prediction.smartscaleMismatchRate}%`} />
              <MetricLine label="Store accuracy" value={`${prediction.storeAccuracyRate}%`} />
              <MetricLine label="Network reliability" value={`${prediction.networkReliability}%`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RemoteAssistanceCopilot() {
  const [activeIncidentId, setActiveIncidentId] = useState(remoteAssistanceIncidents[0]?.id ?? "");
  const activeIncident =
    remoteAssistanceIncidents.find((incident) => incident.id === activeIncidentId) ?? remoteAssistanceIncidents[0];

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(88,246,255,0.08),rgba(204,255,77,0.06))] md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Remote Assistance AI Copilot</CardTitle>
          <CardDescription>Live operator panel for incident summary, hazard scan, interventions, recovery, and priority.</CardDescription>
        </div>
        <Badge variant="accent">{remoteAssistanceIncidents.length} live assists</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          {remoteAssistanceIncidents.map((incident) => (
            <button
              key={incident.id}
              type="button"
              className={cn(
                "rounded-lg border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/8",
                activeIncident.id === incident.id && "border-primary/40 bg-primary/10"
              )}
              onClick={() => setActiveIncidentId(incident.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{incident.robotName}</p>
                  <p className="text-sm text-muted-foreground">{incident.city}</p>
                </div>
                <Badge variant={incident.escalationUrgency === "critical" || incident.escalationUrgency === "high" ? "accent" : "secondary"}>
                  {incident.escalationUrgency}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{incident.operationalSummary}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Priority #{incident.priorityRank}</span>
                <span>{incident.localizationConfidence}% loc confidence</span>
              </div>
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(300px,0.75fr)]">
          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{activeIncident.robotName}</CardTitle>
                    <CardDescription>{activeIncident.city} · {activeIncident.gps}</CardDescription>
                  </div>
                  <Badge variant="secondary">{activeIncident.robotSpeed.toFixed(1)} m/s</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top,rgba(88,246,255,0.14),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Camera className="size-4 text-primary" />
                      <span className="text-sm font-semibold">Camera snapshot</span>
                    </div>
                    <Badge variant="secondary">{activeIncident.pedestrianDensity} pedestrian density</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{activeIncident.cameraSnapshotLabel}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {activeIncident.nearbyObstacles.map((obstacle) => (
                      <div key={obstacle} className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs text-foreground">
                        {obstacle}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricLine label="Operational summary" value={activeIncident.operationalSummary} />
                  <MetricLine label="Intervention recommendation" value={activeIncident.interventionRecommendation} />
                  <MetricLine label="Safety concerns" value={activeIncident.safetyConcerns.join(", ")} />
                  <MetricLine label="Escalation urgency" value={activeIncident.escalationUrgency} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Suggested operator commands</CardTitle>
                <CardDescription>Safe recovery sequence generated from live inputs.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {activeIncident.suggestedOperatorCommands.map((command, index) => (
                  <button
                    key={command}
                    type="button"
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-left transition-colors hover:bg-background"
                  >
                    <span className="text-sm font-medium">{command}</span>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Live signal inputs</CardTitle>
                <CardDescription>Copilot input state for operator decision support.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <MetricTile label="Localization confidence" value={`${activeIncident.localizationConfidence}%`} icon={Route} />
                <MetricTile label="Robot speed" value={`${activeIncident.robotSpeed.toFixed(1)} m/s`} icon={Radar} />
                <MetricTile label="GPS" value={activeIncident.gps} icon={MapPin} />
                <MetricTile label="Pedestrian density" value={activeIncident.pedestrianDensity} icon={Users} />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Hazards and priority</CardTitle>
                <CardDescription>Fast incident ranking for remote operator queue.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {activeIncident.safetyConcerns.map((concern) => (
                  <div key={concern} className="flex items-start gap-3 rounded-lg border border-white/10 bg-background/60 p-3">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-accent" />
                    <p className="text-sm leading-6 text-muted-foreground">{concern}</p>
                  </div>
                ))}
                <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Incident priority</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-3xl font-bold">#{activeIncident.priorityRank}</p>
                    <Badge variant={activeIncident.escalationUrgency === "critical" || activeIncident.escalationUrgency === "high" ? "accent" : "secondary"}>
                      {activeIncident.escalationUrgency}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricTile({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Route }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-background/60 p-3">
      <div className="grid size-10 place-items-center rounded-md bg-white/8">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function SmartScaleOperations({
  checks,
  storeFilter,
  setStoreFilter,
  storeOptions,
  issueFilter,
  setIssueFilter,
  issueOptions,
  severityFilter,
  setSeverityFilter,
  severityOptions,
  deviceFilter,
  setDeviceFilter,
  deviceOptions,
  dateRange,
  setDateRange
}: {
  checks: SmartScaleCheck[];
  storeFilter: string;
  setStoreFilter: (value: string) => void;
  storeOptions: string[];
  issueFilter: string;
  setIssueFilter: (value: string) => void;
  issueOptions: string[];
  severityFilter: string;
  setSeverityFilter: (value: string) => void;
  severityOptions: string[];
  deviceFilter: string;
  setDeviceFilter: (value: string) => void;
  deviceOptions: string[];
  dateRange: string;
  setDateRange: (value: string) => void;
}) {
  const todaysChecks = checks.filter((check) => new Date(check.date) >= new Date("2026-05-21T00:00:00.000Z"));
  const mismatches = checks.filter((check) => check.result === "fail" || check.result === "review");
  const missingItemRisks = checks.filter((check) => check.issueType === "missing_item_risk" || check.issueType === "drink_missing" || check.issueType === "sauce_or_side_missing");
  const falsePositives = checks.filter((check) => check.issueType === "false_positive");
  const lowAdoptionStores = smartscaleStores.filter((store) => store.adoptionScore < 70);
  const offlineDevices = smartscaleDevices.filter((device) => device.status === "offline");
  const avgDasherWait = Math.round(checks.reduce((sum, check) => sum + check.dasherWaitTime, 0) / Math.max(checks.length, 1));
  const readySignalAccuracy = Math.round((checks.filter((check) => check.orderReadySignalAccurate).length / Math.max(checks.length, 1)) * 100);

  const topStores = smartscaleStores
    .map((store) => ({
      ...store,
      issueCount: checks.filter((check) => check.storeId === store.id && check.result !== "pass").length
    }))
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 5);

  const metrics = [
    ["Total checks today", todaysChecks.length.toString(), "Live order scans", Scale],
    ["Mismatch rate", `${Math.round((mismatches.length / Math.max(checks.length, 1)) * 100)}%`, "Review + fail rate", CircleAlert],
    ["Missing item risk", missingItemRisks.length.toString(), "High-priority bag checks", CheckCircle2],
    ["False positive rate", `${Math.round((falsePositives.length / Math.max(checks.length, 1)) * 100)}%`, "Model noise today", ShieldCheck],
    ["Low-adoption stores", lowAdoptionStores.length.toString(), "Stores below 70 score", Building2],
    ["Devices offline", offlineDevices.length.toString(), "Need fallback flow", PlugZap],
    ["Avg Dasher wait", `${avgDasherWait} min`, "Pickup queue pressure", Calendar],
    ["Ready-signal accuracy", `${readySignalAccuracy}%`, "Kitchen-to-handoff sync", Workflow]
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, caption, Icon]) => (
          <Card key={label as string} className="glass-panel">
            <CardHeader className="flex-row items-start justify-between p-4">
              <div>
                <CardDescription>{label as string}</CardDescription>
                <CardTitle className="mt-2 text-2xl">{value as string}</CardTitle>
                <p className="mt-2 text-xs text-muted-foreground">{caption as string}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-md bg-white/8">
                <Icon className="size-4 text-primary" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SmartScaleWorkflow />

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Operations filters</CardTitle>
          <CardDescription>Slice by store, issue, severity, device health, and time window.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterSelect label="Store" value={storeFilter} onChange={setStoreFilter} options={storeOptions} />
          <FilterSelect label="Issue type" value={issueFilter} onChange={setIssueFilter} options={issueOptions} />
          <FilterSelect label="Severity" value={severityFilter} onChange={setSeverityFilter} options={severityOptions} />
          <FilterSelect label="Device status" value={deviceFilter} onChange={setDeviceFilter} options={deviceOptions} />
          <FilterSelect label="Date range" value={dateRange} onChange={setDateRange} options={["Today", "Last 7 days", "Last 30 days", "All time"]} />
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Visible orders</p>
            <p className="mt-2 text-2xl font-semibold">{checks.length}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <SmartScaleChecksTable checks={checks} />
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Top stores by SmartScale issues</CardTitle>
            <CardDescription>Fast scan for repeated mismatch and handoff friction.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {topStores.map((store) => (
              <div key={store.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{store.store}</p>
                    <p className="text-sm text-muted-foreground">{store.market}</p>
                  </div>
                  <Badge variant={store.issueCount > 1 ? "accent" : "secondary"}>{store.issueCount} issues</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Adoption</span>
                    <span>{store.adoptionScore}%</span>
                  </div>
                  <Progress className="mt-2" value={store.adoptionScore} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SmartScaleWorkflow() {
  const steps = [
    ["1", "Order packed", "Kitchen seals bag and hands order to SmartScale station.", CheckCircle2],
    ["2", "Place on SmartScale", "Staff sets full order on device for weight capture.", Scale],
    ["3", "Compare expected vs actual", "SmartScale checks order weight against expected profile and tolerance.", CircleAlert],
    ["4", "Within tolerance", "Mark verified, trigger order-ready signal, notify Dasher.", ShieldCheck],
    ["5", "Mismatch detected", "Create SmartScale issue, run AI triage, show recommended fix, delay ready signal, track staff action.", Bot],
    ["6", "Issue resolved", "Mark verified, notify Dasher, close issue.", MessageSquare],
    ["7", "Issue repeated", "Escalate to merchant operations or engineering.", PlugZap]
  ];

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>SmartScale workflow</CardTitle>
        <CardDescription>Packed order to verified handoff, with AI triage and escalation gates.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 xl:grid-cols-7">
          {steps.map(([step, title, body, Icon]) => (
            <div key={step as string} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">Step {step as string}</Badge>
                <div className="grid size-9 place-items-center rounded-md bg-primary/12">
                  <Icon className="size-4 text-primary" />
                </div>
              </div>
              <p className="mt-4 font-semibold">{title as string}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <SmartScaleFlowBranch
            title="Verified path"
            badge="Fast handoff"
            lines={[
              "Weight within tolerance",
              "Order status set to verified",
              "Order-ready signal sent",
              "Dasher notified immediately"
            ]}
          />
          <SmartScaleFlowBranch
            title="Mismatch path"
            badge="AI triage"
            lines={[
              "SmartScale issue created",
              "AI triage classifies likely root cause",
              "Staff sees recommended fix",
              "Ready signal held until action logged"
            ]}
          />
          <SmartScaleFlowBranch
            title="Repeat issue path"
            badge="Escalation"
            lines={[
              "Resolved issue closes and releases order",
              "Repeated pattern stays visible in issue history",
              "Merchant ops gets store/process escalations",
              "Engineering gets device/calibration escalations"
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SmartScaleFlowBranch({ title, badge, lines }: { title: string; badge: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{title}</p>
        <Badge variant="accent">{badge}</Badge>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {lines.map((line, index) => (
          <div key={line} className="flex items-start gap-3">
            <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-white/10 bg-background text-xs text-muted-foreground">
              {index + 1}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} className="bg-card">
            {option.includes("_") ? formatIssueLabel(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SmartScaleChecksTable({ checks }: { checks: SmartScaleCheck[] }) {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader>
        <CardTitle>SmartScale order checks</CardTitle>
        <CardDescription>Order-level triage before Dasher handoff.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 md:hidden">
          {checks.map((check) => {
            const store = smartscaleStores.find((item) => item.id === check.storeId);
            return (
              <div key={check.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{check.orderId}</p>
                    <p className="text-xs text-muted-foreground">{store?.store}</p>
                  </div>
                  <Badge variant={check.severity === "critical" || check.severity === "high" ? "accent" : "secondary"}>{check.result}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <MetricLine label="Expected" value={`${check.expectedWeight} g`} />
                  <MetricLine label="Actual" value={`${check.actualWeight} g`} />
                  <MetricLine label="Difference" value={`${check.difference > 0 ? "+" : ""}${check.difference} g`} />
                  <MetricLine label="Issue" value={formatIssueLabel(check.issueType)} />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{check.aiRecommendation}</p>
              </div>
            );
          })}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1180px] border-collapse text-sm">
            <thead className="border-y border-white/10 bg-white/5 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Store</th>
                <th className="px-5 py-3 font-medium">Expected</th>
                <th className="px-5 py-3 font-medium">Actual</th>
                <th className="px-5 py-3 font-medium">Difference</th>
                <th className="px-5 py-3 font-medium">Result</th>
                <th className="px-5 py-3 font-medium">Issue type</th>
                <th className="px-5 py-3 font-medium">AI recommendation</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((check) => {
                const store = smartscaleStores.find((item) => item.id === check.storeId);
                return (
                  <tr key={check.id} className="border-b border-white/8 transition-colors hover:bg-white/5">
                    <td className="px-5 py-4 font-semibold">{check.orderId}</td>
                    <td className="px-5 py-4 text-muted-foreground">{store?.store}</td>
                    <td className="px-5 py-4">{check.expectedWeight} g</td>
                    <td className="px-5 py-4">{check.actualWeight} g</td>
                    <td className={cn("px-5 py-4 font-medium", check.difference < 0 ? "text-destructive" : check.difference > 0 ? "text-accent" : "text-foreground")}>
                      {check.difference > 0 ? "+" : ""}
                      {check.difference} g
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={check.result === "pass" ? "secondary" : "accent"}>{check.result}</Badge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{formatIssueLabel(check.issueType)}</td>
                    <td className="max-w-sm px-5 py-4 text-muted-foreground">{check.aiRecommendation}</td>
                    <td className="px-5 py-4">
                      <Badge variant="secondary">{check.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadExplorer(props: {
  query: string;
  setQuery: (query: string) => void;
  segment: string;
  setSegment: (segment: string) => void;
  segments: string[];
  leads: Lead[];
  selectedLead: Lead;
  setSelectedLead: (lead: Lead) => void;
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
}) {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  function exportVisibleLeads() {
    const headers = ["Company", "Website", "Segment", "Score", "Intent", "Status"];
    const rows = props.leads.map((lead) => [lead.company, lead.domain, lead.segment, lead.score, lead.intent, lead.status]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "signalforge-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <LeadDiscoveryAgent />
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Lead Explorer</CardTitle>
          <CardDescription>Search, filter, save, and export AI-scored companies.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input className="pl-9" value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="Search companies, segments, signals" />
          </div>
          <select
            className="h-10 rounded-md border border-input bg-white/5 px-3 text-sm text-foreground outline-none"
            value={props.segment}
            onChange={(event) => props.setSegment(event.target.value)}
            aria-label="Segment"
          >
            {props.segments.map((segment) => (
              <option key={segment} className="bg-card">
                {segment}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}>
            <Filter className="size-4" data-icon="inline-start" />
            {advancedFiltersOpen ? "Hide filters" : "Filters"}
          </Button>
          <Button onClick={exportVisibleLeads}>
            <Download className="size-4" data-icon="inline-start" />
            Export
          </Button>
        </CardContent>
        {advancedFiltersOpen ? (
          <CardContent className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
            <MetricLine label="Active segment" value={props.segment} />
            <MetricLine label="Visible accounts" value={props.leads.length.toString()} />
            <MetricLine label="Min AI score" value="75+" />
          </CardContent>
        ) : null}
      </Card>
      <LeadTable {...props} />
    </div>
  );
}

function LeadTable({
  query,
  setQuery,
  leads: visibleLeads,
  selectedLead,
  setSelectedLead,
  savedIds,
  toggleSaved
}: {
  query: string;
  setQuery: (query: string) => void;
  leads: Lead[];
  selectedLead: Lead;
  setSelectedLead: (lead: Lead) => void;
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
}) {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>AI Lead Discovery</CardTitle>
          <CardDescription>Realtime company signals ranked by buying fit.</CardDescription>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 md:hidden">
          {visibleLeads.map((lead) => (
            <div
              key={lead.id}
              role="button"
              tabIndex={0}
              className={cn(
                "rounded-lg border border-white/10 bg-white/5 p-4 text-left transition-colors",
                selectedLead.id === lead.id && "border-primary/40 bg-primary/8"
              )}
              onClick={() => setSelectedLead(lead)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setSelectedLead(lead);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{lead.company}</p>
                  <p className="truncate text-xs text-muted-foreground">{lead.domain}</p>
                </div>
                <Badge variant={lead.status === "Qualified" ? "accent" : "secondary"}>{lead.score}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{lead.segment}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{lead.intent}</p>
              <div className="mt-3 flex items-center gap-2">
                <Progress value={lead.score} />
                <Button
                  size="icon"
                  variant={savedIds.has(lead.id) ? "secondary" : "ghost"}
                  aria-label="Save lead"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSaved(lead.id);
                  }}
                >
                  <Save className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="border-y border-white/10 bg-white/5 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Segment</th>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">Intent</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className={cn("border-b border-white/8 transition-colors hover:bg-white/5", selectedLead.id === lead.id && "bg-primary/8")}
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-md bg-white/8">
                        <Building2 className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{lead.company}</p>
                        <p className="text-xs text-muted-foreground">{lead.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{lead.segment}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{lead.score}</span>
                      <Progress className="w-20" value={lead.score} />
                    </div>
                  </td>
                  <td className="max-w-xs px-5 py-4 text-muted-foreground">{lead.intent}</td>
                  <td className="px-5 py-4">
                    <Badge variant={lead.status === "Qualified" ? "accent" : "secondary"}>{lead.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      size="icon"
                      variant={savedIds.has(lead.id) ? "secondary" : "ghost"}
                      aria-label="Save lead"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSaved(lead.id);
                      }}
                    >
                      <Save className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentPanel({
  selectedLead,
  aiResult,
  runGeneration,
  isGenerating
}: {
  selectedLead: Lead;
  aiResult: string;
  runGeneration: (task: "summary" | "outreach") => void;
  isGenerating: boolean;
}) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Company Research Agent</CardTitle>
            <CardDescription>{selectedLead.company}</CardDescription>
          </div>
          <Badge>AI</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm leading-6 text-muted-foreground">{aiResult}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedLead.signals.map((signal) => (
            <Badge key={signal} variant="secondary">
              {signal}
            </Badge>
          ))}
        </div>
        <Button onClick={() => runGeneration("summary")} disabled={isGenerating}>
          <Wand2 className="size-4" data-icon="inline-start" />
          {isGenerating ? "Generating..." : "Generate AI summary"}
        </Button>
      </CardContent>
    </Card>
  );
}

function CompanyIntelligence(props: {
  selectedLead: Lead;
  aiResult: string;
  runGeneration: (task: "summary" | "outreach") => void;
  isGenerating: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <CompanyIntelligenceAgent selectedLead={props.selectedLead} />
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>{props.selectedLead.company}</CardTitle>
            <CardDescription>{props.selectedLead.segment} · {props.selectedLead.location}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <MetricLine label="Employees" value={props.selectedLead.employees.toLocaleString()} />
            <MetricLine label="Revenue" value={props.selectedLead.revenue} />
            <MetricLine label="Owner" value={props.selectedLead.owner} />
            <MetricLine label="Lead score" value={`${props.selectedLead.score}/100`} />
            <Progress value={props.selectedLead.score} />
          </CardContent>
        </Card>
        <AgentPanel {...props} />
      </div>
    </div>
  );
}

function OutreachGenerator({
  selectedLead,
  email,
  setEmail,
  runGeneration,
  isGenerating
}: {
  selectedLead: Lead;
  email: string;
  setEmail: (value: string) => void;
  runGeneration: (task: "summary" | "outreach") => void;
  isGenerating: boolean;
}) {
  return <OutreachSuiteGenerator selectedLead={selectedLead} />;
}

function LeadDiscoveryAgent() {
  const [inputs, setInputs] = useState({
    industry: "Healthcare AI",
    companySize: "100-500",
    location: "United States",
    keywords: "RevOps hiring, CRM enrichment, enterprise SDR team",
    fundingStage: "Series B-C"
  });
  const [results, setResults] = useState<DiscoveredLead[]>([
    {
      companyName: "HelioGrid Analytics",
      website: "https://heliogrid.ai",
      reason: "Climate data platform with Series B funding, 120-employee GTM team, and active RevOps hiring.",
      leadScore: 92,
      hiringActivity: "Hiring SDR Manager, Revenue Operations Analyst, and Enterprise AE.",
      outreachAngle: "Lead with faster territory prioritization for utility and energy accounts."
    }
  ]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function discover() {
    setLoading(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "lead-discovery", inputs })
    });
    const data = await response.json();
    setResults(data.leads ?? results);
    setLoading(false);
  }

  const visible = results.filter((lead) => [lead.companyName, lead.reason, lead.hiringActivity, lead.outreachAngle].join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>AI Lead Discovery Agent</CardTitle>
        <CardDescription>Generate ICP-matched companies from industry, size, location, keywords, and funding stage.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ["industry", "Industry"],
            ["companySize", "Company size"],
            ["location", "Location"],
            ["keywords", "Keywords"],
            ["fundingStage", "Funding stage"]
          ].map(([key, label]) => (
            <div key={key} className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">{label}</label>
              <Input value={inputs[key as keyof typeof inputs]} onChange={(event) => setInputs({ ...inputs, [key]: event.target.value })} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search generated companies" />
          </div>
          <Button onClick={discover} disabled={loading}>
            <Radar className="size-4" data-icon="inline-start" />
            {loading ? "Discovering..." : "Discover leads"}
          </Button>
        </div>
        <div className="grid gap-3 md:hidden">
          {visible.map((lead) => (
            <div key={lead.companyName} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{lead.companyName}</p>
                  <p className="truncate text-xs text-primary">{lead.website}</p>
                </div>
                <Badge variant="accent">{lead.leadScore}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{lead.reason}</p>
              <Separator className="my-3" />
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Hiring</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{lead.hiringActivity}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Angle</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{lead.outreachAngle}</p>
            </div>
          ))}
        </div>
        <div className="scrollbar-thin hidden overflow-x-auto rounded-lg border border-white/10 md:block">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Website</th>
                <th className="px-4 py-3 font-medium">ICP reason</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Hiring</th>
                <th className="px-4 py-3 font-medium">Outreach angle</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.companyName} className="border-t border-white/8">
                  <td className="px-4 py-4 font-semibold">{lead.companyName}</td>
                  <td className="px-4 py-4 text-primary">{lead.website}</td>
                  <td className="max-w-xs px-4 py-4 text-muted-foreground">{lead.reason}</td>
                  <td className="px-4 py-4"><Badge variant="accent">{lead.leadScore}</Badge></td>
                  <td className="max-w-xs px-4 py-4 text-muted-foreground">{lead.hiringActivity}</td>
                  <td className="max-w-xs px-4 py-4 text-muted-foreground">{lead.outreachAngle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function OutreachSuiteGenerator({ selectedLead }: { selectedLead: Lead }) {
  const [inputs, setInputs] = useState({
    companySummary: selectedLead.summary,
    prospectRole: "VP Revenue Operations",
    painPoints: "Manual account research, low reply rates, CRM data gaps",
    outreachTone: "consultative, concise, confident"
  });
  const [suite, setSuite] = useState<OutreachSuite>({
    coldEmail: `Subject: ${selectedLead.company} GTM signals\n\nHi there,\n\nSaw ${selectedLead.company} is showing signals around ${selectedLead.intent.toLowerCase()}. SignalForge AI helps teams turn those signals into scored lead lists, research briefs, and outbound in one workflow.\n\nOpen to a quick compare?`,
    linkedInDM: `Saw ${selectedLead.company} is expanding GTM work. SignalForge AI helps teams find high-fit accounts and personalize outreach from real buying signals. Worth a quick look?`,
    followUpSequence: ["Day 2: Send one account insight.", "Day 5: Share role-specific use case.", "Day 9: Offer sample lead list."],
    callOpener: "I’m calling because your team appears to be scaling outbound, and we help reps prioritize accounts already showing buying intent."
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  async function generate() {
    setLoading(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "outreach-suite", inputs })
    });
    const data = await response.json();
    setSuite({
      coldEmail: data.coldEmail ?? suite.coldEmail,
      linkedInDM: data.linkedInDM ?? suite.linkedInDM,
      followUpSequence: data.followUpSequence ?? suite.followUpSequence,
      callOpener: data.callOpener ?? suite.callOpener
    });
    setLoading(false);
  }

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>AI Outreach Generator</CardTitle>
          <CardDescription>Generate email, LinkedIn DM, follow-ups, and call opener.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea value={inputs.companySummary} onChange={(event) => setInputs({ ...inputs, companySummary: event.target.value })} placeholder="Company summary" />
          <Input value={inputs.prospectRole} onChange={(event) => setInputs({ ...inputs, prospectRole: event.target.value })} placeholder="Prospect role" />
          <Textarea value={inputs.painPoints} onChange={(event) => setInputs({ ...inputs, painPoints: event.target.value })} placeholder="Pain points" />
          <Input value={inputs.outreachTone} onChange={(event) => setInputs({ ...inputs, outreachTone: event.target.value })} placeholder="Outreach tone" />
          <Button onClick={generate} disabled={loading}>
            <RefreshCw className="size-4" data-icon="inline-start" />
            {loading ? "Regenerating..." : "Regenerate outreach"}
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <OutputCard title="Cold Email" icon={Mail} value={suite.coldEmail} copied={copied === "Cold Email"} onCopy={() => copy("Cold Email", suite.coldEmail)} />
        <OutputCard title="LinkedIn DM" icon={MessageSquare} value={suite.linkedInDM} copied={copied === "LinkedIn DM"} onCopy={() => copy("LinkedIn DM", suite.linkedInDM)} />
        <OutputCard title="Follow-up Sequence" icon={Send} value={suite.followUpSequence.join("\n")} copied={copied === "Follow-up Sequence"} onCopy={() => copy("Follow-up Sequence", suite.followUpSequence.join("\n"))} />
        <OutputCard title="Call Opener" icon={Phone} value={suite.callOpener} copied={copied === "Call Opener"} onCopy={() => copy("Call Opener", suite.callOpener)} />
      </div>
    </div>
  );
}

function OutputCard({ title, icon: Icon, value, copied, onCopy }: { title: string; icon: typeof Mail; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <Card className="glass-panel">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <Button size="sm" variant="outline" onClick={onCopy}>
          <Copy className="size-4" data-icon="inline-start" />
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-6 text-muted-foreground">{value}</pre>
      </CardContent>
    </Card>
  );
}

function CompanyIntelligenceAgent({ selectedLead }: { selectedLead: Lead }) {
  const [intel, setIntel] = useState({
    summary: selectedLead.summary,
    businessModel: "B2B SaaS with enterprise contracts and expansion revenue.",
    likelyPainPoints: ["Manual account research", "CRM data gaps", "Low outbound personalization"],
    growthIndicators: selectedLead.signals,
    hiringTrends: ["Revenue Operations", "Enterprise AEs", "Sales Development"],
    gtmOpportunities: ["ABM list creation", "Persona-specific outreach", "Buying trigger alerts"]
  });
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "company-intelligence", company: selectedLead })
    });
    const data = await response.json();
    setIntel({ ...intel, ...data });
    setLoading(false);
  }

  const cards = [
    ["Company Summary", intel.summary],
    ["Business Model", intel.businessModel],
    ["Likely Pain Points", intel.likelyPainPoints.join(", ")],
    ["Growth Indicators", intel.growthIndicators.join(", ")],
    ["Hiring Trends", intel.hiringTrends.join(", ")],
    ["GTM Opportunities", intel.gtmOpportunities.join(", ")]
  ];

  return (
    <Card className="glass-panel">
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Company Intelligence AI Agent</CardTitle>
          <CardDescription>Summarize business model, pain, growth, hiring, and GTM opportunities.</CardDescription>
        </div>
        <Button onClick={generate} disabled={loading}>
          <Bot className="size-4" data-icon="inline-start" />
          {loading ? "Analyzing..." : "Analyze company"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, body]) => (
          <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LeadScoringEngine({ selectedLead }: { selectedLead: Lead }) {
  const [score, setScore] = useState({
    score: selectedLead.score,
    confidence: "High",
    reasoning: "Strong industry fit, GTM hiring, and buying-signal density indicate high propensity to engage.",
    recommendedAction: "Route to SDR, generate RevOps outreach, and enroll in 9-day follow-up sequence."
  });
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "lead-score",
        company: selectedLead,
        inputs: {
          fundingActivity: "recent funding signal",
          employeeGrowth: "accelerating",
          hiringActivity: selectedLead.intent,
          webTraffic: "rising",
          socialEngagement: "moderate-high",
          companySize: selectedLead.employees,
          industryFit: selectedLead.segment
        }
      })
    });
    const data = await response.json();
    setScore({ ...score, ...data });
    setLoading(false);
  }

  return (
    <Card className="glass-panel">
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>AI Lead Scoring Engine</CardTitle>
          <CardDescription>Funding, growth, hiring, traffic, social, size, and industry fit.</CardDescription>
        </div>
        <Button onClick={calculate} disabled={loading}>
          <Flame className="size-4" data-icon="inline-start" />
          {loading ? "Scoring..." : "Score lead"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div className="grid place-items-center rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="signal-ring grid size-28 place-items-center rounded-full p-1">
            <div className="grid size-full place-items-center rounded-full bg-background">
              <span className="text-3xl font-bold">{score.score}</span>
            </div>
          </div>
          <Badge className="mt-4" variant="accent">{score.confidence} confidence</Badge>
        </div>
        <div className="flex flex-col gap-3">
          <MetricLine label="Reasoning" value={score.reasoning} />
          <MetricLine label="Recommended action" value={score.recommendedAction} />
          {["Funding activity", "Employee growth", "Hiring activity", "Web traffic", "Social engagement", "Company size", "Industry fit"].map((factor, index) => (
            <div key={factor} className="grid grid-cols-[150px_1fr] items-center gap-3 text-sm">
              <span className="text-muted-foreground">{factor}</span>
              <Progress value={86 - index * 5} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignManager({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Campaign Manager</CardTitle>
        <CardDescription>CRM-style tracking for outbound motions.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {campaigns.slice(0, compact ? 3 : campaigns.length).map((campaign) => (
          <div key={campaign.name} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{campaign.name}</p>
                <p className="text-sm text-muted-foreground">{campaign.sent.toLocaleString()} sent · {campaign.replies} replies</p>
              </div>
              <Badge variant="accent">{campaign.pipeline}</Badge>
            </div>
            <Progress className="mt-4" value={campaign.conversion * 6} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Analytics({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>Lead discovery and pipeline sourced trend.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("h-72", compact && "h-64")}>
          <Chart />
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsPanel() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Auth, integrations, realtime sync, and AI model configuration.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            ["Authentication", "Supabase email/password, magic links, and protected dashboard routes."],
            ["OpenAI", "Responses API route with structured JSON for summaries, outreach, and scoring."],
            ["Realtime CRM", "Subscribe to lead, campaign, and activity changes from Supabase."],
            ["Exports", "CSV lead lists and campaign snapshots ready for revenue teams."]
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <AutomationGrid />
    </div>
  );
}

function AutomationGrid({ compact = false }: { compact?: boolean }) {
  const automations = [
    ["Email sending", "Send sequenced emails from saved lead lists.", Mail],
    ["Automated follow-ups", "Trigger multi-step follow-ups by reply and time delay.", RefreshCw],
    ["CRM sync", "Push accounts, contacts, activity, and scores to CRM.", PlugZap],
    ["Slack integration", "Alert reps when ICP accounts spike in intent.", MessageSquare],
    ["AI SDR agent", "Research accounts, draft touches, and prep daily call blocks.", Bot],
    ["Voice calling agent", "Generate openers and route call outcomes back to CRM.", Headphones],
    ["LinkedIn automation", "Create connect notes, DMs, and role-based social touches.", Link],
    ["Meeting booking", "Route qualified replies into booking flows and owner calendars.", Calendar],
    ["Workflow automations", "Chain scoring, enrichment, outreach, alerts, and handoffs.", Workflow]
  ];

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Advanced GTM Automations</CardTitle>
        <CardDescription>Email, follow-ups, CRM, Slack, AI SDR, voice, LinkedIn, meetings, and workflows.</CardDescription>
      </CardHeader>
      <CardContent className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-3", compact && "xl:grid-cols-2")}>
        {automations.slice(0, compact ? 6 : automations.length).map(([title, body, Icon]) => (
          <div key={title as string} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-md bg-primary/12">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="font-semibold">{title as string}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body as string}</p>
            <Badge className="mt-3" variant="secondary">Configured</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RightRail({
  selectedLead,
  savedIds,
  runGeneration,
  isGenerating
}: {
  selectedLead: Lead;
  savedIds: Set<string>;
  runGeneration: (task: "summary" | "outreach") => void;
  isGenerating: boolean;
}) {
  const savedLeads = leads.filter((lead) => savedIds.has(lead.id));
  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Lead Score</CardTitle>
          <CardDescription>{selectedLead.company}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid place-items-center rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="signal-ring grid size-28 place-items-center rounded-full p-1">
              <div className="grid size-full place-items-center rounded-full bg-background">
                <span className="text-3xl font-bold">{selectedLead.score}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => runGeneration("outreach")} disabled={isGenerating}>
            <Bot className="size-4" data-icon="inline-start" />
            Draft outreach
          </Button>
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Saved Lists</CardTitle>
          <CardDescription>{savedLeads.length} accounts ready to export.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {savedLeads.map((lead) => (
            <div key={lead.id} className="flex items-center gap-3 rounded-md bg-white/5 p-3">
              <ListChecks className="size-4 text-accent" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{lead.company}</p>
                <p className="text-xs text-muted-foreground">Score {lead.score}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}

function SmartScaleRail({ checks }: { checks: SmartScaleCheck[] }) {
  const devicesNeedingAttention = smartscaleDevices.filter((device) => device.status !== "online" || device.calibrationStatus !== "current");
  const urgentChecks = checks.filter((check) => check.severity === "critical" || check.severity === "high");

  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Urgent queue</CardTitle>
          <CardDescription>{urgentChecks.length} orders need fast intervention.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {urgentChecks.slice(0, 4).map((check) => (
            <div key={check.id} className="rounded-md bg-white/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{check.orderId}</p>
                <Badge variant="accent">{check.severity}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{check.aiRecommendation}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Device attention</CardTitle>
          <CardDescription>{devicesNeedingAttention.length} scales off normal state.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {devicesNeedingAttention.map((device) => {
            const store = smartscaleStores.find((item) => item.id === device.storeId);
            return (
              <div key={device.id} className="rounded-md bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{device.name}</p>
                  <Badge variant={device.status === "offline" ? "accent" : "secondary"}>{device.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{store?.store}</p>
                <p className="mt-2 text-xs text-muted-foreground">Calibration: {device.calibrationStatus}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </aside>
  );
}

function Chart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full min-h-48 rounded-lg bg-white/5" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="leads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#58f6ff" stopOpacity={0.55} />
            <stop offset="95%" stopColor="#58f6ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pipeline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ccff4d" stopOpacity={0.42} />
            <stop offset="95%" stopColor="#ccff4d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#8f9daf", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8f9daf", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "#0b1019",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            color: "#f8fbff"
          }}
        />
        <Area type="monotone" dataKey="pipeline" stroke="#ccff4d" fillOpacity={1} fill="url(#pipeline)" strokeWidth={2} />
        <Area type="monotone" dataKey="leads" stroke="#58f6ff" fillOpacity={1} fill="url(#leads)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-white/5 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}
