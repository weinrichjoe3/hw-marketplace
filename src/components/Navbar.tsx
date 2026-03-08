"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div className="h-[3px] bg-hw-red" />
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="HW Swap and Shop" className="h-9" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/listings"
                className="text-sm font-medium text-gray-600 hover:text-hw-red transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/sell"
                className="text-sm font-medium text-gray-600 hover:text-hw-red transition-colors"
              >
                Sell
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-hw-red transition-colors"
              >
                How It Works
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-hw-red transition-colors"
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
                    className="text-sm font-medium text-gray-600 hover:text-hw-red transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-hw-blue px-5 py-2 text-sm font-semibold text-white hover:bg-hw-blue/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
      </nav>

      {/* Mobile slide-in overlay panel */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        {/* Panel from right */}
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="font-semibold text-sm">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="p-4 space-y-1">
            <Link href="/listings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
              Browse
            </Link>
            <Link href="/sell" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
              Sell
            </Link>
            <Link href="/how-it-works" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
              How It Works
            </Link>
            <Link href="/about" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
              About
            </Link>
            <hr className="my-2 border-gray-100" />
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
                  Dashboard
                </Link>
                <p className="px-3 py-2 text-sm text-gray-400 truncate">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 min-h-[44px]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
                  Log In
                </Link>
                <Link href="/signup" className="flex items-center justify-center px-3 py-3 rounded-lg bg-hw-blue text-base font-semibold text-white min-h-[44px] mt-2">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile bottom navigation bar */}
      <MobileBottomNav pathname={pathname} user={user} />
    </>
  );
}

function MobileBottomNav({ pathname, user }: { pathname: string; user: User | null }) {
  const tabs = [
    {
      href: "/",
      label: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
    },
    {
      href: "/listings",
      label: "Browse",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    },
    {
      href: "/sell",
      label: "Sell",
      icon: "M12 4v16m8-8H4",
    },
    {
      href: user ? "/dashboard" : "/login",
      label: user ? "Profile" : "Log In",
      icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0",
    },
  ];

  // Hide on dashboard pages (dashboard has its own mobile nav)
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-hw-red" : "text-gray-400"
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 2 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
