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

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
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
          className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        />
      </form>

      {/* Series */}
      <select
        value={currentSeries}
        onChange={(e) => updateParams("series", e.target.value)}
        className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
      >
        <option value="">All Series</option>
        {SERIES_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Condition */}
      <select
        value={currentCondition}
        onChange={(e) => updateParams("condition", e.target.value)}
        className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
      >
        <option value="">All Conditions</option>
        {CONDITION_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => updateParams("sort", e.target.value)}
        className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
