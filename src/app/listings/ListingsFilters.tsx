"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const SERIES_OPTIONS = [
  "Treasure Hunt",
  "Super Treasure Hunt",
  "Red Line Club",
  "Car Culture",
  "Boulevard",
  "Team Transport",
  "Convention Exclusive",
  "Mainline",
  "Premium",
  "Other",
];

const CONDITION_OPTIONS = [
  "Mint / Carded",
  "Near Mint / Carded",
  "Mint / Loose",
  "Excellent / Loose",
  "Good / Loose",
  "Poor",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function ListingsFilters({
  currentSearch,
  currentSeries,
  currentCondition,
  currentSort,
}: {
  currentSearch: string;
  currentSeries: string;
  currentCondition: string;
  currentSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [tempSeries, setTempSeries] = useState(currentSeries);
  const [tempCondition, setTempCondition] = useState(currentCondition);
  const [tempSort, setTempSort] = useState(currentSort);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams("search", search);
  }

  function openFilterSheet() {
    setTempSeries(currentSeries);
    setTempCondition(currentCondition);
    setTempSort(currentSort);
    setShowFilterSheet(true);
    document.body.style.overflow = "hidden";
  }

  function closeFilterSheet() {
    setShowFilterSheet(false);
    document.body.style.overflow = "";
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    if (tempSeries) params.set("series", tempSeries); else params.delete("series");
    if (tempCondition) params.set("condition", tempCondition); else params.delete("condition");
    if (tempSort && tempSort !== "newest") params.set("sort", tempSort); else params.delete("sort");
    router.push(`/listings?${params.toString()}`);
    closeFilterSheet();
  }

  function clearFilters() {
    setTempSeries("");
    setTempCondition("");
    setTempSort("newest");
  }

  const activeFilterCount = [currentSeries, currentCondition, currentSort !== "newest" ? currentSort : ""].filter(Boolean).length;

  return (
    <>
      {/* Search bar — sticky on mobile */}
      <div className="sticky top-[67px] md:static z-30 bg-white pb-3 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
        <form onSubmit={handleSearchSubmit} className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => updateParams("search", search)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
          />
        </form>
      </div>

      {/* Mobile: filter button */}
      <div className="md:hidden flex gap-2 mb-4">
        <button
          onClick={openFilterSheet}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium min-h-[44px] hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-hw-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop: inline filter dropdowns */}
      <div className="hidden md:flex gap-3 mb-6">
        <select
          value={currentSeries}
          onChange={(e) => updateParams("series", e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        >
          <option value="">All Series</option>
          {SERIES_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={currentCondition}
          onChange={(e) => updateParams("condition", e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        >
          <option value="">All Conditions</option>
          {CONDITION_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Mobile filter sheet */}
      {showFilterSheet && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeFilterSheet} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up max-h-[85vh] overflow-y-auto safe-area-bottom">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={closeFilterSheet} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Series</label>
                <select
                  value={tempSeries}
                  onChange={(e) => setTempSeries(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
                >
                  <option value="">All Series</option>
                  {SERIES_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Condition</label>
                <select
                  value={tempCondition}
                  onChange={(e) => setTempCondition(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
                >
                  <option value="">All Conditions</option>
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Sort By</label>
                <select
                  value={tempSort}
                  onChange={(e) => setTempSort(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3.5 text-sm font-medium min-h-[44px] hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 rounded-lg bg-hw-blue px-4 py-3.5 text-sm font-semibold text-white min-h-[44px] hover:bg-hw-blue/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
