import type { Metadata } from "next";
import "./globals.css";
import { getAppMode } from "@/lib/app-mode";

const appMode = getAppMode();

export const metadata: Metadata = {
  title: appMode === "signalforge" ? "SignalForge AI" : "Smart Dash AI Agent",
  description:
    appMode === "signalforge"
      ? "AI-powered GTM workspace for lead discovery, research, outreach, scoring, and campaign intelligence."
      : "AI-powered delivery operations command center for fleet, SmartScale, dispatch, merchant, maintenance, and customer recovery workflows."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
