import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listing_id, type, amount, trade_listing_id, message } = body;

    if (!listing_id || !type) {
      return NextResponse.json(
        { error: "listing_id and type are required" },
        { status: 400 }
      );
    }

    // Get the listing to find the receiver (seller)
    const { data: listing, error: listingErr } = await supabase
      .from("listings")
      .select("seller_id")
      .eq("id", listing_id)
      .single();

    if (listingErr || !listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.seller_id === user.id) {
      return NextResponse.json(
        { error: "You cannot make an offer on your own listing" },
        { status: 400 }
      );
    }

    const { data: offer, error: insertErr } = await supabase
      .from("offers")
      .insert({
        listing_id,
        sender_id: user.id,
        receiver_id: listing.seller_id,
        type,
        amount: type === "cash" ? amount : null,
        trade_listing_id: type === "trade" ? trade_listing_id : null,
        message: message || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ id: offer.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
