const PLACEHOLDER_LISTINGS = [
  { id: "1", title: "'71 Datsun 510 — Super Treasure Hunt", series: "Super Treasure Hunt", condition: "Mint / Carded", price: 185, color: "bg-red-100" },
  { id: "2", title: "'55 Chevy Bel Air Gasser — RLC", series: "Red Line Club", condition: "Near Mint", price: 320, color: "bg-blue-100" },
  { id: "3", title: "Porsche 911 GT3 RS — Car Culture", series: "Car Culture", condition: "Mint / Loose", price: 42, color: "bg-yellow-100" },
  { id: "4", title: "Custom '62 Chevy Pickup — Convention", series: "Convention", condition: "Mint / Carded", price: 275, color: "bg-green-100" },
  { id: "5", title: "Nissan Skyline GT-R (R34) — Boulevard", series: "Boulevard", condition: "Excellent", price: 58, color: "bg-purple-100" },
  { id: "6", title: "Mercedes-Benz 300 SL — Team Transport", series: "Team Transport", condition: "Mint / Carded", price: 95, color: "bg-orange-100" },
  { id: "7", title: "Toyota AE86 Sprinter Trueno — Premium", series: "Premium", condition: "Near Mint", price: 38, color: "bg-pink-100" },
  { id: "8", title: "'69 Dodge Charger Daytona — Mainline", series: "Mainline", condition: "Mint / Carded", price: 12, color: "bg-cyan-100" },
  { id: "9", title: "Lamborghini Countach — Treasure Hunt", series: "Treasure Hunt", condition: "Excellent", price: 125, color: "bg-amber-100" },
];

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
      <p className="text-gray-500 mb-8">Find your next grail piece from verified sellers</p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, series, or condition..."
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      {/* Listing Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLACEHOLDER_LISTINGS.map((listing) => (
          <div
            key={listing.id}
            className="group rounded-xl border border-card-border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`aspect-[4/3] ${listing.color} relative overflow-hidden flex items-center justify-center`}>
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-royal-blue/90 px-3 py-0.5 text-xs font-medium text-white">
                  {listing.series}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-white/90 px-3 py-0.5 text-xs font-medium text-gray-700">
                  {listing.condition}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base group-hover:text-royal-blue transition-colors line-clamp-1">
                {listing.title}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-bold">${listing.price}</p>
                <span className="text-xs text-gray-400">2d ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
