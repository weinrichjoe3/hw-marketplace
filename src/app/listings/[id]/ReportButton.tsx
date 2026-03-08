"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ReportButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleOpen() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setReason("");
    setDetails("");
    setError("");
    setSuccess(false);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setShowModal(false);
    document.body.style.overflow = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) { setError("Please select a reason."); return; }
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("reports").insert({
      listing_id: listingId,
      reporter_id: user?.id,
      reason,
      details: details.trim() || null,
    });

    setLoading(false);
    if (err) { setError(err.message); } else {
      setSuccess(true);
      setTimeout(handleClose, 1500);
    }
  }

  return (
    <>
      <button onClick={handleOpen} className="lg:hidden text-xs text-gray-400 hover:text-red-500 transition-colors">
        Report this listing
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/50 animate-fade-in"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full md:rounded-2xl md:max-w-md md:mx-4 rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up md:animate-none safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">Report submitted</p>
                <p className="text-sm text-gray-500 mt-1">We&apos;ll review this listing shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Report Listing</h3>
                  <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <label className="block text-sm font-medium mb-1.5">Reason</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]" required>
                  <option value="">Select a reason</option>
                  <option value="Fake or misleading">Fake or misleading</option>
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Suspected scam">Suspected scam</option>
                  <option value="Counterfeit item">Counterfeit item</option>
                  <option value="Duplicate listing">Duplicate listing</option>
                  <option value="Other">Other</option>
                </select>
                <label className="block text-sm font-medium mb-1.5">Additional details (optional)</label>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Provide more context..." rows={3} className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue" />
                {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-red-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 min-h-[44px]">
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
