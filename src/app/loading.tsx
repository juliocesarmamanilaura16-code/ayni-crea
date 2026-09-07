export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="skeleton h-10 w-1/3 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded mt-2" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="skeleton aspect-[4/3]" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
