"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Theme,
  ThemeTokens,
  defaultThemeId,
  getTheme,
  themes,
} from "./themes";

const STORAGE_KEY = "portfolio-theme";

type ThemeContextValue = {
  theme: Theme;
  themes: Theme[];
  setThemeId: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Maps a token key (e.g. `surfaceAlt`) to its CSS variable name. */
const tokenToCssVar = (key: keyof ThemeTokens): string =>
  "--color-" + key.replace(/([A-Z])/g, "-$1").toLowerCase();

/** Writes a theme's tokens onto the <html> element as CSS variables. */
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  (Object.keys(theme.tokens) as (keyof ThemeTokens)[]).forEach((key) => {
    root.style.setProperty(tokenToCssVar(key), theme.tokens[key]);
  });
  root.dataset.theme = theme.id;
  root.style.colorScheme = theme.isDark ? "dark" : "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(defaultThemeId);

  // Load any previously saved theme on mount.
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (saved && themes.some((t) => t.id === saved)) {
      setThemeIdState(saved);
    }
  }, []);

  // Apply the theme whenever it changes.
  useEffect(() => {
    applyTheme(getTheme(themeId));
  }, [themeId]);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: getTheme(themeId), themes, setThemeId }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
