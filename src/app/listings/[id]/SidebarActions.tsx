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
  listingTitle,
  listingImage,
  mobileMode = false,
}: {
  price: number;
  openToTrades: boolean;
  sellerName: string;
  memberSince: string;
  listingId: string;
  sellerId: string;
  listingTitle: string;
  listingImage: string | null;
  mobileMode?: boolean;
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
  const [igCopied, setIgCopied] = useState(false);

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

  function handleShareTwitter() {
    const text = encodeURIComponent(`Check out this ${listingTitle} on HW Swap and Shop!`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }

  function handleShareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  function handleCopyInstagram() {
    const caption = `🔥 ${listingTitle} — $${price} on HW Swap and Shop! Link in bio 👆 #HotWheels #HWSwapAndShop #DieCast`;
    navigator.clipboard.writeText(caption);
    setIgCopied(true);
    setTimeout(() => setIgCopied(false), 2000);
  }

  function openModal(setter: (v: boolean) => void) {
    setter(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal(setter: (v: boolean) => void) {
    setter(false);
    document.body.style.overflow = "";
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
    openModal(setShowOfferModal);
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
    openModal(setShowTradeModal);
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
      setTimeout(() => closeModal(setShowOfferModal), 1500);
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
      setTimeout(() => closeModal(setShowTradeModal), 1500);
    }
  }

  // Mobile bottom bar — just action buttons + share
  if (mobileMode) {
    return (
      <>
        <div className="flex gap-2">
          {!isSeller && (
            <button
              onClick={openOfferModal}
              className="flex-1 rounded-lg bg-hw-blue px-4 py-3 text-sm font-semibold text-white min-h-[44px]"
            >
              Make an Offer
            </button>
          )}
          {openToTrades && !isSeller && (
            <button
              onClick={openTradeModal}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 min-h-[44px]"
            >
              Propose Trade
            </button>
          )}
          {isSeller && (
            <p className="text-sm text-gray-400 text-center w-full py-2">This is your listing</p>
          )}
        </div>
        {renderModals()}
      </>
    );
  }

  // Desktop sidebar
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
              className="w-full rounded-lg bg-hw-blue px-4 py-3 text-sm font-semibold text-white hover:bg-hw-blue/90 transition-colors mb-3 min-h-[44px]"
            >
              Make an Offer
            </button>
          )}

          {openToTrades && !isSeller && (
            <button
              onClick={openTradeModal}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              Propose a Trade
            </button>
          )}
        </div>

        {/* Seller Card */}
        <div className="rounded-xl border border-card-border p-5">
          <p className="text-xs text-gray-500 mb-2">Seller</p>
          <Link href={`/sellers/${sellerId}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-hw-blue/10 flex items-center justify-center text-hw-blue font-bold text-sm">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold group-hover:text-hw-red transition-colors">{sellerName}</p>
              <p className="text-xs text-gray-500">Member since {memberSince}</p>
            </div>
          </Link>
        </div>

        {/* Share */}
        <div className="rounded-xl border border-card-border p-5">
          <p className="text-xs text-gray-500 mb-3">Share this listing</p>
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
              title="Copy Link"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {copied ? "Copied!" : "Link"}
            </button>
            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
              title="Share on X"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={handleShareFacebook}
              className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
              title="Share on Facebook"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              onClick={handleCopyInstagram}
              className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
              title={igCopied ? "Copied!" : "Copy for Instagram"}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {renderModals()}
    </>
  );

  function renderModals() {
    return (
      <>
        {showOfferModal && (
          <div
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/50 animate-fade-in"
            onClick={() => closeModal(setShowOfferModal)}
          >
            <div
              className="bg-white w-full md:rounded-2xl md:max-w-md md:mx-4 rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up md:animate-none safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
            >
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
                    <button type="button" onClick={() => closeModal(setShowOfferModal)} className="text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Listed at <span className="font-semibold text-black">${price}</span></p>
                  <label className="block text-sm font-medium mb-1">Your Offer ($)</label>
                  <input type="number" min="1" step="0.01" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder="0.00" className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]" required />
                  <label className="block text-sm font-medium mb-1">Message (optional)</label>
                  <textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="Add a note to the seller..." rows={3} className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue" />
                  {offerError && <p className="text-sm text-red-600 mb-3">{offerError}</p>}
                  <button type="submit" disabled={offerLoading} className="w-full rounded-lg bg-hw-yellow px-4 py-3.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors disabled:opacity-50 min-h-[44px]">
                    {offerLoading ? "Sending..." : "Send Offer"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {showTradeModal && (
          <div
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/50 animate-fade-in"
            onClick={() => closeModal(setShowTradeModal)}
          >
            <div
              className="bg-white w-full md:rounded-2xl md:max-w-lg md:mx-4 rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up md:animate-none safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
            >
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
                    <button type="button" onClick={() => closeModal(setShowTradeModal)} className="text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
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
                      <Link href="/dashboard/listings" className="text-sm font-medium text-hw-blue hover:underline">Create a listing &rarr;</Link>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {userListings.map((ul) => {
                          const img = ul.images?.[0];
                          const selected = selectedTradeListingId === ul.id;
                          return (
                            <button key={ul.id} type="button" onClick={() => setSelectedTradeListingId(ul.id)} className={`rounded-xl border-2 overflow-hidden text-left transition-colors min-h-[44px] ${selected ? "border-hw-blue" : "border-gray-200 hover:border-gray-300"}`}>
                              <div className="aspect-[4/3] bg-gray-100 relative">
                                {img ? <img src={img} alt={ul.title} className="absolute inset-0 w-full h-full object-cover" /> : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                  </div>
                                )}
                                {selected && (
                                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-hw-blue flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
                      <textarea value={tradeMessage} onChange={(e) => setTradeMessage(e.target.value)} placeholder="Add a note to the seller..." rows={3} className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue" />
                      {tradeError && <p className="text-sm text-red-600 mb-3">{tradeError}</p>}
                      <button type="submit" disabled={tradeLoading || !selectedTradeListingId} className="w-full rounded-lg bg-hw-yellow px-4 py-3.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors disabled:opacity-50 min-h-[44px]">
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
}
