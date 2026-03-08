export default function InboxPage() {
  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl font-bold mb-1">Inbox</h1>
      <p className="text-sm text-gray-500 mb-8">Messages from buyers and sellers</p>

      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          When you receive offers or trade proposals, they&apos;ll appear here.
        </p>
      </div>
    </div>
  );
}
