"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnalyticsChart } from "./AnalyticsChart";

interface DayData {
  date: string;
  page_views: number;
  listing_views: number;
  signups: number;
  offers: number;
}

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [days, setDays] = useState(30);
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [totals, setTotals] = useState({ page_views: 0, listing_views: 0, signups: 0, offers: 0 });
  const [topListings, setTopListings] = useState<{ listing_id: string; title: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  async function loadAnalytics() {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data: events } = await supabase
      .from("analytics_events")
      .select("event_type, listing_id, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (!events) {
      setLoading(false);
      return;
    }

    // Aggregate by day
    const dayMap = new Map<string, DayData>();
    const listingViewCounts = new Map<string, number>();
    let pv = 0, lv = 0, su = 0, of = 0;

    for (const e of events) {
      const date = new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!dayMap.has(date)) {
        dayMap.set(date, { date, page_views: 0, listing_views: 0, signups: 0, offers: 0 });
      }
      const day = dayMap.get(date)!;

      switch (e.event_type) {
        case "page_view":
          day.page_views++;
          pv++;
          break;
        case "listing_view":
          day.listing_views++;
          lv++;
          if (e.listing_id) {
            listingViewCounts.set(e.listing_id, (listingViewCounts.get(e.listing_id) ?? 0) + 1);
          }
          break;
        case "signup":
          day.signups++;
          su++;
          break;
        case "offer_sent":
          day.offers++;
          of++;
          break;
      }
    }

    setChartData(Array.from(dayMap.values()));
    setTotals({ page_views: pv, listing_views: lv, signups: su, offers: of });

    // Get top listings
    const topIds = Array.from(listingViewCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topIds.length > 0) {
      const { data: listings } = await supabase
        .from("listings")
        .select("id, title")
        .in("id", topIds.map(([id]) => id));

      const titleMap = new Map((listings ?? []).map((l: { id: string; title: string }) => [l.id, l.title]));
      setTopListings(topIds.map(([id, views]) => ({
        listing_id: id,
        title: titleMap.get(id) ?? "Deleted listing",
        views,
      })));
    } else {
      setTopListings([]);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-sm text-gray-500">Platform activity and trends</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading analytics...</div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Page Views", value: totals.page_views, color: "bg-blue-500" },
              { label: "Listing Views", value: totals.listing_views, color: "bg-green-500" },
              { label: "Signups", value: totals.signups, color: "bg-purple-500" },
              { label: "Offers Sent", value: totals.offers, color: "bg-orange-500" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-card-border bg-white p-5">
                <div className={`w-2 h-2 rounded-full ${m.color} mb-3`} />
                <p className="text-2xl font-bold">{m.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="rounded-xl border border-card-border bg-white p-5 mb-8">
              <h2 className="font-semibold mb-4">Activity Over Time</h2>
              <AnalyticsChart data={chartData} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Listings */}
            <div className="rounded-xl border border-card-border bg-white p-5">
              <h2 className="font-semibold mb-4">Top Viewed Listings</h2>
              {topListings.length === 0 ? (
                <p className="text-sm text-gray-400">No listing views yet</p>
              ) : (
                <div className="space-y-3">
                  {topListings.map((l, i) => (
                    <div key={l.listing_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                        <span className="text-sm font-medium truncate">{l.title}</span>
                      </div>
                      <span className="shrink-0 text-sm text-gray-500">{l.views} views</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conversion Funnel */}
            <div className="rounded-xl border border-card-border bg-white p-5">
              <h2 className="font-semibold mb-4">Conversion Funnel</h2>
              {[
                { label: "Page Views", value: totals.page_views, pct: 100 },
                { label: "Listing Views", value: totals.listing_views, pct: totals.page_views ? Math.round((totals.listing_views / totals.page_views) * 100) : 0 },
                { label: "Offers Sent", value: totals.offers, pct: totals.listing_views ? Math.round((totals.offers / totals.listing_views) * 100) : 0 },
              ].map((step) => (
                <div key={step.label} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{step.label}</span>
                    <span className="text-sm font-medium">{step.value.toLocaleString()} ({step.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-hw-blue rounded-full transition-all"
                      style={{ width: `${Math.min(step.pct, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
