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
  about: AboutContent;
  portfolio: PortfolioContent;
};

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

export type AboutSlide = {
  /** Stable id, also used as the scroll anchor. */
  id: string;
  /** Small label above the title, e.g. a year or chapter. Optional. */
  kicker?: string;
  title: string;
  /** One milestone / story. Supports multiple paragraphs via `\n\n`. */
  body: string;
  image: {
    src: string;
    alt: string;
  };
};

export type AboutContent = {
  /** Heading shown on the very first (intro) slide. */
  heading: string;
  /** Supporting line under the intro heading. */
  subheading: string;
  slides: AboutSlide[];
};

/* ------------------------------------------------------------------ */
/* Portfolio                                                           */
/* ------------------------------------------------------------------ */

/**
 * Project action links. Every field is optional — a button only renders for
 * the links you actually fill in (any one or two — or all three — of
 * Visit, GitHub, Live demo).
 */
export type ProjectLinks = {
  visit?: string;
  github?: string;
  liveDemo?: string;
};

export type ProjectDetailSection = {
  heading: string;
  body: string;
};

export type Project = {
  /** URL-safe id used for /portfolio/[slug]. */
  slug: string;
  title: string;
  /** Short one-liner shown on the gallery card. */
  description: string;
  thumbnail: {
    src: string;
    alt: string;
  };
  /** Single category used by the category filter. */
  category: string;
  /** Free-form tags used by the tag filter + search. */
  tags: string[];
  links: ProjectLinks;
  /** Longer content for the project's detail page. */
  detail: {
    /** Optional larger cover image; falls back to the thumbnail. */
    cover?: {
      src: string;
      alt: string;
    };
    overview: string;
    sections?: ProjectDetailSection[];
  };
};

export type PortfolioContent = {
  heading: string;
  subheading: string;
  projects: Project[];
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

  about: {
    heading: "My story so far",
    subheading: "Scroll through a few moments that shaped how I build.",
    slides: [
      {
        id: "curiosity",
        kicker: "Where it started",
        title: "A kid who took things apart",
        body: "Long before I wrote a line of code, I was the one prying open remote controls and old PCs just to see how they worked. That itch — to understand the machine behind the magic — never really went away.",
        image: {
          src: "/about/slide-1.svg",
          alt: "Illustration of curiosity and exploration",
        },
      },
      {
        id: "first-code",
        kicker: "First lines of code",
        title: "Hello, world — and hooked",
        body: "My first program was a clumsy little script that barely ran. But watching the computer do exactly what I told it to felt like a superpower. I spent nights learning, breaking things, and fixing them again.",
        image: {
          src: "/about/slide-2.svg",
          alt: "Illustration of writing first code",
        },
      },
      {
        id: "going-pro",
        kicker: "Going professional",
        title: "From hobby to craft",
        body: "Freelance projects turned into real clients, and real clients turned into real responsibility. I learned that great software isn't just clever code — it's communication, reliability, and caring about the people who use it.",
        image: {
          src: "/about/slide-3.svg",
          alt: "Illustration of professional growth",
        },
      },
      {
        id: "building",
        kicker: "Building products",
        title: "Shipping things that matter",
        body: "I found my favourite place to be: the full stack. From pixel-perfect interfaces to the systems behind them, I love taking a rough idea and shaping it into something fast, clean, and genuinely useful.",
        image: {
          src: "/about/slide-4.svg",
          alt: "Illustration of building products",
        },
      },
      {
        id: "today",
        kicker: "Today & what's next",
        title: "Still learning, always building",
        body: "These days I focus on building delightful web experiences and helping teams ship with confidence. The tools keep changing, but the goal stays the same — make something people are glad exists.",
        image: {
          src: "/about/slide-5.svg",
          alt: "Illustration of looking ahead",
        },
      },
    ],
  },

  portfolio: {
    heading: "Selected work",
    subheading: "A few projects I've designed, built, or shipped.",
    projects: [
      {
        slug: "personal-portfolio",
        title: "Personal Portfolio",
        description:
          "This very site — a themeable portfolio with a mobile-first homepage.",
        thumbnail: {
          src: "/projects/portfolio.svg",
          alt: "Personal portfolio website thumbnail",
        },
        category: "Web",
        tags: ["Next.js", "TypeScript", "Tailwind"],
        links: {
          github: "https://github.com/aaqibqadeer/aaqibqadeerportfolio",
          liveDemo: "https://aaqibqadeer.dev",
        },
        detail: {
          overview:
            "A fast, themeable personal portfolio built with the Next.js App Router. Content is fully data-driven and the site ships with three switchable themes.",
          sections: [
            {
              heading: "The idea",
              body: "I wanted a portfolio I could update by editing a single data file, with a warm, friendly look inspired by aliabdaal.com.",
            },
            {
              heading: "How it's built",
              body: "Next.js + TypeScript + Tailwind, with a CSS-variable theming system so new themes are just a block of color tokens.",
            },
          ],
        },
      },
      {
        slug: "task-manager",
        title: "Flow — Task Manager",
        description:
          "A keyboard-first task manager with projects, labels, and quick add.",
        thumbnail: {
          src: "/projects/taskmanager.svg",
          alt: "Task manager app thumbnail",
        },
        category: "Web App",
        tags: ["React", "Node.js", "PostgreSQL"],
        links: {
          visit: "https://example.com/flow",
          github: "https://github.com/aaqibqadeer/flow",
        },
        detail: {
          overview:
            "Flow is a productivity app focused on speed. Everything is reachable from the keyboard, and tasks sync instantly across devices.",
          sections: [
            {
              heading: "Challenge",
              body: "Most task apps are slow and cluttered. The goal was sub-100ms interactions and a UI that gets out of your way.",
            },
          ],
        },
      },
      {
        slug: "storefront",
        title: "Maker Storefront",
        description:
          "A headless e-commerce storefront with Stripe checkout.",
        thumbnail: {
          src: "/projects/storefront.svg",
          alt: "E-commerce storefront thumbnail",
        },
        category: "Web",
        tags: ["Next.js", "Stripe", "Commerce"],
        links: {
          visit: "https://example.com/store",
          liveDemo: "https://demo.example.com/store",
        },
        detail: {
          overview:
            "A modern storefront for independent makers, with a headless CMS for products and Stripe-powered checkout.",
        },
      },
      {
        slug: "weather-cli",
        title: "skycast",
        description: "A tiny, fast weather CLI for your terminal.",
        thumbnail: {
          src: "/projects/cli.svg",
          alt: "Weather CLI thumbnail",
        },
        category: "Tooling",
        tags: ["Go", "CLI", "Open Source"],
        links: {
          github: "https://github.com/aaqibqadeer/skycast",
        },
        detail: {
          overview:
            "skycast prints a clean, colorful weather forecast right in your terminal. Written in Go for a single, dependency-free binary.",
        },
      },
      {
        slug: "design-system",
        title: "Atlas Design System",
        description:
          "A component library and design tokens used across products.",
        thumbnail: {
          src: "/projects/designsystem.svg",
          alt: "Design system thumbnail",
        },
        category: "Design",
        tags: ["Figma", "React", "Storybook"],
        links: {
          visit: "https://example.com/atlas",
          github: "https://github.com/aaqibqadeer/atlas",
          liveDemo: "https://atlas.example.com",
        },
        detail: {
          overview:
            "Atlas is a shared design language: Figma libraries, design tokens, and a documented React component library that keeps teams consistent.",
        },
      },
      {
        slug: "fitness-tracker",
        title: "Stride Fitness",
        description:
          "A mobile fitness tracker with workouts, streaks, and charts.",
        thumbnail: {
          src: "/projects/fitness.svg",
          alt: "Fitness tracker app thumbnail",
        },
        category: "Mobile",
        tags: ["React Native", "Expo", "Health"],
        links: {
          liveDemo: "https://example.com/stride",
        },
        detail: {
          overview:
            "Stride helps people build consistent workout habits with streaks, friendly nudges, and clear progress charts.",
        },
      },
    ],
  },
};
