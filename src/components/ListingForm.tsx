"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SERIES_OPTIONS = [
  "Treasure Hunt", "Red Line Club", "Car Culture", "Super Treasure Hunt",
  "Convention Exclusive", "Boulevard", "Team Transport", "Mainline", "Premium", "Other",
];

const CONDITION_OPTIONS = [
  "Mint / Carded", "Near Mint / Carded", "Mint / Loose",
  "Excellent / Loose", "Good / Loose", "Poor",
];

interface ListingData {
  id?: string;
  title: string;
  description: string;
  series: string;
  year: string;
  condition: string;
  price: string;
  open_to_trades: boolean;
  images: string[];
}

export function ListingForm({
  initial,
  userId,
}: {
  initial?: ListingData;
  userId: string;
}) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [series, setSeries] = useState(initial?.series ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [condition, setCondition] = useState(initial?.condition ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [openToTrades, setOpenToTrades] = useState(initial?.open_to_trades ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 8 - imageUrls.length;
    if (remaining <= 0) {
      setError("Maximum 8 images allowed");
      return;
    }

    setUploading(true);
    setError("");
    const supabase = createClient();
    const newUrls: string[] = [];

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("listing-images")
        .upload(path, file);

      if (uploadErr) {
        setError(`Upload failed: ${uploadErr.message}`);
        break;
      }

      const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    setImageUrls((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const payload = {
      seller_id: userId,
      title,
      description,
      series: series || null,
      year: year || null,
      condition: condition || null,
      price: parseFloat(price),
      images: imageUrls,
      open_to_trades: openToTrades,
      updated_at: new Date().toISOString(),
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from("listings")
        .update(payload)
        .eq("id", initial!.id);
      if (err) {
        setError(err.message);
        setSubmitting(false);
        return;
      }
      router.push(`/listings/${initial!.id}`);
    } else {
      const { data, error: err } = await supabase
        .from("listings")
        .insert(payload)
        .select("id")
        .single();
      if (err) {
        setError(err.message);
        setSubmitting(false);
        return;
      }
      router.push(`/listings/${data.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Photos <span className="text-gray-400">({imageUrls.length}/8)</span>
        </label>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-card-border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80"
              >
                &times;
              </button>
            </div>
          ))}
          {imageUrls.length < 8 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
            >
              {uploading ? (
                <span className="text-xs">Uploading...</span>
              ) : (
                <>
                  <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">Add</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">Title</label>
        <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. '71 Datsun 510 — Car Culture"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue" />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="desc" className="block text-sm font-medium mb-1.5">Description</label>
        <textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the item, its history, any flaws..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue resize-none" />
      </div>

      {/* Series + Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="series" className="block text-sm font-medium mb-1.5">Series</label>
          <select id="series" value={series} onChange={(e) => setSeries(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue bg-white">
            <option value="">Select series</option>
            {SERIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1.5">Year</label>
          <input id="year" type="text" value={year} onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2024"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue" />
        </div>
      </div>

      {/* Condition + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium mb-1.5">Condition</label>
          <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue bg-white">
            <option value="">Select condition</option>
            {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5">Price ($)</label>
          <input id="price" type="number" required min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue" />
        </div>
      </div>

      {/* Open to Trades */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={openToTrades} onChange={(e) => setOpenToTrades(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue" />
        <span className="text-sm font-medium">Open to trades</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-cta-yellow py-3 text-sm font-semibold text-black hover:bg-cta-yellow-hover transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEdit ? "Update Listing" : "Publish Listing"}
      </button>
    </form>
  );
}
