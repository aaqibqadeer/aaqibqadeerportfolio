"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { data, type Project } from "@/data/data";
import { ProjectButtons } from "./ProjectButtons";

/**
 * Portfolio gallery with search + category/tag filtering.
 *
 * All filter state lives in the URL query string (`q`, `category`, `tags`),
 * so filters are shareable and survive refresh / back-forward navigation.
 */
export function PortfolioBoard() {
  const projects = data.portfolio.projects;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derived filter options.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))).sort(),
    [projects]
  );

  // Current filter values (URL is the source of truth).
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "All";
  const activeTags = (searchParams.get("tags") ?? "")
    .split(",")
    .filter(Boolean);

  const hasFilters = q !== "" || category !== "All" || activeTags.length > 0;

  /** Update the URL query string (omitting empty / default values). */
  const setParams = (updates: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      const isEmpty =
        value === "" ||
        value === "All" ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) params.delete(key);
      else params.set(key, Array.isArray(value) ? value.join(",") : value);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleTag = (tag: string) => {
    const next = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    setParams({ tags: next });
  };

  // Apply filters.
  const filtered = projects.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (activeTags.length > 0 && !activeTags.some((t) => p.tags.includes(t)))
      return false;
    if (q.trim() !== "") {
      const haystack = [p.title, p.description, p.category, ...p.tags]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q.toLowerCase().trim())) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-5">
        <input
          type="search"
          value={q}
          onChange={(e) => setParams({ q: e.target.value })}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="w-full rounded-full border border-border bg-surface-alt px-5 py-3 text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setParams({ category: cat })}
              aria-pressed={category === cat}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "border-primary bg-primary text-primary-text"
                  : "border-border bg-surface-alt text-text-muted hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => {
            const on = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={on}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  on
                    ? "bg-accent text-white"
                    : "bg-surface text-text-muted hover:text-text"
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams({ q: "", category: "All", tags: [] })}
              className="ml-1 text-xs font-semibold text-text-muted underline hover:text-text"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <p className="mt-8 text-sm text-text-muted">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-4xl border border-border bg-surface-alt p-12 text-center text-text-muted">
          No projects match your filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-4xl border border-border bg-surface-alt transition-shadow hover:shadow-lg">
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block"
        aria-label={`Open ${project.title}`}
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-text-muted">
            {project.category}
          </span>
        </div>

        <Link href={`/portfolio/${project.slug}`}>
          <h3 className="font-display text-xl font-semibold leading-snug hover:text-accent">
            {project.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-text-muted">{project.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs text-text-muted">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <ProjectButtons links={project.links} />
        </div>
      </div>
    </article>
  );
}
