import { AdminEditor } from "@/components/admin/AdminEditor";
import { getSiteData } from "@/lib/content";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getSiteData();
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <AdminEditor initial={content} dbConfigured={isDbConfigured} />
    </main>
  );
}
