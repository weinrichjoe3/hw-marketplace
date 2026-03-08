"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  display_name: string | null;
  is_seller: boolean;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, is_seller, is_admin, is_banned, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setUsers((data as AdminUser[]) ?? []);
    setLoading(false);
  }

  async function toggleField(id: string, field: "is_seller" | "is_admin" | "is_banned", current: boolean) {
    const label = field === "is_banned" ? "ban" : field === "is_admin" ? "admin" : "seller";
    const action = current ? `Remove ${label} from` : `Grant ${label} to`;
    if (!confirm(`${action} this user?`)) return;

    await supabase.from("profiles").update({ [field]: !current }).eq("id", id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: !current } : u))
    );
  }

  const filtered = users.filter((u) =>
    (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">Manage Users</h1>
      <p className="text-sm text-gray-500 mb-6">View and manage user roles</p>

      <input
        type="text"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
      />

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading users...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No users found</div>
      ) : (
        <div className="rounded-xl border border-card-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Seller</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Admin</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Banned</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{user.display_name ?? "No name"}</p>
                        <p className="text-xs text-gray-400 font-mono">{user.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(user.id, "is_seller", user.is_seller)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          user.is_seller ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          user.is_seller ? "translate-x-5" : "translate-x-1"
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(user.id, "is_admin", user.is_admin)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          user.is_admin ? "bg-hw-blue" : "bg-gray-200"
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          user.is_admin ? "translate-x-5" : "translate-x-1"
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(user.id, "is_banned", user.is_banned)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          user.is_banned ? "bg-red-500" : "bg-gray-200"
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          user.is_banned ? "translate-x-5" : "translate-x-1"
                        }`} />
                      </button>
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
