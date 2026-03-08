import { createClient } from "@supabase/supabase-js";

// Service-role client for server-side operations (webhooks, etc.)
// Uses the anon key here — for production with RLS-bypassing writes,
// you'd use the service_role key. The webhook route passes the
// stripe_customer_id to match profiles, which works with RLS policies
// that allow updates where id = auth.uid(). For the webhook (no auth
// context), we rely on the SQL function approach below.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
