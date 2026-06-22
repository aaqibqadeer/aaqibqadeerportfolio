"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-text-muted hover:text-text"
    >
      Log out
    </button>
  );
}
