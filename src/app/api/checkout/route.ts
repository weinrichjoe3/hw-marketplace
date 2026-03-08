import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!key) {
      return NextResponse.json({
        error: "Server config error: STRIPE_SECRET_KEY missing",
      }, { status: 500 });
    }

    if (!priceId) {
      return NextResponse.json({
        error: "Server config error: STRIPE_PRICE_ID missing",
      }, { status: 500 });
    }

    const stripe = new Stripe(key);
    const { origin } = new URL(request.url);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/billing?success=true`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Return detailed error info for debugging
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({
        error: err.message,
        type: err.type,
        code: err.code,
      }, { status: 500 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
