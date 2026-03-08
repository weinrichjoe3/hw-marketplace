"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UserListing {
  id: string;
  title: string;
  price: number;
  images: string[] | null;
}

export function SidebarActions({
  price,
  openToTrades,
  sellerName,
  memberSince,
  listingId,
  sellerId,
}: {
  price: number;
  openToTrades: boolean;
  sellerName: string;
  memberSince: string;
  listingId: string;
  sellerId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [copied, setCopied] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [tradeMessage, setTradeMessage] = useState("");
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [tradeError, setTradeError] = useState("");
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [userListingsLoading, setUserListingsLoading] = useState(false);
  const [selectedTradeListingId, setSelectedTradeListingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const isSeller = currentUserId === sellerId;

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openOfferModal() {
    if (!currentUserId) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOfferAmount("");
    setOfferMessage("");
    setOfferError("");
    setOfferSuccess(false);
    setShowOfferModal(true);
  }

  function openTradeModal() {
    if (!currentUserId) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setTradeMessage("");
    setTradeError("");
    setTradeSuccess(false);
    setSelectedTradeListingId(null);
    setShowTradeModal(true);
    loadUserListings();
  }

  async function loadUserListings() {
    setUserListingsLoading(true);
    const { data } = await supabase
      .from("listings")
      .select("id, title, price, images")
      .eq("seller_id", currentUserId!)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    setUserListings((data as UserListing[]) ?? []);
    setUserListingsLoading(false);
  }

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(offerAmount);
    if (!amount || amount <= 0) {
      setOfferError("Please enter a valid amount.");
      return;
    }
    setOfferLoading(true);
    setOfferError("");

    const { error } = await supabase.from("offers").insert({
      type: "cash",
      amount,
      message: offerMessage.trim() || null,
      listing_id: listingId,
      sender_id: currentUserId,
      receiver_id: sellerId,
      status: "pending",
    });

    setOfferLoading(false);
    if (error) {
      setOfferError(error.message);
    } else {
      setOfferSuccess(true);
      setTimeout(() => setShowOfferModal(false), 1500);
    }
  }

  async function submitTrade(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTradeListingId) {
      setTradeError("Please select one of your listings to trade.");
      return;
    }
    setTradeLoading(true);
    setTradeError("");

    const { error } = await supabase.from("offers").insert({
      type: "trade",
      trade_listing_id: selectedTradeListingId,
      message: tradeMessage.trim() || null,
      listing_id: listingId,
      sender_id: currentUserId,
      receiver_id: sellerId,
      status: "pending",
    });

    setTradeLoading(false);
    if (error) {
      setTradeError(error.message);
    } else {
      setTradeSuccess(true);
      setTimeout(() => setShowTradeModal(false), 1500);
    }
  }

  return (
    <>
      <div className="sticky top-24 space-y-4">
        {/* Price & Actions Card */}
        <div className="rounded-xl border border-card-border p-6">
          <p className="text-xs text-gray-500 mb-1">Price</p>
          <p className="text-3xl font-bold mb-6">${price}</p>

          {!isSeller && (
            <button
              onClick={openOfferModal}
              className="w-full rounded-lg bg-sky-blue px-4 py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors mb-3"
            >
              Make an Offer
            </button>
          )}

          {openToTrades && !isSeller && (
            <button
              onClick={openTradeModal}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Propose a Trade
            </button>
          )}
        </div>

        {/* Seller Card */}
        <div className="rounded-xl border border-card-border p-5">
          <p className="text-xs text-gray-500 mb-2">Seller</p>
          <Link href={`/sellers/${sellerId}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-royal-blue/10 flex items-center justify-center text-royal-blue font-bold text-sm">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold group-hover:text-royal-blue transition-colors">{sellerName}</p>
              <p className="text-xs text-gray-500">Member since {memberSince}</p>
            </div>
          </Link>
        </div>

        {/* Share */}
        <div className="rounded-xl border border-card-border p-5">
          <p className="text-xs text-gray-500 mb-3">Share this listing</p>
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* ── Make an Offer Modal ── */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowOfferModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            {offerSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">Your offer has been sent!</p>
              </div>
            ) : (
              <form onSubmit={submitOffer}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Make an Offer</h3>
                  <button type="button" onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Listed at <span className="font-semibold text-black">${price}</span></p>
                <label className="block text-sm font-medium mb-1">Your Offer ($)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
                  required
                />
                <label className="block text-sm font-medium mb-1">Message (optional)</label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Add a note to the seller..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
                />
                {offerError && <p className="text-sm text-red-600 mb-3">{offerError}</p>}
                <button
                  type="submit"
                  disabled={offerLoading}
                  className="w-full rounded-lg bg-cta-yellow px-4 py-3 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors disabled:opacity-50"
                >
                  {offerLoading ? "Sending..." : "Send Offer"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Propose a Trade Modal ── */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowTradeModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {tradeSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">Your trade proposal has been sent!</p>
              </div>
            ) : (
              <form onSubmit={submitTrade}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Propose a Trade</h3>
                  <button type="button" onClick={() => setShowTradeModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Select one of your listings to offer in trade:</p>

                {userListingsLoading ? (
                  <div className="text-center py-8 text-gray-400 text-sm">Loading your listings...</div>
                ) : userListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 mb-3">You need at least one active listing to propose a trade.</p>
                    <Link
                      href="/dashboard/listings"
                      className="text-sm font-medium text-royal-blue hover:underline"
                    >
                      Create a listing &rarr;
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {userListings.map((ul) => {
                        const img = ul.images?.[0];
                        const selected = selectedTradeListingId === ul.id;
                        return (
                          <button
                            key={ul.id}
                            type="button"
                            onClick={() => setSelectedTradeListingId(ul.id)}
                            className={`rounded-xl border-2 overflow-hidden text-left transition-colors ${
                              selected ? "border-royal-blue" : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="aspect-[4/3] bg-gray-100 relative">
                              {img ? (
                                <img src={img} alt={ul.title} className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                  </svg>
                                </div>
                              )}
                              {selected && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-royal-blue flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold line-clamp-1">{ul.title}</p>
                              <p className="text-xs text-gray-500">${ul.price}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <label className="block text-sm font-medium mb-1">Message (optional)</label>
                    <textarea
                      value={tradeMessage}
                      onChange={(e) => setTradeMessage(e.target.value)}
                      placeholder="Add a note to the seller..."
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
                    />
                    {tradeError && <p className="text-sm text-red-600 mb-3">{tradeError}</p>}
                    <button
                      type="submit"
                      disabled={tradeLoading || !selectedTradeListingId}
                      className="w-full rounded-lg bg-cta-yellow px-4 py-3 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors disabled:opacity-50"
                    >
                      {tradeLoading ? "Sending..." : "Propose Trade"}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
