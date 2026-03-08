import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark-bg text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" className="hover:text-hw-red transition-colors">Browse Listings</Link></li>
              <li><Link href="/how-it-works" className="hover:text-hw-red transition-colors">How It Works</Link></li>
              <li><Link href="/sell" className="hover:text-hw-red transition-colors">Sell</Link></li>
              <li><Link href="/about" className="hover:text-hw-red transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-hw-red transition-colors">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-hw-red transition-colors">Sign Up</Link></li>
              <li><Link href="/dashboard" className="hover:text-hw-red transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-hw-red transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-hw-red transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-hw-red transition-colors cursor-pointer">Report an Issue</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-hw-red transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-hw-red transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-hw-red transition-colors cursor-pointer">Cookie Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo2.png" alt="HW Swap and Shop" className="h-14" />
            <p className="text-sm">
              &copy; {new Date().getFullYear()} HW Swap and Shop. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm hover:text-hw-red cursor-pointer">Twitter</span>
            <span className="text-sm hover:text-hw-red cursor-pointer">Instagram</span>
            <span className="text-sm hover:text-hw-red cursor-pointer">YouTube</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
