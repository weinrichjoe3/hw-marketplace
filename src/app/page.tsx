import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface FeaturedListing {
  id: string;
  title: string;
  series: string | null;
  condition: string | null;
  price: number;
  images: string[] | null;
  created_at: string;
}

const STATS = [
  { label: "Active Listings", value: "12,400+" },
  { label: "Verified Sellers", value: "3,200+" },
  { label: "Trades Completed", value: "48,000+" },
  { label: "Avg Response Time", value: "< 2 hrs" },
];

const STEPS = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up for free in under 30 seconds. Browse thousands of listings immediately.",
  },
  {
    step: "02",
    title: "Find or List Your Cars",
    description: "Search by series, condition, or price. Sellers can list with photos and detailed descriptions.",
  },
  {
    step: "03",
    title: "Complete the Deal",
    description: "Message sellers directly, agree on terms, and complete your transaction securely.",
  },
];

const FEATURED = [
  { id: "1", title: "'71 Datsun 510 — Super Treasure Hunt", series: "Super Treasure Hunt", condition: "Mint / Carded", price: 185, color: "bg-red-100" },
  { id: "2", title: "'55 Chevy Bel Air Gasser — RLC", series: "Red Line Club", condition: "Near Mint", price: 320, color: "bg-blue-100" },
  { id: "3", title: "Porsche 911 GT3 RS — Car Culture", series: "Car Culture", condition: "Mint / Loose", price: 42, color: "bg-yellow-100" },
  { id: "4", title: "Custom '62 Chevy Pickup — Convention", series: "Convention", condition: "Mint / Carded", price: 275, color: "bg-green-100" },
  { id: "5", title: "Nissan Skyline GT-R (R34) — Boulevard", series: "Boulevard", condition: "Excellent", price: 58, color: "bg-purple-100" },
  { id: "6", title: "Mercedes-Benz 300 SL — Team Transport", series: "Team Transport", condition: "Mint / Carded", price: 95, color: "bg-orange-100" },
];

export default async function HomePage() {
  let featured: FeaturedListing[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("listings")
      .select("id, title, series, condition, price, images, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6);
    featured = (data as FeaturedListing[]) ?? [];
  } catch {
    // DB may not be set up yet — use static fallback
  }

  const showFromDb = featured.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-hw-blue text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            The Ultimate{" "}
            <span className="bg-gradient-to-r from-hw-red to-hw-yellow bg-clip-text text-transparent">
              Hot Wheels
            </span>{" "}
            Marketplace
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Buy, sell, and trade collectible Hot Wheels with verified sellers.
            The trusted destination for serious collectors.
          </p>
          <Link
            href="/listings"
            className="inline-block rounded-lg bg-hw-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-hw-yellow-hover transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold text-hw-red">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Listings</h2>
              <p className="text-gray-500 mt-2">Hand-picked collectibles trending this week</p>
            </div>
            <Link href="/listings" className="text-sm font-medium text-hw-blue hover:underline hidden sm:block">
              View All &rarr;
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showFromDb ? featured : FEATURED).map((listing) => {
              const img = "images" in listing ? (listing as FeaturedListing).images?.[0] : null;
              const color = "color" in listing ? (listing as (typeof FEATURED)[number]).color : "bg-gray-100";
              return (
                <Link
                  key={listing.id}
                  href={showFromDb ? `/listings/${listing.id}` : "/listings"}
                  className="group rounded-xl border border-card-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`aspect-[4/3] ${img ? "bg-gray-100" : color} relative overflow-hidden flex items-center justify-center`}>
                    {img ? (
                      <img src={img} alt={listing.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
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
                      <span className="text-xs text-gray-400">2d ago</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Getting started is simple. Join thousands of collectors buying and selling on HW Swap and Shop.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-8 border border-card-border">
                <span className="text-3xl font-bold text-hw-red">{s.step}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-hw-yellow text-xs"
              style={{
                top: `${Math.floor((i * 37) % 100)}%`,
                left: `${Math.floor((i * 53) % 100)}%`,
              }}
            >
              &#9733;
            </span>
          ))}
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Collecting Today
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Join our growing community of Hot Wheels enthusiasts. Create a free account and start browsing in seconds.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-hw-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-hw-yellow-hover transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
