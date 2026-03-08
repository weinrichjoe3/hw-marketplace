/**
 * Seed script: Creates 20 fake user profiles and 100 listings in Supabase.
 *
 * Usage:
 *   1. Go to your Supabase project → Project Settings → API → service_role (secret)
 *   2. Copy the service_role key
 *   3. Run:
 *      SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
 *      SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here \
 *      node scripts/seed.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Run with:\n" +
      "  SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed.js"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Fake data ────────────────────────────────────────────────────────────────

const DISPLAY_NAMES = [
  "CollectorMike",
  "DiecastDave",
  "HotWheelsHunter",
  "VintageRacer",
  "CastingKing",
  "TrackDayTony",
  "RedlineRick",
  "GarageGuru",
  "MintConditionMel",
  "TurboTina",
  "ScaleSammy",
  "CustomCarlos",
  "ChaseChaser",
  "PackPullPete",
  "ShelfQueen99",
  "LooseWheelLou",
  "BlisterPackBen",
  "VariationVic",
  "THunterTom",
  "ChromeKristin",
];

const MODELS = [
  "'71 Datsun 510",
  "Nissan Skyline GT-R (R34)",
  "'67 Camaro",
  "Porsche 911 GT3 RS",
  "Toyota AE86 Sprinter Trueno",
  "'55 Chevy Bel Air Gasser",
  "'69 Dodge Charger Daytona",
  "Lamborghini Countach",
  "Mercedes-Benz 300 SL",
  "Custom '62 Chevy Pickup",
  "BMW M3 (E30)",
  "Ford GT40",
  "Mazda RX-7 (FC3S)",
  "'70 Plymouth Superbird",
  "Volkswagen T1 Panel Bus",
  "Aston Martin DB5",
  "McLaren F1",
  "Honda Civic EG",
  "Jaguar E-Type",
  "Shelby Cobra 427",
  "'68 Mercury Cougar",
  "Datsun 240Z",
  "Lancia Stratos",
  "Alfa Romeo Giulia Sprint",
  "Pontiac GTO Judge",
  "Buick Grand National",
  "'83 Chevy Silverado",
  "Ford Bronco",
  "Range Rover Classic",
  "Tesla Roadster",
];

const SERIES = [
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

const CONDITIONS = [
  "Mint / Carded",
  "Near Mint / Carded",
  "Mint / Loose",
  "Excellent / Loose",
  "Good / Loose",
  "Poor",
];

const DESCRIPTIONS = [
  "Excellent condition, stored in climate-controlled environment since purchase. Card has no bends or creases. Paint is factory perfect.",
  "Pulled from a fresh case at Target. Kept in a protector pack since day one. This is a beautiful piece for any serious collection.",
  "Loose but in fantastic shape — no chips, scratches, or wheel issues. Wheels roll freely. Display-ready out of the box.",
  "A true grail piece. Hard to find in this condition. I've been collecting for 15 years and this is one of the best examples I've seen.",
  "Great starter piece for new collectors. Minor shelf wear but overall a solid 8/10. Happy to provide additional photos on request.",
  "Recently acquired from a private collection sale. Verified authentic with all original packaging and insert card intact.",
  "One of the most sought-after castings in the hobby. This particular color variant is especially rare — check completed sales for comps.",
  "Opening hood and trunk with detailed engine. Real Riders rubber tires. Spectraflame paint. Everything you want in a premium piece.",
  "Part of a complete set — willing to sell individually or as a bundle. Message me for bundle pricing if interested in the full set.",
  "Stored in acid-free protector since purchase. Never displayed. Card corners are mint. Blister is crystal clear with no yellowing.",
];

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x600/f4f4f5/a1a1aa?text=Hot+Wheels";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  const ranges = [
    [5, 20],
    [15, 50],
    [40, 120],
    [100, 300],
    [200, 500],
  ];
  const [min, max] = pick(ranges);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomYear() {
  return String(2018 + Math.floor(Math.random() * 8)); // 2018-2025
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding 20 profiles...");

  // Create profiles directly (these are display-only profiles, not auth users)
  const profiles = DISPLAY_NAMES.map((name, i) => ({
    id: crypto.randomUUID(),
    display_name: name,
    is_seller: true,
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    ).toISOString(),
  }));

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profiles, { onConflict: "id" });

  if (profileError) {
    console.error("Error creating profiles:", profileError.message);
    process.exit(1);
  }

  console.log("✓ 20 profiles created");
  console.log("Seeding 100 listings (5 per user)...");

  const listings = [];

  for (const profile of profiles) {
    for (let j = 0; j < 5; j++) {
      const model = pick(MODELS);
      const series = pick(SERIES);
      listings.push({
        id: crypto.randomUUID(),
        user_id: profile.id,
        title: `${model} — ${series}`,
        description: pick(DESCRIPTIONS),
        series: series,
        year: randomYear(),
        condition: pick(CONDITIONS),
        price: randomPrice(),
        images: [PLACEHOLDER_IMAGE],
        open_to_trades: Math.random() > 0.5,
        status: "active",
        created_at: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      });
    }
  }

  // Insert in batches of 50
  for (let i = 0; i < listings.length; i += 50) {
    const batch = listings.slice(i, i + 50);
    const { error } = await supabase.from("listings").insert(batch);
    if (error) {
      console.error("Error inserting listings batch:", error.message);
      process.exit(1);
    }
  }

  console.log("✓ 100 listings created");
  console.log("\nDone! Your database is seeded.");
}

seed().catch(console.error);
