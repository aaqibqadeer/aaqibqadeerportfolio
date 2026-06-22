import { AboutSlides } from "@/components/AboutSlides";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main>
      <AboutSlides />
    </main>
  );
}
