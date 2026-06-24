import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata = { title: "Analytics" };

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  const a = await getAnalyticsSummary();
  const maxDay = Math.max(1, ...a.last7.map((d) => d.count));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold">Analytics</h1>
      <p className="mt-2 text-sm text-text-muted">
        First-party page views{a.gaConfigured ? " + Google Analytics" : ""}.
      </p>

      {!a.dbConfigured && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          First-party analytics needs MongoDB. Set <code>MONGODB_URI</code> to
          start collecting page views.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total views" value={a.total.toLocaleString()} />
        <Stat label="Views today" value={a.todayCount.toLocaleString()} />
        <Stat
          label="Google Analytics"
          value={a.gaConfigured ? "Connected" : "Not set"}
        />
      </div>

      {/* Last 7 days */}
      <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-xl font-semibold">Last 7 days</h2>
        <div className="mt-5 flex h-40 items-end gap-3">
          {a.last7.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-primary"
                  style={{ height: `${(d.count / maxDay) * 100}%` }}
                  title={`${d.count} views`}
                />
              </div>
              <span className="text-[10px] text-text-muted">
                {d.day.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Top pages */}
      <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-xl font-semibold">Top pages</h2>
        {a.topPages.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No data yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {a.topPages.map((p) => (
              <li
                key={p.path}
                className="flex items-center justify-between rounded-lg bg-surface-alt px-3 py-2 text-sm"
              >
                <span className="font-mono text-text">{p.path}</span>
                <span className="font-semibold text-text-muted">
                  {p.count.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {a.gaConfigured && (
        <p className="mt-6 text-sm text-text-muted">
          Detailed Google Analytics reports are available in your{" "}
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent underline"
          >
            GA dashboard
          </a>{" "}
          (property {a.gaMeasurementId}).
        </p>
      )}
    </main>
  );
}
