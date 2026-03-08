"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ListingCard, type Listing } from "@/components/ListingCard";

const SERIES_OPTIONS = [
  "Treasure Hunt", "Red Line Club", "Car Culture", "Super Treasure Hunt",
  "Convention Exclusive", "Boulevard", "Team Transport", "Mainline", "Premium", "Other",
];

const CONDITION_OPTIONS = [
  "Mint / Carded", "Near Mint / Carded", "Mint / Loose",
  "Excellent / Loose", "Good / Loose", "Poor",
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [series, setSeries] = useState("");
  const [condition, setCondition] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase
        .from("listings")
        .select("id, title, series, year, condition, price, images, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (series) query = query.eq("series", series);
      if (condition) query = query.eq("condition", condition);
      if (search) query = query.ilike("title", `%${search}%`);

      const { data } = await query;
      setListings((data as Listing[]) ?? []);
      setLoading(false);
    }
    load();
  }, [search, series, condition]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
      <p className="text-gray-500 mb-8">Find your next grail piece from verified sellers</p>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
          />
        </div>
        <select
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
        >
          <option value="">All Series</option>
          {SERIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
        >
          <option value="">All Conditions</option>
          {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-card-border overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-1/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
