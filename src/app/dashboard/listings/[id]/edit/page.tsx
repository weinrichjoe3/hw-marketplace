"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ListingForm } from "@/components/ListingForm";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [listing, setListing] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }
        setUserId(user.id);

        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .single();

        if (!data || data.seller_id !== user.id) {
          router.push("/dashboard/listings");
          return;
        }
        setListing(data);
      } catch {
        router.push("/dashboard/listings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading || !listing) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse h-8 w-48 bg-gray-100 rounded mb-6" />
        <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <div className="rounded-2xl border border-card-border bg-white p-6 md:p-8">
        <ListingForm
          userId={userId!}
          initial={{
            id: listing.id as string,
            title: listing.title as string,
            description: (listing.description as string) ?? "",
            series: (listing.series as string) ?? "",
            year: (listing.year as string) ?? "",
            condition: (listing.condition as string) ?? "",
            price: String(listing.price),
            open_to_trades: (listing.open_to_trades as boolean) ?? false,
            images: (listing.images as string[]) ?? [],
          }}
        />
      </div>
    </div>
  );
}
