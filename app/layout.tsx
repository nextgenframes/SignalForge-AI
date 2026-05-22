import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Dash AI Agent",
  description: "AI-powered delivery operations command center for fleet, SmartScale, dispatch, merchant, maintenance, and customer recovery workflows."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
