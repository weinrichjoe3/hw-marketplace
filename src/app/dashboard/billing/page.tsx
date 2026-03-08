export default function BillingPage() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-1">Billing</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your subscription and payment method</p>

      {/* Current Plan */}
      <div className="rounded-xl border border-card-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="text-lg font-bold mt-1">Free</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            Active
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Browse listings and message sellers. Upgrade to Seller to create your own listings.
        </p>
      </div>

      {/* Upgrade Card */}
      <div className="rounded-xl border-2 border-hw-blue/20 bg-hw-blue/5 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold">Seller Plan</h2>
              <span className="rounded-full bg-hw-yellow px-2.5 py-0.5 text-xs font-semibold text-black">
                Recommended
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">
              $10<span className="text-sm font-normal text-gray-500">/month</span>
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {[
            "Create unlimited listings with photos",
            "Access seller analytics and insights",
            "Priority placement in search results",
            "Direct messaging with buyers",
            "Accept offers and trade proposals",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button className="mt-6 w-full sm:w-auto rounded-lg bg-hw-yellow px-8 py-3 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors">
          Upgrade to Seller — $10/mo
        </button>
      </div>

      {/* Payment Method */}
      <div className="rounded-xl border border-card-border p-6">
        <h3 className="text-base font-semibold mb-4">Payment Method</h3>
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No payment method on file</p>
          <p className="text-xs text-gray-400 mt-1">Add a payment method to upgrade your plan</p>
        </div>
      </div>
    </div>
  );
}
