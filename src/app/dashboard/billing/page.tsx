"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Billing</h1>
        <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("is_seller")
            .eq("id", user.id)
            .single();
          setIsSeller(data?.is_seller ?? false);
        }
      } catch {
        // Profile table may not exist yet or user has no row — default to free
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const [error, setError] = useState("");

  async function handleSubscribe() {
    setActionLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Failed to create checkout session");
    } catch {
      setError("Network error. Please try again.");
    }
    setActionLoading(false);
  }

  async function handleManage() {
    setActionLoading(true);
    const res = await fetch("/api/billing-portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Billing</h1>
        <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Subscription activated! You now have full seller access.
        </div>
      )}

      {canceled && (
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-700">
          Checkout was canceled. You can try again anytime.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-card-border p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-3 w-3 rounded-full ${isSeller ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="text-sm font-medium text-gray-500">
            {isSeller ? "Active Subscription" : "No Active Subscription"}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-1">
          {isSeller ? "Seller Plan" : "Free Plan"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isSeller
            ? "You have full access to create listings, analytics, and seller tools."
            : "Upgrade to a Seller plan for $10/month to create listings and start selling."}
        </p>

        {isSeller ? (
          <div className="flex gap-3">
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              $10/month
            </span>
            <button
              onClick={handleManage}
              disabled={actionLoading}
              className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Loading..." : "Manage Subscription"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={actionLoading}
            className="rounded-lg bg-cta-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors disabled:opacity-50"
          >
            {actionLoading ? "Redirecting..." : "Subscribe — $10/mo"}
          </button>
        )}
      </div>

      {isSeller && (
        <p className="mt-4 text-xs text-gray-400">
          Manage your payment method, view invoices, or cancel your subscription through the Stripe portal.
        </p>
      )}
    </div>
  );
}
