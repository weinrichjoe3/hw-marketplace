import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Get counts
  const [
    { count: totalUsers },
    { count: totalListings },
    { count: activeListings },
    { count: pendingReports },
    { data: recentUsers },
    { data: recentListings },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id, display_name, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("listings").select("id, title, price, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers ?? 0, color: "bg-blue-500" },
    { label: "Total Listings", value: totalListings ?? 0, color: "bg-green-500" },
    { label: "Active Listings", value: activeListings ?? 0, color: "bg-emerald-500" },
    { label: "Pending Reports", value: pendingReports ?? 0, color: "bg-red-500", href: "/admin/reports" },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">Admin Overview</h1>
      <p className="text-sm text-gray-500 mb-8">Platform statistics at a glance</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const content = (
            <div key={stat.label} className="rounded-xl border border-card-border bg-white p-5">
              <div className={`w-2 h-2 rounded-full ${stat.color} mb-3`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
          if (stat.href) return <Link key={stat.label} href={stat.href}>{content}</Link>;
          return <div key={stat.label}>{content}</div>;
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-xl border border-card-border bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Signups</h2>
            <Link href="/admin/users" className="text-xs text-hw-blue hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(recentUsers ?? []).map((u: { id: string; display_name: string | null; created_at: string }) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hw-blue/10 flex items-center justify-center text-hw-blue text-xs font-bold">
                    {(u.display_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{u.display_name ?? "No name"}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(recentUsers ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="rounded-xl border border-card-border bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Listings</h2>
            <Link href="/admin/listings" className="text-xs text-hw-blue hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(recentListings ?? []).map((l: { id: string; title: string; price: number; created_at: string }) => (
              <div key={l.id} className="flex items-center justify-between">
                <Link href={`/listings/${l.id}`} className="text-sm font-medium hover:text-hw-blue transition-colors truncate max-w-[200px]">
                  {l.title}
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">${l.price}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(l.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {(recentListings ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No listings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
