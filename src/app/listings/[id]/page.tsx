"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<FullListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
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
            <button className="w-full rounded-lg bg-sky-blue px-6 py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors">
              Make an Offer
            </button>
            <button className="w-full rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Propose a Trade
            </button>
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
    </div>
  );
}
