import mongoose, { Schema } from "mongoose";

/**
 * First-party page-view counter. One document per (path, day), so the admin
 * dashboard can show totals, per-page breakdowns, and a recent daily trend
 * without any external analytics service.
 */
export type PageViewDoc = {
  path: string;
  day: string; // YYYY-MM-DD (UTC)
  count: number;
};

const PageViewSchema = new Schema<PageViewDoc>({
  path: { type: String, required: true },
  day: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
});

PageViewSchema.index({ path: 1, day: 1 }, { unique: true });

export const PageViewModel =
  (mongoose.models.PageView as mongoose.Model<PageViewDoc>) ||
  mongoose.model<PageViewDoc>("PageView", PageViewSchema);
