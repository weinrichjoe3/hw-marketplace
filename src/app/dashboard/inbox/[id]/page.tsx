"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface OfferDetail {
  id: string;
  type: "cash" | "trade";
  amount: number | null;
  status: string;
  message: string | null;
  counter_amount: number | null;
  counter_message: string | null;
  created_at: string;
  updated_at: string;
  sender_id: string;
  receiver_id: string;
  listing: { id: string; title: string; price: number; images: string[] | null } | null;
  sender: { display_name: string | null } | null;
  receiver: { display_name: string | null } | null;
  trade_listing: { id: string; title: string; price: number; images: string[] | null } | null;
}

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  // Counter form state
  const [showCounter, setShowCounter] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user: u } } = await supabase.auth.getUser();
        setUser(u);

        const { data } = await supabase
          .from("offers")
          .select(`
            id, type, amount, status, message, counter_amount, counter_message,
            created_at, updated_at, sender_id, receiver_id,
            listing:listings!listing_id(id, title, price, images),
            sender:profiles!sender_id(display_name),
            receiver:profiles!receiver_id(display_name),
            trade_listing:listings!trade_listing_id(id, title, price, images)
          `)
          .eq("id", id)
          .single();

        setOffer(data as unknown as OfferDetail | null);
      } catch {
        // ok
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleAction(action: "accept" | "decline" | "counter") {
    setError("");
    setActing(true);

    try {
      const body: Record<string, unknown> = { action };
      if (action === "counter") {
        body.counter_amount = parseFloat(counterAmount);
        body.counter_message = counterMessage;
      }

      const res = await fetch(`/api/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed");
      } else {
        // Reload the offer
        const supabase = createClient();
        const { data: updated } = await supabase
          .from("offers")
          .select(`
            id, type, amount, status, message, counter_amount, counter_message,
            created_at, updated_at, sender_id, receiver_id,
            listing:listings!listing_id(id, title, price, images),
            sender:profiles!sender_id(display_name),
            receiver:profiles!receiver_id(display_name),
            trade_listing:listings!trade_listing_id(id, title, price, images)
          `)
          .eq("id", id)
          .single();
        setOffer(updated as unknown as OfferDetail | null);
        setShowCounter(false);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-gray-100 rounded" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-20 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-6 md:p-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Offer not found</h1>
        <p className="text-gray-500 mb-6">This offer may have been removed.</p>
        <Link href="/dashboard/inbox" className="text-sm font-medium text-royal-blue hover:underline">
          &larr; Back to Inbox
        </Link>
      </div>
    );
  }

  const isReceiver = user?.id === offer.receiver_id;
  const canAct = isReceiver && offer.status === "pending";

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      declined: "bg-red-100 text-red-600",
      countered: "bg-blue-100 text-blue-700",
    };
    return styles[status] ?? "bg-gray-100 text-gray-600";
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <Link href="/dashboard/inbox" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
        &larr; Back to Inbox
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">
          {offer.type === "cash" ? "Cash Offer" : "Trade Proposal"}
        </h1>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadge(offer.status)}`}>
          {offer.status}
        </span>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Listing card */}
      <div className="rounded-2xl border border-card-border p-5 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Listing</p>
        <Link href={`/listings/${offer.listing?.id}`} className="flex items-center gap-4 group">
          <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
            {offer.listing?.images?.[0] ? (
              <img src={offer.listing.images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium group-hover:text-royal-blue transition-colors">{offer.listing?.title ?? "Unknown"}</p>
            <p className="text-sm text-gray-500">Listed at ${offer.listing?.price ?? 0}</p>
          </div>
        </Link>
      </div>

      {/* Offer details */}
      <div className="rounded-2xl border border-card-border p-5 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
          {offer.type === "cash" ? "Offer Details" : "Trade Details"}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-sm font-medium">{offer.sender?.display_name || "Anonymous"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">To</p>
            <p className="text-sm font-medium">{offer.receiver?.display_name || "Anonymous"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium">
              {new Date(offer.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          {offer.type === "cash" && (
            <div>
              <p className="text-xs text-gray-500">Offer Amount</p>
              <p className="text-lg font-bold text-royal-blue">${offer.amount}</p>
            </div>
          )}
        </div>

        {/* Trade listing */}
        {offer.type === "trade" && offer.trade_listing && (
          <div className="rounded-lg bg-gray-50 p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2">Offering to trade</p>
            <Link href={`/listings/${offer.trade_listing.id}`} className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                {offer.trade_listing.images?.[0] ? (
                  <img src={offer.trade_listing.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium group-hover:text-royal-blue transition-colors">{offer.trade_listing.title}</p>
                <p className="text-xs text-gray-500">${offer.trade_listing.price}</p>
              </div>
            </Link>
          </div>
        )}

        {offer.message && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Message</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{offer.message}</p>
          </div>
        )}
      </div>

      {/* Counter offer info */}
      {offer.status === "countered" && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 mb-4">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-medium mb-3">Counter Offer</p>
          {offer.counter_amount != null && (
            <p className="text-lg font-bold text-blue-700 mb-2">${offer.counter_amount}</p>
          )}
          {offer.counter_message && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{offer.counter_message}</p>
          )}
        </div>
      )}

      {/* Action buttons for receiver */}
      {canAct && !showCounter && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleAction("accept")}
            disabled={acting}
            className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {acting ? "Processing..." : "Accept"}
          </button>
          <button
            onClick={() => handleAction("decline")}
            disabled={acting}
            className="flex-1 rounded-lg bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Decline
          </button>
          <button
            onClick={() => setShowCounter(true)}
            disabled={acting}
            className="flex-1 rounded-lg bg-royal-blue py-3 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors disabled:opacity-50"
          >
            Counter
          </button>
        </div>
      )}

      {/* Counter form */}
      {showCounter && (
        <div className="rounded-2xl border border-card-border p-5 mt-6">
          <h3 className="font-semibold mb-4">Make a Counter Offer</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="counterAmt" className="block text-sm font-medium mb-1.5">Counter Amount ($)</label>
              <input
                id="counterAmt"
                type="number"
                min="0"
                step="0.01"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
              />
            </div>
            <div>
              <label htmlFor="counterMsg" className="block text-sm font-medium mb-1.5">Message <span className="text-gray-400">(optional)</span></label>
              <textarea
                id="counterMsg"
                rows={3}
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder="Explain your counter offer..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("counter")}
                disabled={acting || !counterAmount}
                className="flex-1 rounded-lg bg-royal-blue py-3 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors disabled:opacity-50"
              >
                {acting ? "Sending..." : "Send Counter"}
              </button>
              <button
                onClick={() => setShowCounter(false)}
                className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status message for resolved offers */}
      {offer.status === "accepted" && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-5 mt-6 text-center">
          <p className="font-semibold text-green-700">This offer has been accepted!</p>
          <p className="text-sm text-green-600 mt-1">The listing has been marked as sold.</p>
        </div>
      )}
      {offer.status === "declined" && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-5 mt-6 text-center">
          <p className="font-semibold text-red-600">This offer was declined.</p>
        </div>
      )}
    </div>
  );
}
