"use client";

import { useState } from "react";
import type {
  AboutSlide,
  Project,
  SiteData,
  SocialLink,
} from "@/data/data";

const SOCIAL_IDS: SocialLink["id"][] = [
  "linkedin",
  "github",
  "medium",
  "upwork",
  "twitter",
  "instagram",
  "youtube",
  "dribbble",
  "website",
];

/* ----------------------------- field helpers ----------------------------- */

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  const cls =
    "mt-1 w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text focus:border-accent focus:outline-none";
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ArrayControls({
  onUp,
  onDown,
  onRemove,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  const btn =
    "rounded-md border border-border px-2 py-1 text-xs font-medium text-text-muted hover:text-text";
  return (
    <div className="flex gap-1.5">
      <button type="button" onClick={onUp} className={btn} aria-label="Move up">
        ↑
      </button>
      <button type="button" onClick={onDown} className={btn} aria-label="Move down">
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
      >
        Remove
      </button>
    </div>
  );
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/* -------------------------------- editor --------------------------------- */

export function AdminEditor({
  initial,
  dbConfigured,
}: {
  initial: SiteData;
  dbConfigured: boolean;
}) {
  const [data, setData] = useState<SiteData>(initial);
  const [status, setStatus] = useState<
    { type: "idle" | "saving" | "ok" | "error"; message?: string }
  >({ type: "idle" });

  /* generic patchers */
  const patchSocial = (i: number, fn: (s: SocialLink) => SocialLink) =>
    setData((d) => ({
      ...d,
      socials: d.socials.map((s, idx) => (idx === i ? fn(s) : s)),
    }));
  const patchSlide = (i: number, fn: (s: AboutSlide) => AboutSlide) =>
    setData((d) => ({
      ...d,
      about: {
        ...d.about,
        slides: d.about.slides.map((s, idx) => (idx === i ? fn(s) : s)),
      },
    }));
  const patchProject = (i: number, fn: (p: Project) => Project) =>
    setData((d) => ({
      ...d,
      portfolio: {
        ...d.portfolio,
        projects: d.portfolio.projects.map((p, idx) =>
          idx === i ? fn(p) : p
        ),
      },
    }));

  async function save() {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) setStatus({ type: "ok", message: "Saved." });
      else setStatus({ type: "error", message: body.error ?? "Save failed." });
    } catch {
      setStatus({ type: "error", message: "Network error." });
    }
  }

  return (
    <div className="space-y-6 pb-28">
      {!dbConfigured && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Read-only:</strong> MONGODB_URI is not set, so changes can&apos;t
          be saved. Add your MongoDB connection string to enable editing.
        </div>
      )}

      {/* General */}
      <Section title="General">
        <Field
          label="Brand / name"
          value={data.brand}
          onChange={(v) => setData((d) => ({ ...d, brand: v }))}
        />
        <Field
          label="Meta description"
          textarea
          value={data.meta.description}
          onChange={(v) =>
            setData((d) => ({ ...d, meta: { ...d.meta, description: v } }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nav CTA label"
            value={data.navCta?.label ?? ""}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                navCta: { label: v, href: d.navCta?.href ?? "" },
              }))
            }
          />
          <Field
            label="Nav CTA link"
            value={data.navCta?.href ?? ""}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                navCta: { label: d.navCta?.label ?? "", href: v },
              }))
            }
          />
        </div>
      </Section>

      {/* Home */}
      <Section title="Homepage">
        <Field
          label="Greeting"
          value={data.home.greeting}
          onChange={(v) =>
            setData((d) => ({ ...d, home: { ...d.home, greeting: v } }))
          }
        />
        <Field
          label="Headline"
          value={data.home.headline}
          onChange={(v) =>
            setData((d) => ({ ...d, home: { ...d.home, headline: v } }))
          }
        />
        <Field
          label="Intro paragraph"
          textarea
          rows={4}
          value={data.home.intro}
          onChange={(v) =>
            setData((d) => ({ ...d, home: { ...d.home, intro: v } }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Photo URL"
            value={data.home.photo.src}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                home: { ...d.home, photo: { ...d.home.photo, src: v } },
              }))
            }
          />
          <Field
            label="Photo alt text"
            value={data.home.photo.alt}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                home: { ...d.home, photo: { ...d.home.photo, alt: v } },
              }))
            }
          />
        </div>
        <Field
          label="Email"
          value={data.home.email ?? ""}
          onChange={(v) =>
            setData((d) => ({ ...d, home: { ...d.home, email: v } }))
          }
        />
        <Field
          label="Contact heading"
          value={data.home.contactHeading}
          onChange={(v) =>
            setData((d) => ({ ...d, home: { ...d.home, contactHeading: v } }))
          }
        />
        <Field
          label="Contact blurb"
          textarea
          value={data.home.contactBlurb}
          onChange={(v) =>
            setData((d) => ({ ...d, home: { ...d.home, contactBlurb: v } }))
          }
        />
      </Section>

      {/* Socials */}
      <Section title="Social links">
        {data.socials.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface-alt p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Link {i + 1}</span>
              <ArrayControls
                onUp={() =>
                  setData((d) => ({ ...d, socials: move(d.socials, i, -1) }))
                }
                onDown={() =>
                  setData((d) => ({ ...d, socials: move(d.socials, i, 1) }))
                }
                onRemove={() =>
                  setData((d) => ({
                    ...d,
                    socials: d.socials.filter((_, idx) => idx !== i),
                  }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Platform
                </span>
                <select
                  value={s.id}
                  onChange={(e) =>
                    patchSocial(i, (x) => ({
                      ...x,
                      id: e.target.value as SocialLink["id"],
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  {SOCIAL_IDS.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Label"
                value={s.label}
                onChange={(v) => patchSocial(i, (x) => ({ ...x, label: v }))}
              />
              <Field
                label="URL"
                value={s.href}
                onChange={(v) => patchSocial(i, (x) => ({ ...x, href: v }))}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((d) => ({
              ...d,
              socials: [
                ...d.socials,
                { id: "website", label: "", href: "" },
              ],
            }))
          }
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-accent"
        >
          + Add social link
        </button>
      </Section>

      {/* About */}
      <Section title="About — slides">
        <Field
          label="About heading"
          value={data.about.heading}
          onChange={(v) =>
            setData((d) => ({ ...d, about: { ...d.about, heading: v } }))
          }
        />
        <Field
          label="About subheading"
          value={data.about.subheading}
          onChange={(v) =>
            setData((d) => ({ ...d, about: { ...d.about, subheading: v } }))
          }
        />
        {data.about.slides.map((slide, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface-alt p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Slide {i + 1}</span>
              <ArrayControls
                onUp={() =>
                  setData((d) => ({
                    ...d,
                    about: { ...d.about, slides: move(d.about.slides, i, -1) },
                  }))
                }
                onDown={() =>
                  setData((d) => ({
                    ...d,
                    about: { ...d.about, slides: move(d.about.slides, i, 1) },
                  }))
                }
                onRemove={() =>
                  setData((d) => ({
                    ...d,
                    about: {
                      ...d.about,
                      slides: d.about.slides.filter((_, idx) => idx !== i),
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Id (anchor)"
                  value={slide.id}
                  onChange={(v) => patchSlide(i, (x) => ({ ...x, id: v }))}
                />
                <Field
                  label="Kicker"
                  value={slide.kicker ?? ""}
                  onChange={(v) => patchSlide(i, (x) => ({ ...x, kicker: v }))}
                />
              </div>
              <Field
                label="Title"
                value={slide.title}
                onChange={(v) => patchSlide(i, (x) => ({ ...x, title: v }))}
              />
              <Field
                label="Body"
                textarea
                rows={4}
                value={slide.body}
                onChange={(v) => patchSlide(i, (x) => ({ ...x, body: v }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Image URL"
                  value={slide.image.src}
                  onChange={(v) =>
                    patchSlide(i, (x) => ({
                      ...x,
                      image: { ...x.image, src: v },
                    }))
                  }
                />
                <Field
                  label="Image alt"
                  value={slide.image.alt}
                  onChange={(v) =>
                    patchSlide(i, (x) => ({
                      ...x,
                      image: { ...x.image, alt: v },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((d) => ({
              ...d,
              about: {
                ...d.about,
                slides: [
                  ...d.about.slides,
                  {
                    id: `slide-${d.about.slides.length + 1}`,
                    kicker: "",
                    title: "",
                    body: "",
                    image: { src: "", alt: "" },
                  },
                ],
              },
            }))
          }
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-accent"
        >
          + Add slide
        </button>
      </Section>

      {/* Portfolio */}
      <Section title="Portfolio — projects">
        <Field
          label="Portfolio heading"
          value={data.portfolio.heading}
          onChange={(v) =>
            setData((d) => ({
              ...d,
              portfolio: { ...d.portfolio, heading: v },
            }))
          }
        />
        <Field
          label="Portfolio subheading"
          value={data.portfolio.subheading}
          onChange={(v) =>
            setData((d) => ({
              ...d,
              portfolio: { ...d.portfolio, subheading: v },
            }))
          }
        />
        {data.portfolio.projects.map((project, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface-alt p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">
                {project.title || `Project ${i + 1}`}
              </span>
              <ArrayControls
                onUp={() =>
                  setData((d) => ({
                    ...d,
                    portfolio: {
                      ...d.portfolio,
                      projects: move(d.portfolio.projects, i, -1),
                    },
                  }))
                }
                onDown={() =>
                  setData((d) => ({
                    ...d,
                    portfolio: {
                      ...d.portfolio,
                      projects: move(d.portfolio.projects, i, 1),
                    },
                  }))
                }
                onRemove={() =>
                  setData((d) => ({
                    ...d,
                    portfolio: {
                      ...d.portfolio,
                      projects: d.portfolio.projects.filter(
                        (_, idx) => idx !== i
                      ),
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Slug"
                  value={project.slug}
                  onChange={(v) => patchProject(i, (p) => ({ ...p, slug: v }))}
                />
                <Field
                  label="Category"
                  value={project.category}
                  onChange={(v) =>
                    patchProject(i, (p) => ({ ...p, category: v }))
                  }
                />
              </div>
              <Field
                label="Title"
                value={project.title}
                onChange={(v) => patchProject(i, (p) => ({ ...p, title: v }))}
              />
              <Field
                label="Short description"
                textarea
                value={project.description}
                onChange={(v) =>
                  patchProject(i, (p) => ({ ...p, description: v }))
                }
              />
              <Field
                label="Tags (comma separated)"
                value={project.tags.join(", ")}
                onChange={(v) =>
                  patchProject(i, (p) => ({
                    ...p,
                    tags: v
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Thumbnail URL"
                  value={project.thumbnail.src}
                  onChange={(v) =>
                    patchProject(i, (p) => ({
                      ...p,
                      thumbnail: { ...p.thumbnail, src: v },
                    }))
                  }
                />
                <Field
                  label="Thumbnail alt"
                  value={project.thumbnail.alt}
                  onChange={(v) =>
                    patchProject(i, (p) => ({
                      ...p,
                      thumbnail: { ...p.thumbnail, alt: v },
                    }))
                  }
                />
              </div>

              <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Links (leave blank to hide a button)
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  label="Visit"
                  value={project.links.visit ?? ""}
                  onChange={(v) =>
                    patchProject(i, (p) => ({
                      ...p,
                      links: { ...p.links, visit: v || undefined },
                    }))
                  }
                />
                <Field
                  label="GitHub"
                  value={project.links.github ?? ""}
                  onChange={(v) =>
                    patchProject(i, (p) => ({
                      ...p,
                      links: { ...p.links, github: v || undefined },
                    }))
                  }
                />
                <Field
                  label="Live demo"
                  value={project.links.liveDemo ?? ""}
                  onChange={(v) =>
                    patchProject(i, (p) => ({
                      ...p,
                      links: { ...p.links, liveDemo: v || undefined },
                    }))
                  }
                />
              </div>

              <Field
                label="Detail overview"
                textarea
                rows={4}
                value={project.detail.overview}
                onChange={(v) =>
                  patchProject(i, (p) => ({
                    ...p,
                    detail: { ...p.detail, overview: v },
                  }))
                }
              />

              {/* Detail sections */}
              <div className="rounded-lg border border-border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Detail sections
                </p>
                {(project.detail.sections ?? []).map((sec, si) => (
                  <div key={si} className="mb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        Section {si + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          patchProject(i, (p) => ({
                            ...p,
                            detail: {
                              ...p.detail,
                              sections: (p.detail.sections ?? []).filter(
                                (_, x) => x !== si
                              ),
                            },
                          }))
                        }
                        className="text-xs font-medium text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                    <Field
                      label="Heading"
                      value={sec.heading}
                      onChange={(v) =>
                        patchProject(i, (p) => ({
                          ...p,
                          detail: {
                            ...p.detail,
                            sections: (p.detail.sections ?? []).map((x, idx) =>
                              idx === si ? { ...x, heading: v } : x
                            ),
                          },
                        }))
                      }
                    />
                    <Field
                      label="Body"
                      textarea
                      value={sec.body}
                      onChange={(v) =>
                        patchProject(i, (p) => ({
                          ...p,
                          detail: {
                            ...p.detail,
                            sections: (p.detail.sections ?? []).map((x, idx) =>
                              idx === si ? { ...x, body: v } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    patchProject(i, (p) => ({
                      ...p,
                      detail: {
                        ...p.detail,
                        sections: [
                          ...(p.detail.sections ?? []),
                          { heading: "", body: "" },
                        ],
                      },
                    }))
                  }
                  className="text-xs font-semibold text-accent"
                >
                  + Add section
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((d) => ({
              ...d,
              portfolio: {
                ...d.portfolio,
                projects: [
                  ...d.portfolio.projects,
                  {
                    slug: `project-${d.portfolio.projects.length + 1}`,
                    title: "",
                    description: "",
                    thumbnail: { src: "", alt: "" },
                    category: "",
                    tags: [],
                    links: {},
                    detail: { overview: "" },
                  },
                ],
              },
            }))
          }
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-accent"
        >
          + Add project
        </button>
      </Section>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
          <span
            className={`text-sm ${
              status.type === "error"
                ? "text-red-500"
                : status.type === "ok"
                ? "text-green-600"
                : "text-text-muted"
            }`}
          >
            {status.type === "saving"
              ? "Saving…"
              : status.message ?? "Edit content, then save."}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={status.type === "saving" || !dbConfigured}
            className="rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-text transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
