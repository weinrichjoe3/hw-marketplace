"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface FullListing {
  id: string;
  title: string;
  description: string | null;
  series: string | null;
  year: string | null;
  condition: string | null;
  price: number;
  images: string[] | null;
  open_to_trades: boolean;
  created_at: string;
  seller_id: string;
  profiles: { display_name: string | null; created_at: string } | null;
}

interface MyListing {
  id: string;
  title: string;
  images: string[] | null;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<FullListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Trade modal state
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [myListings, setMyListings] = useState<MyListing[]>([]);
  const [selectedTradeListing, setSelectedTradeListing] = useState("");
  const [tradeMessage, setTradeMessage] = useState("");
  const [tradeSubmitting, setTradeSubmitting] = useState(false);
  const [tradeError, setTradeError] = useState("");
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [loadingMyListings, setLoadingMyListings] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data } = await supabase
        .from("listings")
        .select("*, profiles(display_name, created_at)")
        .eq("id", id)
        .single();
      setListing(data as FullListing | null);
      setLoading(false);
    }
    load();
  }, [id]);

  async function loadMyListings() {
    if (!user) return;
    setLoadingMyListings(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("listings")
      .select("id, title, images")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    setMyListings(data ?? []);
    setLoadingMyListings(false);
  }

  async function handleOfferSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOfferError("");
    setOfferSubmitting(true);

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: id,
          type: "cash",
          amount: parseFloat(offerAmount),
          message: offerMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOfferError(data.error || "Failed to send offer");
      } else {
        setOfferSuccess(true);
      }
    } catch {
      setOfferError("Something went wrong");
    } finally {
      setOfferSubmitting(false);
    }
  }

  async function handleTradeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTradeError("");
    setTradeSubmitting(true);

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: id,
          type: "trade",
          trade_listing_id: selectedTradeListing,
          message: tradeMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTradeError(data.error || "Failed to send trade proposal");
      } else {
        setTradeSuccess(true);
      }
    } catch {
      setTradeError("Something went wrong");
    } finally {
      setTradeSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="aspect-[16/9] bg-gray-100 rounded-2xl" />
          <div className="h-8 w-64 bg-gray-100 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Listing not found</h1>
        <p className="text-gray-500 mb-6">This listing may have been removed or doesn&apos;t exist.</p>
        <Link href="/listings" className="text-sm font-medium text-royal-blue hover:underline">
          &larr; Back to Browse
        </Link>
      </div>
    );
  }

  const images = listing.images ?? [];
  const profile = listing.profiles;
  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/listings" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
        &larr; Back to Browse
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-4">
        {/* Left column */}
        <div>
          {/* Gallery */}
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] relative mb-3">
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImg]}
                  alt={listing.title}
                  className="w-full h-full object-contain bg-gray-50"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                      onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImg ? "border-royal-blue" : "border-transparent"
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {listing.series && (
                <span className="rounded-full bg-royal-blue/10 px-3 py-1 text-xs font-medium text-royal-blue">
                  {listing.series}
                </span>
              )}
              {listing.year && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {listing.year}
                </span>
              )}
              {listing.condition && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {listing.condition}
                </span>
              )}
              {listing.open_to_trades && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Open to Trades
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-3xl font-bold text-royal-blue mb-6">${listing.price}</p>

            {listing.description && (
              <div className="prose prose-sm prose-gray max-w-none">
                <h3 className="text-base font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Action buttons */}
          <div className="rounded-2xl border border-card-border p-6 space-y-3">
            {!user ? (
              <Link
                href="/login"
                className="block w-full rounded-lg bg-sky-blue px-6 py-3 text-sm font-semibold text-white text-center hover:bg-sky-blue/90 transition-colors"
              >
                Log in to Make an Offer
              </Link>
            ) : isOwner ? (
              <Link
                href={`/dashboard/listings/${listing.id}/edit`}
                className="block w-full rounded-lg bg-sky-blue px-6 py-3 text-sm font-semibold text-white text-center hover:bg-sky-blue/90 transition-colors"
              >
                Edit Listing
              </Link>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowOfferModal(true);
                    setOfferSuccess(false);
                    setOfferError("");
                    setOfferAmount("");
                    setOfferMessage("");
                  }}
                  className="w-full rounded-lg bg-sky-blue px-6 py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors"
                >
                  Make an Offer
                </button>
                {listing.open_to_trades && (
                  <button
                    onClick={() => {
                      setShowTradeModal(true);
                      setTradeSuccess(false);
                      setTradeError("");
                      setSelectedTradeListing("");
                      setTradeMessage("");
                      loadMyListings();
                    }}
                    className="w-full rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Propose a Trade
                  </button>
                )}
              </>
            )}
          </div>

          {/* Seller card */}
          <div className="rounded-2xl border border-card-border p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Seller</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-royal-blue/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-royal-blue">
                  {(profile?.display_name ?? "?")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{profile?.display_name || "Anonymous"}</p>
                <p className="text-xs text-gray-400">
                  Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Make an Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Make an Offer</h2>
              <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {offerSuccess ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold mb-1">Offer Sent!</p>
                  <p className="text-sm text-gray-500 mb-4">The seller will be notified of your offer.</p>
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="rounded-lg bg-royal-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                      {images[0] && <img src={images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{listing.title}</p>
                      <p className="text-sm text-royal-blue font-semibold">Listed at ${listing.price}</p>
                    </div>
                  </div>

                  {offerError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                      {offerError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="offerAmount" className="block text-sm font-medium mb-1.5">Your Offer ($)</label>
                    <input
                      id="offerAmount"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
                    />
                  </div>

                  <div>
                    <label htmlFor="offerMsg" className="block text-sm font-medium mb-1.5">Message <span className="text-gray-400">(optional)</span></label>
                    <textarea
                      id="offerMsg"
                      rows={3}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Include any details about your offer..."
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={offerSubmitting}
                    className="w-full rounded-lg bg-sky-blue py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors disabled:opacity-50"
                  >
                    {offerSubmitting ? "Sending..." : "Send Offer"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Propose a Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Propose a Trade</h2>
              <button onClick={() => setShowTradeModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {tradeSuccess ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold mb-1">Trade Proposal Sent!</p>
                  <p className="text-sm text-gray-500 mb-4">The seller will review your trade offer.</p>
                  <button
                    onClick={() => setShowTradeModal(false)}
                    className="rounded-lg bg-royal-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTradeSubmit} className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                      {images[0] && <img src={images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{listing.title}</p>
                      <p className="text-sm text-gray-500">Trading for this item</p>
                    </div>
                  </div>

                  {tradeError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                      {tradeError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Select Your Listing to Trade</label>
                    {loadingMyListings ? (
                      <div className="space-y-2">
                        {[1, 2].map((i) => (
                          <div key={i} className="animate-pulse h-14 bg-gray-100 rounded-lg" />
                        ))}
                      </div>
                    ) : myListings.length === 0 ? (
                      <div className="rounded-lg border border-gray-200 p-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">You don&apos;t have any active listings to trade.</p>
                        <Link
                          href="/dashboard/listings/new"
                          className="text-sm font-medium text-royal-blue hover:underline"
                        >
                          Create a listing first
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {myListings.map((ml) => (
                          <label
                            key={ml.id}
                            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                              selectedTradeListing === ml.id
                                ? "border-royal-blue bg-royal-blue/5"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="tradeListing"
                              value={ml.id}
                              checked={selectedTradeListing === ml.id}
                              onChange={() => setSelectedTradeListing(ml.id)}
                              className="h-4 w-4 text-royal-blue focus:ring-royal-blue"
                            />
                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {ml.images?.[0] ? (
                                <img src={ml.images[0]} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-300">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium truncate">{ml.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tradeMsg" className="block text-sm font-medium mb-1.5">Message <span className="text-gray-400">(optional)</span></label>
                    <textarea
                      id="tradeMsg"
                      rows={3}
                      value={tradeMessage}
                      onChange={(e) => setTradeMessage(e.target.value)}
                      placeholder="Why do you think this is a fair trade..."
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={tradeSubmitting || !selectedTradeListing}
                    className="w-full rounded-lg bg-sky-blue py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors disabled:opacity-50"
                  >
                    {tradeSubmitting ? "Sending..." : "Send Trade Proposal"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
