"use client";

import { useState } from "react";

export function SidebarActions({
  price,
  openToTrades,
  sellerName,
  memberSince,
  listingId,
}: {
  price: number;
  openToTrades: boolean;
  sellerName: string;
  memberSince: string;
  listingId: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="sticky top-24 space-y-4">
      {/* Price & Actions Card */}
      <div className="rounded-xl border border-card-border p-6">
        <p className="text-xs text-gray-500 mb-1">Price</p>
        <p className="text-3xl font-bold mb-6">${price}</p>

        <button className="w-full rounded-lg bg-sky-blue px-4 py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors mb-3">
          Make an Offer
        </button>

        {openToTrades && (
          <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Propose a Trade
          </button>
        )}
      </div>

      {/* Seller Card */}
      <div className="rounded-xl border border-card-border p-5">
        <p className="text-xs text-gray-500 mb-2">Seller</p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-royal-blue/10 flex items-center justify-center text-royal-blue font-bold text-sm">
            {sellerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{sellerName}</p>
            <p className="text-xs text-gray-500">Member since {memberSince}</p>
          </div>
        </div>
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
  );
}
