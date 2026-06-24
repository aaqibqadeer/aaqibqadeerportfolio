import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/content";
import type { SiteData } from "@/data/data";

// LLM calls happen at request time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Build the system prompt that turns Claude into "Aaqib AI" — an assistant that
 * answers questions about Aaqib using the site content as its knowledge base.
 */
function buildSystemPrompt(data: SiteData): string {
  const slides = data.about.slides
    .map((s) => `- ${s.kicker ? s.kicker + ": " : ""}${s.title} — ${s.body}`)
    .join("\n");
  const projects = data.portfolio.projects
    .map(
      (p) =>
        `- ${p.title} (${p.category}; ${p.tags.join(", ")}): ${p.description} ${p.detail.overview}`
    )
    .join("\n");
  const socials = data.socials
    .filter((s) => s.href.trim() !== "")
    .map((s) => `- ${s.label}: ${s.href}`)
    .join("\n");

  return `You are "Aaqib AI", a friendly assistant embedded on ${data.brand}'s personal portfolio website. Your job is to answer visitors' questions about ${data.brand} — background, skills, projects, and how to get in touch.

Only answer using the information below. If you don't know something, say so honestly and point the visitor to the contact options rather than inventing details. Keep replies concise, warm, and in the first person as if you are speaking on ${data.brand}'s behalf (e.g. "Aaqib has...").

=== ABOUT ${data.brand.toUpperCase()} ===
${data.home.intro}

=== STORY / MILESTONES ===
${slides}

=== PROJECTS ===
${projects}

=== CONTACT ===
Email: ${data.home.email ?? "not provided"}
${socials}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const incoming: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages
    : [];

  // Keep only valid, non-empty turns, capped to a recent window.
  const messages = incoming
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() !== ""
    )
    .slice(-12);

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "A user message is required." },
      { status: 400 }
    );
  }

  const data = await getSiteData();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key yet → return a helpful stub so the interface still works.
  // TODO: set ANTHROPIC_API_KEY in your environment to enable real answers.
  if (!apiKey) {
    return NextResponse.json({
      reply: `Hi! I'm ${data.brand}'s AI assistant. I'm not connected to a language model yet — once an ANTHROPIC_API_KEY is configured I'll happily answer questions about ${data.brand}, the projects, and how to get in touch. In the meantime, feel free to browse the site or use the Contact options.`,
      configured: false,
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: buildSystemPrompt(data),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: reply || "…", configured: true });
  } catch (err) {
    console.error("AaqibAI error:", err);
    return NextResponse.json(
      { error: "The assistant is unavailable right now. Please try again." },
      { status: 500 }
    );
  }
}
