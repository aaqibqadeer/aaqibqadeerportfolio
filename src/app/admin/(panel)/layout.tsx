import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthed()) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-5">
            <span className="font-display text-xl font-semibold">Admin</span>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/admin" className="text-text-muted hover:text-text">
                Content
              </Link>
              <Link
                href="/admin/analytics"
                className="text-text-muted hover:text-text"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm font-medium text-text-muted hover:text-text"
            >
              View site ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
