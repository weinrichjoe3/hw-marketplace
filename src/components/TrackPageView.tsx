"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function TrackPageView() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Extract listing_id if on a listing page
    const listingMatch = pathname.match(/^\/listings\/([^/]+)$/);
    const listing_id = listingMatch ? listingMatch[1] : undefined;
    const event_type = listing_id ? "listing_view" : "page_view";

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type,
        listing_id,
        page_path: pathname,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
