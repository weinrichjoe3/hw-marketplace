import Link from "next/link";

export default function MyListingsPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Listings</h1>
          <p className="text-sm text-gray-500">Manage your active and draft listings</p>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
          Upgrade to a Seller account to create listings and start selling to thousands of collectors.
        </p>
        <Link
          href="/dashboard/billing"
          className="inline-block rounded-lg bg-hw-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors"
        >
          Upgrade to Seller — $10/mo
        </Link>
      </div>
    </div>
  );
}
