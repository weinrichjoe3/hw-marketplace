import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ImageGallery } from "./ImageGallery";
import { CommentSection } from "./CommentSection";
import { SidebarActions } from "./SidebarActions";
import { MobileShare } from "./MobileShare";

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
  seller_id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("title, description, price, images")
    .eq("id", id)
    .single();

  if (!listing) return { title: "Listing Not Found" };

  const l = listing as { title: string; description: string | null; price: number; images: string[] | null };
  const desc = l.description
    ? `${l.description.slice(0, 150)} — $${l.price}`
    : `$${l.price} on HW Swap and Shop`;
  const image = l.images?.[0];

  return {
    title: `${l.title} — HW Swap and Shop`,
    description: desc,
    openGraph: {
      title: l.title,
      description: desc,
      ...(image && { images: [{ url: image }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: l.title,
      description: desc,
      ...(image && { images: [image] }),
    },
  };
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
    .select("*")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const l = listing as unknown as ListingDetail;
  const images = l.images?.length ? l.images : [];

  // Fetch seller profile separately (no direct FK between listings and profiles)
  let sellerName = "Anonymous";
  let memberSince = "Unknown";
  if (l.seller_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, created_at")
      .eq("id", l.seller_id)
      .single();
    if (profile) {
      sellerName = profile.display_name ?? "Anonymous";
      memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  }

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">
          {/* Left column */}
          <div className="min-w-0">
            {/* Title */}
            <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">{l.title}</h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {l.series && (
                <span className="rounded-full bg-hw-blue/10 px-3.5 py-1 text-xs font-semibold text-hw-blue">
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

            {/* Mobile price display */}
            <div className="lg:hidden mb-4">
              <p className="text-2xl font-bold">${l.price}</p>
            </div>

            {/* Seller info bar — shows on mobile between badges and description */}
            <Link href={`/sellers/${l.seller_id}`} className="flex items-center gap-3 mb-4 md:mb-6 group">
              <div className="w-10 h-10 rounded-full bg-hw-blue/10 flex items-center justify-center text-hw-blue font-bold text-sm">
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold group-hover:text-hw-red transition-colors">{sellerName}</p>
                <p className="text-xs text-gray-500">Member since {memberSince}</p>
              </div>
            </Link>

            <hr className="border-gray-100 mb-6 md:mb-8" />

            {/* Description */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg font-semibold mb-3">About this listing</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {l.description || "No description provided."}
              </p>
            </div>

            <hr className="border-gray-100 mb-6 md:mb-8" />

            {/* Details grid */}
            <div className="mb-6 md:mb-8">
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

            {/* Mobile Share */}
            <MobileShare title={l.title} price={l.price} />

            <hr className="border-gray-100 mb-6 md:mb-8" />

            {/* Comments */}
            <div className="mb-20 lg:mb-0">
              <CommentSection listingId={l.id} />
            </div>
          </div>

          {/* Right column — sticky sidebar (desktop only) */}
          <div className="hidden lg:block">
            <SidebarActions
              price={l.price}
              openToTrades={l.open_to_trades}
              sellerName={sellerName}
              memberSince={memberSince}
              listingId={l.id}
              sellerId={l.seller_id}
              listingTitle={l.title}
              listingImage={images[0] ?? null}
            />
          </div>
        </div>

        {/* Mobile sticky bottom bar with both action buttons */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 safe-area-bottom">
          <SidebarActions
            price={l.price}
            openToTrades={l.open_to_trades}
            sellerName={sellerName}
            memberSince={memberSince}
            listingId={l.id}
            sellerId={l.seller_id}
            listingTitle={l.title}
            listingImage={images[0] ?? null}
            mobileMode
          />
        </div>
      </div>
    </div>
  );
}
