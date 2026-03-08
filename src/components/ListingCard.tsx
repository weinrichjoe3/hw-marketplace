import Link from "next/link";

export interface Listing {
  id: string;
  title: string;
  series: string | null;
  year: string | null;
  condition: string | null;
  price: number;
  images: string[] | null;
  created_at: string;
}

export function ListingCard({ listing }: { listing: Listing }) {
  const img = listing.images?.[0];
  const ago = timeAgo(listing.created_at);

  return (
    <Link
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
      <div className="p-4">
        <h3 className="font-semibold text-base group-hover:text-hw-red transition-colors line-clamp-1">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold">${listing.price}</p>
          <span className="text-xs text-gray-400">{ago}</span>
        </div>
      </div>
    </Link>
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
