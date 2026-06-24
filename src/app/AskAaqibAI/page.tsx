import { AaqibChat } from "@/components/AaqibChat";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AaqibAI",
};

export default function AskAaqibAIPage() {
  return (
    <main>
      <AaqibChat />
    </main>
  );
}
