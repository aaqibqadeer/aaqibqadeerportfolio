"use client";

import { useContent } from "./ContentProvider";
import { icons } from "./Icons";

/**
 * Renders the social link buttons from the site content. Any social with an
 * empty `href` is skipped, so every link is effectively optional.
 */
export function Socials() {
  const data = useContent();
  const links = data.socials.filter((s) => s.href.trim() !== "");
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {links.map((social) => {
        const Icon = icons[social.id];
        return (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-alt text-text transition-all hover:scale-110 hover:border-accent hover:text-accent"
            >
              {Icon ? <Icon className="h-5 w-5" /> : social.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
