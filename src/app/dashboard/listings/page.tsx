import Link from "next/link";

export default function MyListingsPage() {
  return (
    <div className="p-4 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Listings</h1>
          <p className="text-sm text-gray-500">Manage your active and draft listings</p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="rounded-lg bg-hw-yellow px-4 py-2.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors min-h-[44px] flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Listing
        </Link>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 md:p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
          Create your first listing to start selling to thousands of Hot Wheels collectors.
        </p>
        <Link
          href="/dashboard/listings/new"
          className="inline-block rounded-lg bg-hw-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors min-h-[44px]"
        >
          Create Your First Listing
        </Link>
      </div>
    </div>
  );
}
