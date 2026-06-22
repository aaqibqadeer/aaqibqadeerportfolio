/**
 * THEME DEFINITIONS
 * -----------------
 * This is the single place to edit, add, or remove themes.
 *
 * Each theme is just a set of color tokens. The ThemeProvider takes the
 * active theme and writes these tokens to CSS variables on the <html> element
 * (e.g. `--color-bg`). Tailwind classes like `bg-bg`, `text-text`,
 * `bg-primary` then resolve to whatever the active theme defines.
 *
 * To tweak a theme: change the hex values below.
 * To add a theme: copy a block, give it a new `id`, and it will automatically
 * show up in the theme switcher.
 *
 * Token reference:
 *   bg           - page background
 *   surface      - main hero card / panels
 *   surfaceAlt   - secondary cards (e.g. the contact/socials card)
 *   text         - primary text color
 *   textMuted    - secondary / subdued text
 *   primary      - call-to-action button background
 *   primaryText  - text on top of `primary`
 *   accent       - highlights, underlines, links
 *   frame        - the fun blob/frame behind the profile photo
 *   border       - subtle borders / dividers
 */

export type ThemeTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  accent: string;
  frame: string;
  border: string;
};

export type Theme = {
  id: string;
  /** Human-friendly name shown in the theme switcher */
  name: string;
  /** Small dot color used to preview the theme in the switcher */
  swatch: string;
  /** Whether this theme is dark (affects a couple of subtle UI choices) */
  isDark: boolean;
  /**
   * Visual style of the photo frame on the homepage. Each theme gets a
   * distinct look:
   *   blob     - playful rotating organic blob (Hey Friends)
   *   ring     - glowing circular ring (Midnight)
   *   gradient - vivid gradient blob (Pop)
   */
  frameStyle: "blob" | "ring" | "gradient";
  tokens: ThemeTokens;
};

/**
 * THEME 1 — "Hey Friends" (an exact match of the Ali Abdaal reference styling).
 * Warm cream background, near-black serif headings, coral CTA, teal accent and
 * a sunny yellow blob behind the photo.
 */
const heyFriends: Theme = {
  id: "hey-friends",
  name: "Hey Friends",
  swatch: "#F4A52A",
  isDark: false,
  frameStyle: "blob",
  tokens: {
    bg: "#FBF4EA",
    surface: "#F7EEE1",
    surfaceAlt: "#FFFFFF",
    text: "#1B1B1B",
    textMuted: "#6B6256",
    primary: "#F5A623",
    primaryText: "#1B1B1B",
    accent: "#38B6C4",
    frame: "#FBC54E",
    border: "#EADFCF",
  },
};

/**
 * THEME 2 — "Midnight" (custom dark mode).
 * Deep slate background, soft light text, an indigo CTA and cyan accents.
 */
const midnight: Theme = {
  id: "midnight",
  name: "Midnight",
  swatch: "#818CF8",
  isDark: true,
  frameStyle: "ring",
  tokens: {
    bg: "#0E1015",
    surface: "#171A21",
    surfaceAlt: "#1F232C",
    text: "#F4F5F7",
    textMuted: "#9AA2B1",
    primary: "#818CF8",
    primaryText: "#0E1015",
    accent: "#22D3EE",
    frame: "#6366F1",
    border: "#2A2F3A",
  },
};

/**
 * THEME 3 — "Pop" (custom bold & colorful).
 * Bright lavender background, ink-dark text, a hot-pink CTA and electric-blue
 * accent with a vivid magenta blob.
 */
const pop: Theme = {
  id: "pop",
  name: "Pop",
  swatch: "#EC4899",
  isDark: false,
  frameStyle: "gradient",
  tokens: {
    bg: "#F3E8FF",
    surface: "#FDF2FF",
    surfaceAlt: "#FFFFFF",
    text: "#1E1033",
    textMuted: "#6B5B8A",
    primary: "#EC4899",
    primaryText: "#FFFFFF",
    accent: "#2563EB",
    frame: "#D946EF",
    border: "#E9D5FF",
  },
};

/** All available themes, in display order. */
export const themes: Theme[] = [heyFriends, midnight, pop];

/** The theme used on first load / before a user picks one. */
export const defaultThemeId = heyFriends.id;

export const getTheme = (id: string): Theme =>
  themes.find((t) => t.id === id) ?? themes[0];
