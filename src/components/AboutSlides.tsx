"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { data } from "@/data/data";

/**
 * Full-screen, scroll-snapping About experience.
 *
 * The first panel is an intro; each following panel is one milestone / story
 * with a photo and text. A fixed header and a set of progress dots let the
 * visitor orient themselves and jump between panels.
 */
export function AboutSlides() {
  const { about } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // intro panel + one panel per slide
  const total = about.slides.length + 1;

  // Track which panel is currently in view.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActive(idx);
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (idx: number) => {
    panelRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Fixed overlay header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="pointer-events-auto font-display text-xl font-semibold tracking-tight text-text"
          >
            {data.brand}
          </Link>
          <nav className="pointer-events-auto flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="text-text-muted hover:text-text">
              Home
            </Link>
            <Link href="/portfolio" className="text-text-muted hover:text-text">
              Portfolio
            </Link>
          </nav>
        </div>
      </header>

      {/* Progress dots */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to panel ${i + 1}`}
            aria-current={active === i}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full border border-text/30 transition-all ${
              active === i ? "scale-125 bg-primary" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      {/* Scroll-snap container */}
      <div
        ref={containerRef}
        className="h-[100dvh] snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      >
        {/* Intro panel */}
        <section
          data-index={0}
          ref={(el) => {
            panelRefs.current[0] = el;
          }}
          className="flex h-[100dvh] snap-start items-center justify-center bg-surface px-6"
        >
          <div className="max-w-2xl text-center">
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">
              <span className="accent-underline">{about.heading}</span>
            </h1>
            <p className="mt-6 text-lg text-text-muted sm:text-xl">
              {about.subheading}
            </p>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="mt-10 inline-flex animate-bounce items-center gap-2 text-sm font-medium text-text-muted hover:text-text"
            >
              Scroll
              <span aria-hidden>↓</span>
            </button>
          </div>
        </section>

        {/* Story panels */}
        {about.slides.map((slide, i) => {
          const index = i + 1;
          const flip = i % 2 === 1; // alternate image side on desktop
          return (
            <section
              key={slide.id}
              id={slide.id}
              data-index={index}
              ref={(el) => {
                panelRefs.current[index] = el;
              }}
              className="flex h-[100dvh] snap-start items-center bg-bg px-6 pt-16"
            >
              <div
                className={`mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  flip ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Photo */}
                <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-4xl shadow-lg">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-cover"
                  />
                </div>

                {/* Text */}
                <div>
                  {slide.kicker && (
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                      {slide.kicker}
                    </p>
                  )}
                  <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                    {slide.title}
                  </h2>
                  {slide.body.split("\n\n").map((para, p) => (
                    <p
                      key={p}
                      className="mt-5 text-lg leading-relaxed text-text-muted"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
