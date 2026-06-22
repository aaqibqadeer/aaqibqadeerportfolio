import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { saveSiteData } from "@/lib/content";
import type { SiteData } from "@/data/data";

export async function PUT(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI to enable saving." },
      { status: 503 }
    );
  }

  let body: SiteData;
  try {
    body = (await req.json()) as SiteData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Light sanity check on required top-level shape.
  if (
    !body ||
    typeof body.brand !== "string" ||
    !body.home ||
    !Array.isArray(body.socials) ||
    !body.about ||
    !body.portfolio
  ) {
    return NextResponse.json(
      { error: "Content is missing required fields." },
      { status: 400 }
    );
  }

  try {
    await saveSiteData(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save content:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
}
