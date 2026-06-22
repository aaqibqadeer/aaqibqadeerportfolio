import { cache } from "react";
import { data as defaultSiteData, type SiteData } from "@/data/data";
import { connectToDatabase, isDbConfigured } from "./db";
import { SITE_CONTENT_KEY, SiteContentModel } from "./models/SiteContent";

/**
 * Content access layer.
 *
 * The database is the source of truth when MONGODB_URI is set. If the DB is not
 * configured, or a read fails, the app gracefully falls back to the static
 * defaults in data.ts so the site always renders.
 */

/** The built-in default content (also used to seed an empty database). */
export const defaultContent: SiteData = defaultSiteData;

/**
 * Read the site content. Cached per-request (React `cache`) so multiple
 * components in one render share a single DB read.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!isDbConfigured) return defaultContent;

  try {
    await connectToDatabase();
    const existing = await SiteContentModel.findOne({
      key: SITE_CONTENT_KEY,
    }).lean();

    if (existing?.data) {
      // Merge over defaults so newly-added fields are never missing.
      return { ...defaultContent, ...(existing.data as SiteData) };
    }

    // Seed the database with defaults on first run.
    await SiteContentModel.create({
      key: SITE_CONTENT_KEY,
      data: defaultContent,
    });
    return defaultContent;
  } catch (err) {
    console.error("getSiteData: falling back to defaults —", err);
    return defaultContent;
  }
});

/** Persist new site content. Throws if the database is not configured. */
export async function saveSiteData(next: SiteData): Promise<void> {
  if (!isDbConfigured) {
    throw new Error("Database is not configured (MONGODB_URI missing)");
  }
  await connectToDatabase();
  await SiteContentModel.findOneAndUpdate(
    { key: SITE_CONTENT_KEY },
    { $set: { data: next } },
    { upsert: true, new: true }
  );
}
