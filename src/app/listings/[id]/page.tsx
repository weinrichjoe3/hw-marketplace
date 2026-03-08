import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ImageGallery } from "./ImageGallery";
import { CommentSection } from "./CommentSection";
import { SidebarActions } from "./SidebarActions";

interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  series: string | null;
  year: string | null;
  condition: string | null;
  price: number;
  images: string[] | null;
  open_to_trades: boolean;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    created_at: string;
  } | null;
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles(display_name, created_at)")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const l = listing as unknown as ListingDetail;
  const images = l.images?.length ? l.images : [];
  const sellerName = l.profiles?.display_name ?? "Anonymous";
  const memberSince = l.profiles?.created_at
    ? new Date(l.profiles.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const details = [
    { label: "Series", value: l.series },
    { label: "Year", value: l.year },
    { label: "Condition", value: l.condition },
    { label: "Price", value: `$${l.price}` },
  ].filter((d) => d.value);

  return (
    <div className="bg-white">
      {/* Image Gallery */}
      <ImageGallery images={images} title={l.title} />

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">
          {/* Left column */}
          <div className="min-w-0">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{l.title}</h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {l.series && (
                <span className="rounded-full bg-royal-blue/10 px-3.5 py-1 text-xs font-semibold text-royal-blue">
                  {l.series}
                </span>
              )}
              {l.year && (
                <span className="rounded-full bg-gray-100 px-3.5 py-1 text-xs font-semibold text-gray-600">
                  {l.year}
                </span>
              )}
              {l.condition && (
                <span className="rounded-full bg-gray-100 px-3.5 py-1 text-xs font-semibold text-gray-600">
                  {l.condition}
                </span>
              )}
              {l.open_to_trades && (
                <span className="rounded-full bg-green-50 px-3.5 py-1 text-xs font-semibold text-green-700">
                  Open to Trades
                </span>
              )}
            </div>

            {/* Seller info bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-royal-blue/10 flex items-center justify-center text-royal-blue font-bold text-sm">
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{sellerName}</p>
                <p className="text-xs text-gray-500">Member since {memberSince}</p>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">About this listing</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {l.description || "No description provided."}
              </p>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Details grid */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {details.map((d) => (
                  <div key={d.label}>
                    <p className="text-xs text-gray-500 mb-0.5">{d.label}</p>
                    <p className="text-sm font-medium">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Comments */}
            <CommentSection listingId={l.id} />
          </div>

          {/* Right column — sticky sidebar */}
          <div className="hidden lg:block">
            <SidebarActions
              price={l.price}
              openToTrades={l.open_to_trades}
              sellerName={sellerName}
              memberSince={memberSince}
              listingId={l.id}
            />
          </div>
        </div>

        {/* Mobile price bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-xl font-bold">${l.price}</p>
          </div>
          <button className="flex-1 rounded-lg bg-sky-blue px-4 py-3 text-sm font-semibold text-white hover:bg-sky-blue/90 transition-colors">
            Make an Offer
          </button>
        </div>
      </div>
    </div>
  );
}
