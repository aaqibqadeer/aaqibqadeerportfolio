import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

// Content comes from the database at request time.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col md:min-h-screen md:block">
      <Navbar />
      <Hero />
    </main>
  );
}
