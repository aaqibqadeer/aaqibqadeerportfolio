import type { ProjectLinks } from "@/data/data";

type IconProps = { className?: string };

const GithubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
);

const VisitIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

const LiveIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M10 9.5v3l3-1.5z" fill="currentColor" stroke="none" />
    <path d="M8 21h8" />
  </svg>
);

type LinkConfig = {
  key: keyof ProjectLinks;
  label: string;
  Icon: (p: IconProps) => JSX.Element;
};

const LINKS: LinkConfig[] = [
  { key: "visit", label: "Visit", Icon: VisitIcon },
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "liveDemo", label: "Live demo", Icon: LiveIcon },
];

/**
 * Renders a button for each link that's actually present on a project — any
 * one, two, or all three of Visit / GitHub / Live demo. Empty/missing links
 * are skipped, so a project shows only the buttons it has.
 */
export function ProjectButtons({
  links,
  size = "sm",
}: {
  links: ProjectLinks;
  size?: "sm" | "md";
}) {
  const available = LINKS.filter(
    ({ key }) => links[key] && links[key]!.trim() !== ""
  );
  if (available.length === 0) return null;

  const pad = size === "md" ? "px-4 py-2.5 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <div className="flex flex-wrap gap-2">
      {available.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt font-semibold text-text transition-colors hover:border-accent hover:text-accent ${pad}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </a>
      ))}
    </div>
  );
}
