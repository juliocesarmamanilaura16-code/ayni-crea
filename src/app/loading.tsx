export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="skeleton h-10 w-1/3 rounded-xl" />
      <div className="skeleton h-4 w-1/2 rounded mt-3" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
          >
            <div className="skeleton aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="flex items-center justify-between pt-2">
                <div className="skeleton h-6 w-16 rounded" />
                <div className="skeleton h-9 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
