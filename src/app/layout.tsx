import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { themes, defaultThemeId } from "@/themes/themes";
import { ThemeProvider } from "@/themes/ThemeProvider";
import { ContentProvider } from "@/components/ContentProvider";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getSiteData } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  return {
    // Home page uses just the brand; other pages render "<Page> — Brand".
    title: {
      default: data.brand,
      template: `%s — ${data.brand}`,
    },
    description: data.meta.description,
  };
}

/**
 * Blocking script that applies a previously-saved theme before first paint to
 * avoid a flash of the default theme. Theme tokens are serialized from the
 * single source of truth in themes.ts.
 */
const noFlashScript = `
(function() {
  try {
    var themes = ${JSON.stringify(
      Object.fromEntries(themes.map((t) => [t.id, t.tokens]))
    )};
    var saved = localStorage.getItem('portfolio-theme');
    var id = (saved && themes[saved]) ? saved : '${defaultThemeId}';
    var tokens = themes[id];
    var root = document.documentElement;
    for (var key in tokens) {
      var cssVar = '--color-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(cssVar, tokens[key]);
    }
    root.dataset.theme = id;
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteData();

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="font-sans">
        <ContentProvider content={content}>
          <ThemeProvider>{children}</ThemeProvider>
        </ContentProvider>
        <AnalyticsTracker />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
