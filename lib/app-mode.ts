export type AppMode = "signalforge" | "smartdash";

export const signalForgePages = [
  "Dashboard",
  "Lead Explorer",
  "Company Intelligence",
  "Outreach",
  "Campaigns",
  "Analytics",
  "Settings"
] as const;

export const smartDashPages = [
  "Dashboard",
  "Multi-Agent Supervisor",
  "Executive Ops",
  "SmartScale Operations",
  "SmartScale Fraud",
  "Merchant Intelligence",
  "Dasher Operations",
  "Simulation Lab",
  "Incident Replay",
  "Voice Ops",
  "Dispatch Optimizer",
  "Fleet Health",
  "Customer Recovery",
  "Settings"
] as const;

export function getAppMode(): AppMode {
  const rawMode = (process.env.NEXT_PUBLIC_APP_MODE ?? process.env.APP_MODE ?? "smartdash").toLowerCase();
  return rawMode === "signalforge" ? "signalforge" : "smartdash";
}

export function getAllowedPages(mode: AppMode) {
  return mode === "signalforge" ? [...signalForgePages] : [...smartDashPages];
}

export function getDefaultPage(mode: AppMode) {
  return mode === "signalforge" ? "Dashboard" : "Multi-Agent Supervisor";
}

export function getAppBrand(mode: AppMode) {
  if (mode === "signalforge") {
    return {
      eyebrow: "SignalForge",
      title: "AI",
      subtitle: "Revenue command center",
      searchPlaceholder: "Search accounts, campaigns, personas",
      footerTitle: "Supabase Auth",
      footerBody: "Cookie-backed sessions, RLS-ready saved leads, and realtime CRM updates."
    };
  }

  return {
    eyebrow: "Smart Dash",
    title: "AI Agent",
    subtitle: "Operations command center",
    searchPlaceholder: "Search incidents, stores, robots",
    footerTitle: "Operations sync",
    footerBody: "Fleet, SmartScale, merchant, customer, and maintenance workflows aligned in one command layer."
  };
}
