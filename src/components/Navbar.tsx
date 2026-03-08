"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-royal-blue">HW</span> Marketplace
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/listings"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              How It Works
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-gray-400 max-w-[160px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-royal-blue px-5 py-2 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-2">
          <Link href="/listings" className="block py-2 text-sm font-medium text-gray-600">Browse</Link>
          <Link href="/how-it-works" className="block py-2 text-sm font-medium text-gray-600">How It Works</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm font-medium text-gray-600">Dashboard</Link>
              <p className="py-2 text-sm text-gray-400 truncate">{user.email}</p>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm font-medium text-red-500">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm font-medium text-gray-600">Log In</Link>
              <Link href="/signup" className="block py-2 text-sm font-semibold text-royal-blue">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
