import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalForge AI",
  description: "AI-powered GTM workspace for lead discovery, research, outreach, scoring, and campaign intelligence."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
