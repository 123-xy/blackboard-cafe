import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the friendly virtual assistant for Blackboard Café, embedded on its website. Answer only using these verified facts. Keep replies short (2-4 sentences), warm, and helpful. If something isn't covered by these facts (e.g. exact hours, menu prices, table availability), say you don't have that detail and suggest contacting the café directly by phone (+91 99496-70225), email (venuacha@whiteboard.cafe), or WhatsApp.

BRAND: Blackboard Café, parent company Bevgo Ventures Pvt. Ltd. Founded as Whiteboard Café in 2015, rebranded to Blackboard Café in 2018.
VISION: To be "a second home between work and home" through healthy, diverse, high-quality food, high customer satisfaction, and memorable experiences via innovation and service excellence.
PRESENCE: Corporate offices, educational institutions, and exhibition venues.
FOUNDER: Dr. Jagannath Kallakurchi, 30+ years of experience, alumnus of IIT Roorkee, Indian School of Business (ISB), and Harvard Business School.
LEADERSHIP: Venu Gopal Acha, General Manager – Operations, previously at Taj Hotels and Novotel.
CORE SERVICES: Premium café & dining, conference & meeting room facilities, co-working friendly environment, multi-cuisine food & beverages, customized catering solutions.
INSTITUTIONAL CATERING: Serves 4,000+ students daily; nutritious, affordable, hygienic meals; meal-card and cashless payment systems.
CORPORATE CATERING: Capacity for 1,000+ employees; customized weekly/monthly menus; centralized kitchen operations.
EVENT CATERING: Experience at HITEX Exhibition Centre — trade fairs, exhibitions, conferences, corporate events.
CONTACT: Phone +91 99496-70225, email venuacha@whiteboard.cafe, located in Hyderabad, Telangana, India.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") && typeof v.content === "string"
  );
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Chat assistant is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || !rawMessages.every(isChatMessage)) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  // Cap history so a runaway client can't blow up token usage.
  const messages = rawMessages.slice(-20) as ChatMessage[];

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({
      reply: reply || "Sorry, I couldn't come up with a response — please try again.",
    });
  } catch (err) {
    console.error("chat route error", err);
    return NextResponse.json(
      { error: "Sorry, I couldn't reach the assistant right now." },
      { status: 502 },
    );
  }
}
