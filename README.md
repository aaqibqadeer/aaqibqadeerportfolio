# Aaqib Qadeer — Portfolio

A personal portfolio website built with **Next.js (App Router)**, **TypeScript**,
and **Tailwind CSS**.

## Pages

1. **Home** (`/`) — photo with a fun animated blob frame, short intro, contact
   email and social links. Fully built.
2. **About** (`/about`) — placeholder for now.
3. **Portfolio** (`/portfolio`) — placeholder for now.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI and ADMIN_PASSWORD
npm run dev
```

Then open http://localhost:3000.

Environment variables (see `.env.example`):

- `MONGODB_URI` — MongoDB Atlas connection string. When unset, the site runs
  read-only from the built-in defaults in `data.ts`.
- `ADMIN_PASSWORD` — password for the `/admin` panel. When unset, admin is off.
- `ADMIN_SECRET` — optional secret used to sign the admin session cookie.

## Where to edit things

| What | Where |
| --- | --- |
| **All site content / copy** (name, intro, socials, about slides, projects) | the **/admin** panel (saved to MongoDB) |
| **Default / seed content** (used when no DB is set) | `src/data/data.ts` |
| **Themes** (colors, frame style, add/remove/edit) | `src/themes/themes.ts` |
| **Your photo** | upload anywhere and paste the URL in /admin, or drop a file in `public/` and set `home.photo.src` |

> No copy is hard-coded in components — everything renders from the content store
> (MongoDB), falling back to the defaults in `data.ts`.

## Admin panel & content (MongoDB)

Content is stored in MongoDB and edited through a built-in admin panel:

- Visit **`/admin`** and log in with `ADMIN_PASSWORD`.
- Edit everything — homepage, socials, about slides, and projects (full CRUD,
  including per-project Visit / GitHub / Live demo links, tags, category, and
  detail sections) — then **Save**.
- `data.ts` is the **seed + fallback**: on first read an empty database is
  seeded with it, and if `MONGODB_URI` is missing the site still renders from it
  (the admin panel is then read-only).

Content pages render dynamically, so saved changes appear on the next request.

## Themes

Three themes ship out of the box and a visitor can switch between them using the
swatches in the navbar (the choice is remembered via `localStorage`):

1. **Hey Friends** — an exact match of the Ali Abdaal reference styling
   (warm cream, coral CTA, teal accent, sunny yellow photo **blob**).
2. **Midnight** — a custom dark mode (deep slate, indigo CTA, cyan accent) with
   a glowing **ring** photo frame.
3. **Pop** — a custom bold & colorful look (lavender, hot-pink CTA, electric
   blue) with a vivid **gradient** photo frame.

The homepage photo frame style changes with the theme (`frameStyle` in each
theme: `blob` / `ring` / `gradient`).

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
