export default function SettingsPage() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your account preferences</p>

      <div className="max-w-2xl space-y-8">
        {/* Profile */}
        <div className="rounded-xl border border-card-border p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Display Name</label>
              <input
                type="text"
                placeholder="Your display name"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-card-border p-6">
          <h2 className="font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            {["New messages", "Price drops on watched items", "Weekly digest"].map((label) => (
              <label key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-200 p-6">
          <h2 className="font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
