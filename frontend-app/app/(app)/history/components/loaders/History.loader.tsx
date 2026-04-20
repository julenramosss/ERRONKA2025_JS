export function HistoryLoader() {
  return (
    <div className="py-6 px-4 md:px-8 lg:px-10 flex flex-col gap-6">
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-36 rounded-lg bg-bg-elevated" />
              <div className="h-4 w-56 rounded bg-bg-elevated" />
            </div>
            <div className="h-10 w-full sm:w-64 rounded-md bg-bg-elevated" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="h-11 w-full rounded-md bg-bg-elevated" />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-bg-elevated" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-bg-elevated rounded-xl h-30" />
          ))}
        </div>

        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 rounded bg-bg-elevated" />
              <div className="h-3 w-24 rounded bg-bg-elevated" />
            </div>
            <div className="h-4 w-28 rounded bg-bg-elevated" />
          </div>
          <div className="px-5 py-6">
            <div className="h-52 rounded-lg bg-bg-elevated" />
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between">
            <div className="h-4 w-36 rounded bg-bg-elevated" />
            <div className="h-4 w-16 rounded bg-bg-elevated" />
          </div>
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex}>
              <div className="px-5 py-3 bg-bg-elevated border-b border-border">
                <div className="h-3 w-44 rounded bg-bg-surface" />
              </div>
              {[...Array(3)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0"
                >
                  <div className="hidden md:block h-7 w-28 rounded bg-bg-elevated" />
                  <div className="w-8 h-8 rounded-full bg-bg-elevated shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-3.5 w-32 rounded bg-bg-elevated mb-1.5" />
                    <div className="h-3 w-28 rounded bg-bg-elevated" />
                  </div>
                  <div className="h-6 w-20 rounded-lg bg-bg-elevated" />
                  <div className="hidden md:block h-3 w-10 rounded bg-bg-elevated" />
                  <div className="h-4 w-4 rounded bg-bg-elevated" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
