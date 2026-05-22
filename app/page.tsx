import { SignalForgeShell } from "@/components/signalforge-shell";
import { getAppMode } from "@/lib/app-mode";

export default function HomePage() {
  const mode = getAppMode();
  return <SignalForgeShell landing={mode === "signalforge"} activePage={mode === "signalforge" ? "Dashboard" : "Multi-Agent Supervisor"} />;
}
