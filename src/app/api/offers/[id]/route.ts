import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, counter_amount, counter_message } = body;

    // Fetch the offer
    const { data: offer, error: fetchErr } = await supabase
      .from("offers")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Only the receiver can accept/decline/counter
    if (offer.receiver_id !== user.id) {
      return NextResponse.json(
        { error: "Only the listing seller can respond to offers" },
        { status: 403 }
      );
    }

    if (offer.status !== "pending") {
      return NextResponse.json(
        { error: "This offer has already been resolved" },
        { status: 400 }
      );
    }

    let updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (action === "accept") {
      updateData.status = "accepted";
      // Optionally mark the listing as sold
      await supabase
        .from("listings")
        .update({ status: "sold" })
        .eq("id", offer.listing_id);
    } else if (action === "decline") {
      updateData.status = "declined";
    } else if (action === "counter") {
      updateData.status = "countered";
      updateData.counter_amount = counter_amount;
      updateData.counter_message = counter_message || null;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { error: updateErr } = await supabase
      .from("offers")
      .update(updateData)
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
