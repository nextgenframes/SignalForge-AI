import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ text: "", source: "demo" });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const transcription = await client.audio.transcriptions.create({
    file,
    model: "gpt-4o-mini-transcribe"
  });

  return NextResponse.json({ text: transcription.text, source: "openai" });
}
