"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AdminListing {
  id: string;
  title: string;
  price: number;
  status: string;
  series: string | null;
  seller_id: string;
  created_at: string;
}

export default function AdminListingsPage() {
  const supabase = createClient();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadListings();
  }, [statusFilter]);

  async function loadListings() {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("id, title, price, status, series, seller_id, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data } = await query;
    setListings((data as AdminListing[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("listings").update({ status }).eq("id", id);
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  async function deleteListing(id: string) {
    if (!confirm("Permanently delete this listing?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">Manage Listings</h1>
      <p className="text-sm text-gray-500 mb-6">View, edit, and moderate all listings</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading listings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No listings found</div>
      ) : (
        <div className="rounded-xl border border-card-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <Link href={`/listings/${listing.id}`} className="font-medium hover:text-hw-blue transition-colors">
                        {listing.title}
                      </Link>
                      {listing.series && (
                        <span className="ml-2 text-xs text-gray-400">{listing.series}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">${listing.price}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        listing.status === "active" ? "bg-green-100 text-green-700" :
                        listing.status === "sold" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="text-xs text-hw-blue hover:underline"
                        >
                          View
                        </Link>
                        {listing.status === "active" ? (
                          <button
                            onClick={() => updateStatus(listing.id, "inactive")}
                            className="text-xs text-orange-600 hover:underline"
                          >
                            Deactivate
                          </button>
                        ) : listing.status === "inactive" ? (
                          <button
                            onClick={() => updateStatus(listing.id, "active")}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Activate
                          </button>
                        ) : null}
                        <button
                          onClick={() => deleteListing(listing.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
