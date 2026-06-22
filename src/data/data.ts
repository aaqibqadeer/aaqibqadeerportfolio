/**
 * SITE CONTENT
 * ------------
 * Everything textual / configurable about the site lives here so that no copy
 * is hard-coded inside components. Edit this file to update the site.
 *
 * Social links are all optional — delete a line or set `href` to an empty
 * string / remove the object entirely and it simply won't render.
 */

export type SocialLink = {
  /** Stable identifier, also used to pick the icon. */
  id:
    | "linkedin"
    | "github"
    | "medium"
    | "upwork"
    | "twitter"
    | "instagram"
    | "youtube"
    | "dribbble"
    | "website";
  label: string;
  href: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type SiteData = {
  /** Brand / logo text shown in the navbar. */
  brand: string;
  /** Used for the browser tab + SEO. */
  meta: {
    title: string;
    description: string;
  };
  nav: NavLink[];
  /** Primary navbar call-to-action button. Optional. */
  navCta?: {
    label: string;
    href: string;
  };
  home: {
    /** Small kicker line above the greeting, e.g. an emoji wave. Optional. */
    greeting: string;
    /** Large display headline. */
    headline: string;
    /** Short about-me paragraph. */
    intro: string;
    photo: {
      src: string;
      alt: string;
    };
    /** Contact email shown on the homepage. Optional. */
    email?: string;
    /** Heading for the contact / socials card. */
    contactHeading: string;
    /** Supporting copy under the contact heading. */
    contactBlurb: string;
  };
  socials: SocialLink[];
  /** Footer copy. `{year}` is replaced with the current year. */
  footer: string;
};

export const data: SiteData = {
  brand: "Aaqib Qadeer",
  meta: {
    title: "Aaqib Qadeer — Portfolio",
    description:
      "Personal portfolio of Aaqib Qadeer — software engineer, builder, and lifelong learner.",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  navCta: {
    label: "Get in touch",
    href: "mailto:webninjallc@gmail.com",
  },
  home: {
    greeting: "Hey there 👋",
    headline: "I’m Aaqib.",
    intro:
      "I’m a software engineer who loves turning ideas into clean, fast, and friendly products. I work across the stack — from pixel-perfect interfaces to the systems behind them — and I care deeply about craft, clarity, and shipping things that actually help people.",
    photo: {
      // Replace with your own photo (drop it in /public and update this path).
      src: "/profile.svg",
      alt: "Portrait of Aaqib Qadeer",
    },
    email: "webninjallc@gmail.com",
    contactHeading: "Let’s build something",
    contactBlurb:
      "Whether you have a project in mind, a role to fill, or just want to say hi — my inbox is always open. I’ll do my best to get back to you.",
  },
  socials: [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aaqibqadeer",
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/aaqibqadeer",
    },
    {
      id: "medium",
      label: "Medium",
      href: "https://medium.com/@aaqibqadeer",
    },
    {
      id: "upwork",
      label: "Upwork",
      href: "https://www.upwork.com/freelancers/aaqibqadeer",
    },
  ],
  footer: "© {year} Aaqib Qadeer. Built with Next.js.",
};
