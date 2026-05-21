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
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Filter,
  Flame,
  Headphones,
  LayoutDashboard,
  Link,
  ListChecks,
  Lock,
  Mail,
  Menu,
  MessageSquare,
  Phone,
  PlugZap,
  Radar,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wand2,
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
import { campaigns, chartData, leads, navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types";

const navIcons = [LayoutDashboard, Search, Bot, Mail, Target, BarChart3, Settings];

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

export function SignalForgeShell({ activePage = "Dashboard", landing = false }: ShellProps) {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead>(leads[0]);
  const [savedIds, setSavedIds] = useState(() => new Set(leads.filter((lead) => lead.saved).map((lead) => lead.id)));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aiResult, setAiResult] = useState(selectedLead.summary);
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
          <Topbar activePage={activePage} setMobileNavOpen={setMobileNavOpen} />
          {landing ? (
            <>
              <LandingHero />
              <LandingSections />
            </>
          ) : (
            <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-6">
              <div className="min-w-0">{mainContent}</div>
              <RightRail selectedLead={selectedLead} savedIds={savedIds} runGeneration={runGeneration} isGenerating={isGenerating} />
            </div>
          )}
        </section>
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
            <p className="text-sm font-semibold text-muted-foreground">SignalForge</p>
            <h1 className="text-xl font-bold tracking-tight">AI</h1>
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
              href={item === "Dashboard" ? "/dashboard" : `/${item.toLowerCase().replaceAll(" ", "-").replace("outreach", "outreach-generator").replace("campaigns", "campaign-manager")}`}
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

function Topbar({ activePage, setMobileNavOpen }: { activePage: string; setMobileNavOpen: (open: boolean) => void }) {
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
      <Button size="icon" variant="outline" aria-label="Notifications">
        <Bell className="size-4" />
      </Button>
      <Button>
        <Sparkles className="size-4" data-icon="inline-start" />
        New agent
      </Button>
    </header>
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
            <Button variant="outline">View live pipeline</Button>
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
              <Button className="mt-5 w-full">{plan === "Enterprise" ? "Talk to sales" : "Start now"}</Button>
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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <LeadTable {...props} />
        <AgentPanel selectedLead={props.selectedLead} aiResult={props.aiResult} runGeneration={props.runGeneration} isGenerating={props.isGenerating} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <CampaignManager compact />
        <Analytics compact />
      </div>
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
          <Button variant="outline">
            <Filter className="size-4" data-icon="inline-start" />
            Filters
          </Button>
          <Button>
            <Download className="size-4" data-icon="inline-start" />
            Export
          </Button>
        </CardContent>
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
