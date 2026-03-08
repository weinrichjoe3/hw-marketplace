"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Report {
  id: string;
  listing_id: string;
  reporter_id: string | null;
  reason: string;
  details: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function AdminReportsPage() {
  const supabase = createClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  async function loadReports() {
    setLoading(true);
    let query = supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data } = await query;
    setReports((data as Report[]) ?? []);
    setLoading(false);
  }

  async function updateReport(id: string, status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("reports")
      .update({
        status,
        admin_notes: adminNotes.trim() || null,
        reviewed_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, admin_notes: adminNotes.trim() || null } : r))
    );
    setExpandedId(null);
    setAdminNotes("");
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    dismissed: "bg-gray-100 text-gray-600",
    action_taken: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">Reports</h1>
      <p className="text-sm text-gray-500 mb-6">Review flagged listings</p>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {["pending", "reviewed", "action_taken", "dismissed", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === s ? "bg-hw-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "action_taken" ? "Action Taken" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No {statusFilter === "all" ? "" : statusFilter} reports</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-card-border bg-white overflow-hidden">
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[report.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1">Reason: {report.reason}</p>
                    {report.details && (
                      <p className="text-sm text-gray-600">{report.details}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Link
                        href={`/listings/${report.listing_id}`}
                        className="text-xs text-hw-blue hover:underline"
                      >
                        View Listing
                      </Link>
                      {report.admin_notes && (
                        <span className="text-xs text-gray-400">Note: {report.admin_notes}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setExpandedId(expandedId === report.id ? null : report.id);
                      setAdminNotes(report.admin_notes ?? "");
                    }}
                    className="shrink-0 text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {expandedId === report.id ? "Close" : "Review"}
                  </button>
                </div>
              </div>

              {expandedId === report.id && (
                <div className="border-t border-gray-100 p-4 md:p-5 bg-gray-50/50">
                  <label className="block text-sm font-medium mb-1.5">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateReport(report.id, "reviewed")}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => updateReport(report.id, "action_taken")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                    >
                      Action Taken
                    </button>
                    <button
                      onClick={() => updateReport(report.id, "dismissed")}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
