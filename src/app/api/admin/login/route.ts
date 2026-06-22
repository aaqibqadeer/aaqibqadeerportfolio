import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  isAuthConfigured,
  sessionToken,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: Request) {
  if (!isAuthConfigured) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_PASSWORD." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
