import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface SellerListing {
  id: string;
  title: string;
  series: string | null;
  condition: string | null;
  price: number;
  images: string[] | null;
  created_at: string;
}

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, created_at")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const displayName = profile.display_name ?? "Anonymous";
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Fetch active listings
  const { data: listingsData } = await supabase
    .from("listings")
    .select("id, title, series, condition, price, images, created_at")
    .eq("seller_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const listings = (listingsData as SellerListing[]) ?? [];

  // Count accepted offers where they are the receiver
  const { count: completedDeals } = await supabase
    .from("offers")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", id)
    .eq("status", "accepted");

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-royal-blue/10 flex items-center justify-center text-royal-blue font-bold text-3xl">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
          <p className="text-sm text-gray-500 mt-1">Member since {memberSince}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500">Active Listings</p>
          <p className="text-2xl font-bold mt-1">{listings.length}</p>
        </div>
        <div className="rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500">Deals Completed</p>
          <p className="text-2xl font-bold mt-1">{completedDeals ?? 0}</p>
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-xl font-bold mb-6">
        Listings{" "}
        <span className="text-gray-400 font-normal text-base">({listings.length})</span>
      </h2>

      {listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const img = listing.images?.[0];
            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group rounded-xl border border-card-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={listing.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                  {listing.series && (
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-royal-blue/90 px-3 py-0.5 text-xs font-medium text-white">
                        {listing.series}
                      </span>
                    </div>
                  )}
                  {listing.condition && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-white/90 px-3 py-0.5 text-xs font-medium text-gray-700">
                        {listing.condition}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base group-hover:text-royal-blue transition-colors line-clamp-1">
                    {listing.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold">${listing.price}</p>
                    <span className="text-xs text-gray-400">{timeAgo(listing.created_at)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No active listings</p>
          <p className="text-sm mt-1">This seller doesn&apos;t have any active listings right now.</p>
        </div>
      )}
    </div>
  );
}
