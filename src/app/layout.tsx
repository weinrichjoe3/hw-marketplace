import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackPageView } from "@/components/TrackPageView";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HW Swap and Shop — Buy, Sell & Trade Hot Wheels",
  description:
    "Buy, sell, and trade collectible Hot Wheels with verified sellers on HW Swap and Shop.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased bg-white text-black`}>
        <Navbar />
        <TrackPageView />
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
