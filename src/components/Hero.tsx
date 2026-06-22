"use client";

import Image from "next/image";
import { useContent } from "./ContentProvider";
import { useTheme } from "@/themes/ThemeProvider";
import { Socials } from "./Socials";
import { icons } from "./Icons";
import { MobileActions } from "./MobileActions";

/** The photo + its frame, whose style changes per theme. */
function PhotoFrame({
  src,
  alt,
  frameStyle,
}: {
  src: string;
  alt: string;
  frameStyle: "blob" | "ring" | "gradient";
}) {
  return (
    <div className="relative h-48 w-48 sm:h-72 sm:w-72 md:h-80 md:w-80">
      {frameStyle === "blob" && (
        <div
          className="absolute inset-0 animate-[spin_28s_linear_infinite] bg-frame"
          style={{ borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%" }}
          aria-hidden
        />
      )}

      {frameStyle === "gradient" && (
        <div
          className="absolute inset-0 animate-[spin_28s_linear_infinite]"
          style={{
            borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%",
            background:
              "linear-gradient(135deg, var(--color-frame), var(--color-primary))",
          }}
          aria-hidden
        />
      )}

      {frameStyle === "ring" && (
        <>
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ backgroundColor: "var(--color-frame)", opacity: 0.45 }}
            aria-hidden
          />
          <div
            className="absolute inset-1 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, var(--color-frame), var(--color-accent), var(--color-frame))",
            }}
            aria-hidden
          />
        </>
      )}

      <div
        className={`absolute overflow-hidden rounded-full ${
          frameStyle === "ring" ? "inset-[10px]" : "inset-3"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 640px) 12rem, 20rem"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/** Homepage hero: theme-framed photo, intro copy, and a contact card. */
export function Hero() {
  const data = useContent();
  const { theme } = useTheme();
  const { home } = data;
  const Email = icons.email;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-6 md:flex-none md:pb-16">
      <div className="rounded-4xl bg-surface px-6 py-8 sm:px-12 sm:py-16">
        {/* Top: photo + intro */}
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
          {/* Photo with a theme-specific frame */}
          <div className="flex justify-center md:justify-start">
            <PhotoFrame
              src={home.photo.src}
              alt={home.photo.alt}
              frameStyle={theme.frameStyle}
            />
          </div>

          {/* Intro copy */}
          <div className="text-center md:text-left">
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              <span className="accent-underline">{home.greeting}</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text sm:text-xl md:mt-6 md:text-2xl">
              <span className="font-semibold">{home.headline}</span>{" "}
              {home.intro}
            </p>

            {/* Mobile-only action buttons + contact sheet */}
            <MobileActions />
          </div>
        </div>

        {/* Bottom: contact / socials card — desktop only */}
        <div className="mt-12 hidden gap-8 rounded-4xl bg-surface-alt p-8 sm:p-10 md:grid md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {home.contactHeading}
            </h2>
            <p className="mt-4 max-w-md text-text-muted">{home.contactBlurb}</p>
          </div>

          <div className="flex flex-col justify-center gap-6">
            {home.email && (
              <a
                href={`mailto:${home.email}`}
                className="inline-flex items-center gap-3 text-lg font-medium text-text transition-colors hover:text-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-text">
                  <Email className="h-5 w-5" />
                </span>
                {home.email}
              </a>
            )}
            <Socials />
          </div>
        </div>
      </div>
    </section>
  );
}
