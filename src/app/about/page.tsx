import { Navbar } from "@/components/Navbar";

/**
 * About page — intentionally left empty for now.
 * Content will live in data.ts when this page is built out.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="font-display text-4xl font-semibold">About</h1>
        <p className="mt-4 text-text-muted">Coming soon.</p>
      </section>
    </main>
  );
}
