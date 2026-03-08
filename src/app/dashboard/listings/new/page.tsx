"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PhotoUploader } from "@/components/PhotoUploader";
import type { PhotoItem } from "@/components/PhotoUploader";

const SERIES_OPTIONS = [
  "Treasure Hunt",
  "Super Treasure Hunt",
  "Red Line Club",
  "Car Culture",
  "Boulevard",
  "Team Transport",
  "Convention Exclusive",
  "Mainline",
  "Premium",
  "Other",
];

const CONDITION_OPTIONS = [
  "Mint / Carded",
  "Near Mint / Carded",
  "Mint / Loose",
  "Excellent / Loose",
  "Good / Loose",
  "Poor",
];

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [series, setSeries] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [openToTrades, setOpenToTrades] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login?returnTo=/dashboard/listings/new");
      } else {
        setUserId(data.user.id);
      }
    });
  }, []);

  const handleUpload = useCallback(
    async (blob: Blob, filename: string, onProgress: (pct: number) => void) => {
      onProgress(10);
      const path = `listings/${userId}/${filename}`;

      onProgress(30);
      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(path, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      onProgress(80);
      const { data: urlData } = supabase.storage
        .from("listing-photos")
        .getPublicUrl(path);

      onProgress(100);
      return urlData.publicUrl;
    },
    [supabase, userId]
  );

  // Wrap setPhotos to support functional updates
  const handlePhotosChange = useCallback((updater: PhotoItem[] | ((prev: PhotoItem[]) => PhotoItem[])) => {
    if (typeof updater === "function") {
      setPhotos(updater);
    } else {
      setPhotos(updater);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setError("");

    const priceNum = parseFloat(price);
    if (!priceNum || priceNum <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    const uploadedPhotos = photos.filter((p) => p.uploaded && p.url);
    if (uploadedPhotos.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase.from("listings").insert({
      title: title.trim(),
      description: description.trim() || null,
      series: series || null,
      year: year.trim() || null,
      condition: condition || null,
      price: priceNum,
      open_to_trades: openToTrades,
      images: uploadedPhotos.map((p) => p.url),
      seller_id: userId,
      status: "active",
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/dashboard/listings");
    router.refresh();
  }

  return (
    <div className="p-4 md:p-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Create Listing</h1>
      <p className="text-sm text-gray-500 mb-8">Add a new Hot Wheels listing with photos</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photos */}
        <PhotoUploader
          photos={photos}
          onChange={handlePhotosChange}
          onUpload={handleUpload}
        />

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. '71 Datsun 510 — Super Treasure Hunt"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item in detail — condition notes, history, defects, etc."
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base resize-none focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue"
          />
        </div>

        {/* Series + Condition row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Series</label>
            <select
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
            >
              <option value="">Select series...</option>
              {SERIES_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
            >
              <option value="">Select condition...</option>
              {CONDITION_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Year + Price row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2024"
              className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Price ($) *</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-hw-blue/30 focus:border-hw-blue min-h-[44px]"
            />
          </div>
        </div>

        {/* Open to trades */}
        <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
          <input
            type="checkbox"
            checked={openToTrades}
            onChange={(e) => setOpenToTrades(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-hw-blue focus:ring-hw-blue"
          />
          <span className="text-sm font-medium">Open to trades</span>
        </label>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto rounded-lg bg-hw-yellow px-8 py-3.5 text-sm font-semibold text-black hover:bg-hw-yellow-hover transition-colors disabled:opacity-50 min-h-[44px]"
        >
          {submitting ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
