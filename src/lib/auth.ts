import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Minimal password-gate auth for the admin panel.
 *
 * On login we verify the password against ADMIN_PASSWORD and set a cookie
 * containing a deterministic HMAC token. Every protected request recomputes the
 * expected token and compares it in constant time. No DB session store needed.
 */

export const ADMIN_COOKIE = "admin_session";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "";
// A separate secret is recommended; fall back to the password so it still works.
const SECRET = process.env.ADMIN_SECRET ?? PASSWORD ?? "";

/** True when an admin password has been configured. */
export const isAuthConfigured = PASSWORD.trim() !== "";

/** The token value stored in the cookie for an authenticated admin. */
export function sessionToken(): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update("admin-session-v1")
    .digest("hex");
}

/** Check a submitted password against the configured one (constant time). */
export function verifyPassword(submitted: string): boolean {
  if (!isAuthConfigured) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Whether the current request carries a valid admin session cookie. */
export function isAuthed(): boolean {
  if (!isAuthConfigured) return false;
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  if (!cookie) return false;
  const expected = sessionToken();
  const a = Buffer.from(cookie);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
