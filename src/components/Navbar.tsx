"use client";

import Link from "next/link";
import { useContent } from "./ContentProvider";
import { ThemeSwitcher } from "./ThemeSwitcher";

/** Top navigation: brand, page links, theme switcher and optional CTA. */
export function Navbar() {
  const data = useContent();
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:py-6">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          {data.brand}
        </Link>

        {/* On mobile the nav links, theme switcher and CTA are hidden to keep
            the homepage scroll-free; their actions move into MobileActions. */}
        <div className="hidden flex-wrap items-center gap-6 md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {data.nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeSwitcher />

          {data.navCta && (
            <Link
              href={data.navCta.href}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-text shadow-sm transition-transform hover:scale-105"
            >
              {data.navCta.label}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
