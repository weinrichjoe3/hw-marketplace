"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Offer {
  id: string;
  type: "cash" | "trade";
  amount: number | null;
  status: string;
  created_at: string;
  listing: { id: string; title: string; images: string[] | null } | null;
  sender: { display_name: string | null } | null;
  receiver: { display_name: string | null } | null;
  trade_listing: { id: string; title: string; images: string[] | null } | null;
}

type Tab = "received" | "sent";

export default function InboxPage() {
  const [tab, setTab] = useState<Tab>("received");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const filterCol = tab === "received" ? "receiver_id" : "sender_id";
        const { data } = await supabase
          .from("offers")
          .select(`
            id, type, amount, status, created_at,
            listing:listings!listing_id(id, title, images),
            sender:profiles!sender_id(display_name),
            receiver:profiles!receiver_id(display_name),
            trade_listing:listings!trade_listing_id(id, title, images)
          `)
          .eq(filterCol, user.id)
          .order("created_at", { ascending: false });

        setOffers((data as unknown as Offer[]) ?? []);
      } catch {
        // ok
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab]);

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      declined: "bg-red-100 text-red-600",
      countered: "bg-blue-100 text-blue-700",
    };
    return styles[status] ?? "bg-gray-100 text-gray-600";
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 mb-8 w-fit">
        <button
          onClick={() => setTab("received")}
          className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
            tab === "received" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
            tab === "sent" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sent
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">
            {tab === "received" ? "No offers received yet." : "You haven't sent any offers yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/dashboard/inbox/${offer.id}`}
              className={`block rounded-xl border p-4 transition-colors hover:bg-gray-50 ${
                offer.status === "pending" && tab === "received"
                  ? "border-royal-blue/30 bg-royal-blue/5"
                  : "border-card-border"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Listing thumbnail */}
                <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{offer.listing?.title ?? "Unknown listing"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {tab === "received"
                          ? `From ${offer.sender?.display_name || "Anonymous"}`
                          : `To ${offer.receiver?.display_name || "Anonymous"}`}
                        {" \u00b7 "}
                        {offer.type === "cash"
                          ? `$${offer.amount} offer`
                          : `Trade: ${offer.trade_listing?.title ?? "Unknown"}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(offer.status)}`}>
                        {offer.status}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(offer.created_at)}</span>
                    </div>
                  </div>
                </div>

                <svg className="h-5 w-5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
