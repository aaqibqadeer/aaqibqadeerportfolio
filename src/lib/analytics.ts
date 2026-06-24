import { connectToDatabase, isDbConfigured } from "./db";
import { PageViewModel } from "./models/Analytics";

/** Today's date as YYYY-MM-DD (UTC). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** N days ago as YYYY-MM-DD (UTC). */
function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Increment the view counter for a path (today). No-op without a database. */
export async function recordView(path: string): Promise<void> {
  if (!isDbConfigured) return;
  await connectToDatabase();
  await PageViewModel.updateOne(
    { path, day: today() },
    { $inc: { count: 1 } },
    { upsert: true }
  );
}

export type AnalyticsSummary = {
  dbConfigured: boolean;
  gaConfigured: boolean;
  gaMeasurementId?: string;
  total: number;
  todayCount: number;
  last7: { day: string; count: number }[];
  topPages: { path: string; count: number }[];
};

/** Aggregate analytics for the admin dashboard. */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const base: AnalyticsSummary = {
    dbConfigured: isDbConfigured,
    gaConfigured: Boolean(gaMeasurementId),
    gaMeasurementId,
    total: 0,
    todayCount: 0,
    last7: [],
    topPages: [],
  };

  if (!isDbConfigured) return base;

  try {
    await connectToDatabase();

    const [totalAgg] = await PageViewModel.aggregate([
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    base.total = totalAgg?.total ?? 0;

    const todayDocs = await PageViewModel.aggregate([
      { $match: { day: today() } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    base.todayCount = todayDocs[0]?.total ?? 0;

    // Last 7 days, filled so empty days show as 0.
    const since = daysAgo(6);
    const dayAgg = await PageViewModel.aggregate([
      { $match: { day: { $gte: since } } },
      { $group: { _id: "$day", count: { $sum: "$count" } } },
    ]);
    const byDay = new Map<string, number>(
      dayAgg.map((d) => [d._id as string, d.count as number])
    );
    base.last7 = Array.from({ length: 7 }, (_, i) => {
      const day = daysAgo(6 - i);
      return { day, count: byDay.get(day) ?? 0 };
    });

    const topAgg = await PageViewModel.aggregate([
      { $group: { _id: "$path", count: { $sum: "$count" } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    base.topPages = topAgg.map((p) => ({
      path: p._id as string,
      count: p.count as number,
    }));

    return base;
  } catch (err) {
    console.error("getAnalyticsSummary failed:", err);
    return base;
  }
}
