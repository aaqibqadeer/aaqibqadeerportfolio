import { NextResponse } from "next/server";
import { recordView } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const path = typeof body.path === "string" ? body.path : "";
  // Only count real, non-admin page paths.
  if (!path.startsWith("/") || path.startsWith("/admin")) {
    return new NextResponse(null, { status: 204 });
  }
  try {
    await recordView(path);
  } catch {
    // analytics is best-effort; never fail the request
  }
  return new NextResponse(null, { status: 204 });
}
