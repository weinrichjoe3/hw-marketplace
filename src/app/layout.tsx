import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HW Marketplace — The Premium Hot Wheels Marketplace",
  description:
    "Buy, sell, and trade premium Hot Wheels collectibles with verified sellers.",
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
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
