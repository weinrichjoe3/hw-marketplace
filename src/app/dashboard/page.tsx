"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const STATS = [
  { label: "Active Listings", value: "0" },
  { label: "Total Views", value: "0" },
  { label: "Messages", value: "0" },
  { label: "Revenue", value: "$0" },
];

export default function DashboardPage() {
  const [isSeller, setIsSeller] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("is_seller, display_name")
            .eq("id", user.id)
            .single();
          if (data) {
            setIsSeller(data.is_seller ?? false);
            setDisplayName(data.display_name ?? "");
          }
        }
      } catch {
        // Profile table may not exist yet — defaults are fine
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-1">
        Welcome{displayName ? `, ${displayName}` : ""}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {isSeller ? "Seller Account" : "Free Account"} &middot;{" "}
        <Link href="/dashboard/billing" className="text-royal-blue hover:underline">
          {isSeller ? "Manage subscription" : "Upgrade to Seller"}
        </Link>
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-card-border p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Empty / Upgrade State */}
      {!isSeller ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Upgrade to a Seller account to create listings, access analytics, and start selling to thousands of collectors.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block rounded-lg bg-cta-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
          >
            Upgrade to Seller — $10/mo
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">You&apos;re all set!</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Your seller account is active. Start creating listings to reach thousands of collectors.
          </p>
        </div>
      )}
    </div>
  );
}
