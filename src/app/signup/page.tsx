import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-card-border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Join the premier Hot Wheels marketplace
          </p>

          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your display name"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-royal-blue py-2.5 text-sm font-semibold text-white hover:bg-royal-blue/90 transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-royal-blue hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
