import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ mode: "demo" });
  }

  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: "gpt-realtime-2",
        audio: {
          output: {
            voice: "marin"
          }
        }
      }
    })
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
