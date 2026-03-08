"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface MyListing {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  images: string[] | null;
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("listings")
          .select("id, title, price, status, created_at, images")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });
        setListings(data ?? []);
      } catch {
        // ok
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          href="/dashboard/listings/new"
          className="rounded-lg bg-cta-yellow px-5 py-2.5 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
        >
          + New Listing
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">You haven&apos;t created any listings yet.</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-block rounded-lg bg-cta-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Listing</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Price</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Created</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {l.images?.[0] ? (
                          <img src={l.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <Link href={`/listings/${l.id}`} className="font-medium hover:text-royal-blue line-clamp-1">
                        {l.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell font-medium">${l.price}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      l.status === "active" ? "bg-green-100 text-green-700" :
                      l.status === "sold" ? "bg-gray-100 text-gray-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/listings/${l.id}/edit`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(l.id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
