export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-6">About HW Marketplace</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
        <p>
          HW Marketplace was built by collectors, for collectors. We saw a gap in the
          market for a dedicated, trustworthy platform where Hot Wheels enthusiasts could
          buy, sell, and trade with confidence.
        </p>

        <p>
          Too many collectors have been burned by unverified sellers, misleading photos,
          and platforms that don&apos;t understand the nuances of die-cast collecting. We
          set out to build something better.
        </p>

        <h2 className="text-2xl font-bold text-black mt-10 mb-4">Our Mission</h2>
        <p>
          To create the most trusted and user-friendly marketplace for Hot Wheels collectors
          worldwide. Every feature we build is designed to make transactions safer, faster,
          and more enjoyable for both buyers and sellers.
        </p>

        <h2 className="text-2xl font-bold text-black mt-10 mb-4">What Sets Us Apart</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-black">Verified Sellers</strong> — Every seller goes through
            our multi-step verification process before they can list.
          </li>
          <li>
            <strong className="text-black">Condition Standards</strong> — We use a standardized
            grading system so you know exactly what you&apos;re getting.
          </li>
          <li>
            <strong className="text-black">Secure Payments</strong> — Funds are held in escrow
            and only released when the buyer confirms receipt.
          </li>
          <li>
            <strong className="text-black">Community First</strong> — We reinvest in the community
            through events, giveaways, and collector spotlights.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-10 mb-4">The Team</h2>
        <p>
          We&apos;re a small team of engineers and collectors based across the US. Between us,
          we&apos;ve collected over 5,000 Hot Wheels cars and have been part of the community
          for over two decades.
        </p>
        <p>
          Have questions, feedback, or just want to talk cars? We&apos;d love to hear from you.
          Reach out anytime at{" "}
          <span className="text-royal-blue font-medium">hello@hwmarketplace.com</span>.
        </p>
      </div>
    </div>
  );
}
