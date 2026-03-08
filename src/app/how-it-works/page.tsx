"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ = [
  {
    q: "Is it free to browse and buy?",
    a: "Yes! Browsing, messaging sellers, and purchasing are completely free. You only pay the listing price agreed upon with the seller.",
  },
  {
    q: "How does seller verification work?",
    a: "Sellers verify their identity through our multi-step process including email confirmation, photo ID, and transaction history review.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We support all major credit cards, PayPal, and bank transfers. All transactions are processed securely through our platform.",
  },
  {
    q: "Can I return a purchase?",
    a: "If an item is significantly not as described, you can open a dispute within 48 hours of receiving the item. Our team will review and mediate.",
  },
  {
    q: "How do I cancel my seller subscription?",
    a: "You can cancel anytime from your Dashboard under Billing. Your listings will remain active until the end of your billing period.",
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Whether you&apos;re buying or selling, HW Swap and Shop makes it simple and secure.
        </p>
      </div>

      {/* Buyers Section */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="rounded-full bg-hw-blue/20 px-4 py-1 text-sm font-semibold text-hw-blue">
            Free
          </span>
          <h2 className="text-2xl font-bold">For Buyers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Browse & Search", desc: "Explore thousands of listings filtered by series, condition, price range, and more." },
            { step: "2", title: "Message Sellers", desc: "Ask questions, negotiate, and arrange details directly with verified sellers." },
            { step: "3", title: "Complete Your Purchase", desc: "Pay securely through the platform. Your payment is held until you confirm receipt." },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-hw-blue/20 text-hw-blue font-bold text-sm mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sellers Section */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="rounded-full bg-hw-yellow/30 px-4 py-1 text-sm font-semibold text-yellow-700">
            $10/mo
          </span>
          <h2 className="text-2xl font-bold">For Sellers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Upgrade to Seller", desc: "Subscribe for $10/month to unlock unlimited listings, analytics, and seller badges." },
            { step: "2", title: "Create Listings", desc: "Upload photos, add descriptions, set your price, and tag with series and condition." },
            { step: "3", title: "Get Paid", desc: "Receive payments directly to your account. Funds are released once the buyer confirms." },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-hw-yellow/20 text-yellow-700 font-bold text-sm mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="rounded-xl border border-card-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-sm">{item.q}</span>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <Link
          href="/signup"
          className="inline-block rounded-lg bg-hw-yellow px-8 py-3.5 text-base font-semibold text-black hover:bg-hw-yellow-hover transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
