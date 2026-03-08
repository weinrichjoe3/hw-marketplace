import Link from "next/link";

const VALUE_PROPS = [
  {
    title: "Unlimited Listings",
    description: "Post as many cars as you want. No per-listing charges.",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    title: "Reach Real Collectors",
    description: "Your listings are seen by thousands of verified Hot Wheels enthusiasts.",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
  {
    title: "Direct Offers",
    description: "No auctions or bidding wars. Receive private offers and negotiate directly.",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  },
  {
    title: "Trade-Friendly",
    description: "Open your listings to trades and grow your collection while selling.",
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  },
];

const FEATURES = [
  "Unlimited listings with photos",
  "Photo uploads (up to 10 per listing)",
  "Offer inbox with notifications",
  "Trade proposal system",
  "Seller profile page",
  "Billing portal",
];

const TESTIMONIALS = [
  {
    name: "DiecastDave",
    quote: "I listed 30 cars in my first week and sold 12 of them. The direct offer system is so much better than dealing with auction sites.",
  },
  {
    name: "CollectorKay",
    quote: "Finally a platform built for Hot Wheels collectors. The trade feature alone is worth the subscription — I've completed over 50 trades.",
  },
  {
    name: "RLCMike",
    quote: "The $10/month is a no-brainer. No listing fees, no final value fees. I save hundreds compared to other platforms.",
  },
];

export default function SellPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hw-red/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 md:mb-6 max-w-3xl mx-auto">
            Sell Your Hot Wheels to Serious Collectors
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10">
            List unlimited cars for just $10/month. No listing fees. No final value fees. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-block w-full sm:w-auto rounded-lg bg-hw-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-hw-yellow-hover transition-colors min-h-[44px]"
          >
            Start Selling Today
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Why Sell on HW Swap and Shop?</h2>
          <p className="text-gray-500 text-center mb-10 md:mb-14 max-w-xl mx-auto text-sm md:text-base">
            Everything you need to turn your collection into cash.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((vp) => (
              <div key={vp.title} className="rounded-xl border border-card-border p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-hw-red/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-hw-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={vp.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-base mb-2">{vp.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{vp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-14">Simple, Transparent Pricing</h2>
          <div className="max-w-md mx-auto rounded-2xl border-2 border-hw-blue/20 bg-white p-6 md:p-8 shadow-sm">
            <div className="text-center mb-6">
              <p className="text-4xl md:text-5xl font-bold">
                $10<span className="text-lg font-normal text-gray-500">/month</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">Cancel anytime. No contracts.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center rounded-lg bg-hw-yellow px-6 py-3.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors min-h-[44px]"
            >
              Subscribe Now
            </Link>
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            Browsing and buying is always free. The subscription is only for sellers.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-14">What Sellers Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl border border-card-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-hw-blue/10 flex items-center justify-center text-hw-blue font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <div className="flex gap-0.5 text-hw-yellow">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-dark-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hw-red/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to turn your collection into cash?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 text-sm md:text-base">
            Join thousands of sellers already listing on HW Swap and Shop.
          </p>
          <Link
            href="/signup"
            className="inline-block w-full sm:w-auto rounded-lg bg-hw-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-hw-yellow-hover transition-colors min-h-[44px]"
          >
            Start Selling Today
          </Link>
        </div>
      </section>
    </>
  );
}
