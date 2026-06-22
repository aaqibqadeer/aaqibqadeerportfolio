import Image from "next/image";
import { data } from "@/data/data";
import { Socials } from "./Socials";
import { icons } from "./Icons";

/** Homepage hero: blob-framed photo, intro copy, and a contact card. */
export function Hero() {
  const { home } = data;
  const Email = icons.email;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-4xl bg-surface px-6 py-12 sm:px-12 sm:py-16">
        {/* Top: photo + intro */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Photo with a fun blob frame */}
          <div className="flex justify-center md:justify-start">
            <div className="relative h-72 w-72 sm:h-80 sm:w-80">
              {/* The playful blob behind the photo */}
              <div
                className="absolute inset-0 animate-[spin_28s_linear_infinite] bg-frame"
                style={{
                  borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%",
                }}
                aria-hidden
              />
              <div className="absolute inset-3 overflow-hidden rounded-full">
                <Image
                  src={home.photo.src}
                  alt={home.photo.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 18rem, 20rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Intro copy */}
          <div>
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">
              <span className="accent-underline">{home.greeting}</span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-text sm:text-2xl">
              <span className="font-semibold">{home.headline}</span>{" "}
              {home.intro}
            </p>
          </div>
        </div>

        {/* Bottom: contact / socials card */}
        <div className="mt-12 grid gap-8 rounded-4xl bg-surface-alt p-8 sm:p-10 md:grid-cols-2">
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
