import mongoose, { Schema } from "mongoose";
import type { SiteData } from "@/data/data";

/**
 * The entire site content is stored as a single document. `key` is a constant
 * ("site") so there's always exactly one record, and `data` holds the whole
 * SiteData tree as a flexible (Mixed) object that the admin panel edits.
 */
export type SiteContentDoc = {
  key: string;
  data: SiteData;
  updatedAt: Date;
};

const SiteContentSchema = new Schema<SiteContentDoc>(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, minimize: false }
);

export const SiteContentModel =
  (mongoose.models.SiteContent as mongoose.Model<SiteContentDoc>) ||
  mongoose.model<SiteContentDoc>("SiteContent", SiteContentSchema);

export const SITE_CONTENT_KEY = "site";
