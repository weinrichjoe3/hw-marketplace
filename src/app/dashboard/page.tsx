"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { key: "listings", label: "My Listings", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { key: "inbox", label: "Inbox", icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { key: "billing", label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { key: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const STATS = [
  { label: "Active Listings", value: "0" },
  { label: "Total Views", value: "0" },
  { label: "Messages", value: "0" },
  { label: "Revenue", value: "$0" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-100 bg-gray-50/50 p-4">
        <div className="mb-6 px-3">
          <p className="text-sm font-semibold text-gray-900">Dashboard</p>
          <p className="text-xs text-gray-400 mt-0.5">Manage your account</p>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-royal-blue text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Mobile nav */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-royal-blue text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h1>

        {activeTab === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-card-border p-5">
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Empty State */}
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Upgrade to a Seller account to create listings, access analytics, and start selling to thousands of collectors.
              </p>
              <Link
                href="/how-it-works"
                className="inline-block rounded-lg bg-cta-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
              >
                Upgrade to Seller — $10/mo
              </Link>
            </div>
          </>
        )}

        {activeTab === "listings" && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-400">Upgrade to a Seller account to create and manage listings.</p>
          </div>
        )}

        {activeTab === "inbox" && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-400">No messages yet. Start browsing to connect with sellers.</p>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-400">You are on the Free plan. Upgrade to unlock seller features.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium mb-1.5">Display Name</label>
              <input
                type="text"
                placeholder="Your name"
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
            <button className="rounded-lg bg-royal-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
