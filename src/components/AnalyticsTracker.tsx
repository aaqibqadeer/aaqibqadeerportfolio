"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fires a lightweight first-party page-view beacon on every route change.
 * Admin routes are ignored. Backed by /api/track → MongoDB.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const controller = new AbortController();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {});
    return () => controller.abort();
  }, [pathname]);

  return null;
}
