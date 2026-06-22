import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { PortfolioBoard } from "@/components/PortfolioBoard";
import { data } from "@/data/data";

export const metadata = {
  title: `Portfolio — ${data.brand}`,
};

export default function PortfolioPage() {
  const { portfolio } = data;
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            {portfolio.heading}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{portfolio.subheading}</p>
        </header>

        <Suspense fallback={null}>
          <PortfolioBoard />
        </Suspense>
      </section>
    </main>
  );
}
