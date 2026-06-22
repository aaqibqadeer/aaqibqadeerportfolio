# Aaqib Qadeer — Portfolio

A personal portfolio website built with **Next.js (App Router)**, **TypeScript**,
and **Tailwind CSS**. Styling is inspired by the warm, friendly look of
[aliabdaal.com](https://aliabdaal.com).

## Pages

1. **Home** (`/`) — photo with a fun animated blob frame, short intro, contact
   email and social links. Fully built.
2. **About** (`/about`) — placeholder for now.
3. **Portfolio** (`/portfolio`) — placeholder for now.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where to edit things

| What | File |
| --- | --- |
| **All site content / copy** (name, intro, socials, email, nav) | `src/data/data.ts` |
| **Themes** (colors, add/remove/edit) | `src/themes/themes.ts` |
| **Your photo** | drop an image in `public/` and update `home.photo.src` in `data.ts` |

> No copy is hard-coded in components — everything renders from `data.ts`.

## Themes

Three themes ship out of the box and a visitor can switch between them using the
swatches in the navbar (the choice is remembered via `localStorage`):

1. **Hey Friends** — an exact match of the Ali Abdaal reference styling
   (warm cream, coral CTA, teal accent, sunny yellow photo blob).
2. **Midnight** — a custom dark mode (deep slate, indigo CTA, cyan accent).
3. **Pop** — a custom bold & colorful look (lavender, hot-pink CTA, electric blue).

### How theming works

Each theme in `src/themes/themes.ts` is a set of color tokens. The
`ThemeProvider` writes those tokens to CSS variables on `<html>`, and Tailwind
classes (`bg-bg`, `text-text`, `bg-primary`, `bg-frame`, …) resolve to the
active theme. To add a theme, copy a block in `themes.ts`, give it a new `id`,
and it appears in the switcher automatically.

## Socials

Social links live in `data.socials`. Every link is optional — remove an entry
or set its `href` to an empty string and it won't render. Supported ids include
`linkedin`, `github`, `medium`, `upwork`, `twitter`, `instagram`, `youtube`,
`dribbble`, and `website`.
