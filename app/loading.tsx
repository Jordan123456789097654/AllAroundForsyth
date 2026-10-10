// -------------------------------------------------------------
// All Around Forsyth - Loading Skeleton (shown while a page loads)
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// -------------------------------------------------------------

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading content...</span>
      <div className="skeleton h-40 sm:h-56 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="skeleton h-40" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-5 w-3/4 rounded-lg" />
              <div className="skeleton h-3 w-full rounded-lg" />
              <div className="skeleton h-3 w-5/6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
