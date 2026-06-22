"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useContent } from "./ContentProvider";
import { icons } from "./Icons";

/**
 * Mobile-only block shown under the photo + description.
 *
 * Layout: a dominant "About me" button, with "Portfolio" and "Contact" below.
 * "Contact" opens a bottom sheet listing every social link (and email).
 *
 * Hidden on md+ where the full navbar and contact card take over.
 */
export function MobileActions() {
  const data = useContent();
  const [open, setOpen] = useState(false);
  const { home } = data;
  const socials = data.socials.filter((s) => s.href.trim() !== "");

  // Close on Escape and lock background scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const Email = icons.email;

  return (
    <div className="md:hidden">
      <div className="mt-7 flex flex-col gap-3">
        {/* Dominant primary action */}
        <Link
          href="/about"
          className="rounded-2xl bg-primary px-6 py-4 text-center text-base font-bold text-primary-text shadow-sm transition-transform hover:scale-[1.02]"
        >
          About me
        </Link>

        {/* Two secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/portfolio"
            className="rounded-2xl border border-border bg-surface-alt px-5 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-accent"
          >
            Portfolio
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-2xl border border-border bg-surface-alt px-5 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-accent"
          >
            Contact
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="sheet-backdrop absolute inset-0 bg-black/40"
          />
          <div className="sheet-panel relative w-full rounded-t-4xl bg-surface-alt p-6 pb-8 shadow-xl">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-text">
                Get in touch
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-text-muted hover:text-text"
              >
                Close
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {home.email && (
                <li>
                  <a
                    href={`mailto:${home.email}`}
                    className="flex items-center gap-4 rounded-2xl border border-border p-3 text-text transition-colors hover:border-accent"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-text">
                      <Email className="h-5 w-5" />
                    </span>
                    <span className="font-medium">Email</span>
                  </a>
                </li>
              )}
              {socials.map((social) => {
                const Icon = icons[social.id];
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-2xl border border-border p-3 text-text transition-colors hover:border-accent"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
                        {Icon ? <Icon className="h-5 w-5" /> : null}
                      </span>
                      <span className="font-medium">{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
