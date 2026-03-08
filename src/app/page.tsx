import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListingCard, type Listing } from "@/components/ListingCard";

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

export default async function HomePage() {
  let featured: Listing[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("listings")
      .select("id, title, series, year, condition, price, images, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6);
    featured = (data as Listing[]) ?? [];
  } catch {
    // listings table may not exist yet
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            The Premium{" "}
            <span className="bg-gradient-to-r from-sky-blue to-royal-blue bg-clip-text text-transparent">
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
            className="inline-block rounded-lg bg-cta-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
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
                <p className="text-2xl md:text-3xl font-bold text-royal-blue">{s.value}</p>
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
            <Link href="/listings" className="text-sm font-medium text-royal-blue hover:underline hidden sm:block">
              View All &rarr;
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p>No listings yet. Be the first to sell!</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Getting started is simple. Join thousands of collectors buying and selling on HW Marketplace.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-8 border border-card-border">
                <span className="text-3xl font-bold text-sky-blue">{s.step}</span>
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
              className="absolute text-cta-yellow text-xs"
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
            className="inline-block rounded-lg bg-cta-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
