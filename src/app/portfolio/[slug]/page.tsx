import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProjectButtons } from "@/components/ProjectButtons";
import { getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { portfolio } = await getSiteData();
  const project = portfolio.projects.find((p) => p.slug === params.slug);
  return { title: project ? project.title : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { portfolio } = await getSiteData();
  const project = portfolio.projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const cover = project.detail.cover ?? project.thumbnail;

  return (
    <main className="min-h-screen">
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/portfolio"
          className="text-sm font-medium text-text-muted hover:text-text"
        >
          ← Back to portfolio
        </Link>

        <header className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-text-muted">
              {project.category}
            </span>
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs text-text-muted">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{project.description}</p>
          <div className="mt-5">
            <ProjectButtons links={project.links} size="md" />
          </div>
        </header>

        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-4xl border border-border">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-8 space-y-8">
          <p className="text-lg leading-relaxed text-text">
            {project.detail.overview}
          </p>

          {project.detail.sections?.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-text-muted">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
