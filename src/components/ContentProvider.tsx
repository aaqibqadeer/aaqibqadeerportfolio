"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/data/data";

/**
 * Makes the (DB-backed) site content available to client components via
 * `useContent()`. The root layout fetches the content on the server and passes
 * it in here, so client and server render from the same source.
 */
const ContentContext = createContext<SiteData | null>(null);

export function ContentProvider({
  content,
  children,
}: {
  content: SiteData;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteData {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return ctx;
}
