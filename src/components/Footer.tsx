import { data } from "@/data/data";

/** Site footer with dynamic year substitution from data.ts. */
export function Footer() {
  const text = data.footer.replace("{year}", String(new Date().getFullYear()));
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-text-muted">
      {text}
    </footer>
  );
}
