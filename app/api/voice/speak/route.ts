import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = String(body.input ?? "").trim();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 503 });
  }

  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const audio = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "marin",
    input,
    instructions: "Speak like a calm operations copilot. Crisp, clear, and urgent only when needed.",
    response_format: "mp3"
  });

  const buffer = Buffer.from(await audio.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store"
    }
  });
}
