import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListingsFilters } from "./ListingsFilters";

interface Listing {
  id: string;
  title: string;
  series: string | null;
  condition: string | null;
  price: number;
  images: string[] | null;
  created_at: string;
  seller_id: string;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const series = params.series ?? "";
  const condition = params.condition ?? "";
  const sort = params.sort ?? "newest";

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("id, title, series, condition, price, images, created_at, seller_id")
    .eq("status", "active");

  if (search) query = query.ilike("title", `%${search}%`);
  if (series) query = query.eq("series", series);
  if (condition) query = query.eq("condition", condition);

  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  const listings = (data as Listing[]) ?? [];

  // Fetch seller names for all listings
  const sellerIds = [...new Set(listings.map((l) => l.seller_id))];
  let sellerMap = new Map<string, string>();
  if (sellerIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", sellerIds);
    sellerMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.display_name ?? "Anonymous"])
    );
  }

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
      <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
      <p className="text-gray-500 mb-8">Find your next grail piece from verified sellers</p>

      {/* Filters */}
      <ListingsFilters
        currentSearch={search}
        currentSeries={series}
        currentCondition={condition}
        currentSort={sort}
      />

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        Showing {listings.length} listing{listings.length !== 1 ? "s" : ""}
      </p>

      {/* Listing Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {listings.map((listing) => {
            const img = listing.images?.[0];
            const seller = sellerMap.get(listing.seller_id) ?? "Anonymous";
            return (
              <div
                key={listing.id}
                className="group rounded-xl border border-card-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/listings/${listing.id}`}>
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
                        <span className="rounded-full bg-hw-red/90 px-3 py-0.5 text-xs font-medium text-white">
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
                </Link>
                <div className="p-3 md:p-4">
                  <Link href={`/listings/${listing.id}`}>
                    <h3 className="font-semibold text-sm md:text-base group-hover:text-hw-red transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-1.5 md:mt-2">
                    <p className="text-base md:text-lg font-bold">${listing.price}</p>
                    <span className="text-xs text-gray-400">{timeAgo(listing.created_at)}</span>
                  </div>
                  <Link
                    href={`/sellers/${listing.seller_id}`}
                    className="text-xs text-gray-400 hover:text-hw-blue transition-colors mt-1 inline-block"
                  >
                    by {seller}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
