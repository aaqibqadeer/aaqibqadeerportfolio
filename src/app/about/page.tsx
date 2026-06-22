import { AboutSlides } from "@/components/AboutSlides";
import { data } from "@/data/data";

export const metadata = {
  title: `About — ${data.brand}`,
};

export default function AboutPage() {
  return (
    <main>
      <AboutSlides />
    </main>
  );
}
