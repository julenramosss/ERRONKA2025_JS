export function PackagesTableLoader() {
  return (
    <>
      {/* Mobile loader */}
      <div className="md:hidden flex flex-col gap-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-bg-elevated rounded-xl h-32" />
        ))}
      </div>
      {/* Desktop loader */}
      <div className="hidden md:block bg-bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
        <div className="bg-bg-elevated h-10 border-b border-border" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0"
          >
            <div className="h-6 w-28 rounded bg-bg-elevated" />
            <div className="h-6 w-36 rounded bg-bg-elevated" />
            <div className="h-6 w-32 rounded bg-bg-elevated flex-1" />
            <div className="h-6 w-16 rounded bg-bg-elevated" />
            <div className="h-6 w-12 rounded bg-bg-elevated" />
            <div className="h-7 w-20 rounded bg-bg-elevated" />
          </div>
        ))}
      </div>
    </>
  );
}

export function PackagesGridLoader() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-bg-elevated rounded-xl h-44" />
      ))}
    </div>
  );
}

export function PackagesHeaderLoader() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-40 sm:w-48 rounded bg-bg-elevated" />
          <div className="h-4 w-28 sm:w-32 rounded bg-bg-elevated" />
        </div>
        <div className="h-10 w-10 rounded bg-bg-elevated" />
      </div>
      <div className="h-10 w-full rounded bg-bg-elevated" />
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 sm:w-24 rounded-full bg-bg-elevated"
          />
        ))}
      </div>
    </div>
  );
}
