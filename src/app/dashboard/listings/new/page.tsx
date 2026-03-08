"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ListingForm } from "@/components/ListingForm";

export default function NewListingPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const { data } = await supabase
            .from("profiles")
            .select("is_seller")
            .eq("id", user.id)
            .single();
          setIsSeller(data?.is_seller ?? false);
        }
      } catch {
        // defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse h-8 w-48 bg-gray-100 rounded mb-6" />
        <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center max-w-lg mx-auto">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Seller Account Required</h3>
          <p className="text-sm text-gray-500 mb-6">
            Upgrade to a Seller account for $10/month to create and manage listings.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block rounded-lg bg-cta-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
          >
            Upgrade to Seller — $10/mo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <div className="rounded-2xl border border-card-border bg-white p-6 md:p-8">
        <ListingForm userId={userId!} />
      </div>
    </div>
  );
}
