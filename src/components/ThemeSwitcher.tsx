"use client";

import { useTheme } from "@/themes/ThemeProvider";

/** Compact row of theme swatches that lets the visitor switch themes. */
export function ThemeSwitcher() {
  const { theme, themes, setThemeId } = useTheme();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Theme">
      {themes.map((t) => {
        const active = t.id === theme.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setThemeId(t.id)}
            title={t.name}
            aria-label={`Switch to ${t.name} theme`}
            aria-pressed={active}
            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
              active ? "border-text scale-110" : "border-border"
            }`}
            style={{ backgroundColor: t.swatch }}
          />
        );
      })}
    </div>
  );
}
