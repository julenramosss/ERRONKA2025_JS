export function HistoryLoader() {
  return (
    <div className="flex flex-col gap-4 px-3 py-4 sm:px-5 md:px-8 md:py-6 lg:px-10">
      <div className="flex animate-pulse flex-col gap-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-36 rounded-lg bg-bg-elevated" />
              <div className="hidden h-4 w-56 rounded bg-bg-elevated sm:block" />
            </div>
            <div className="h-9 w-full rounded-md bg-bg-elevated sm:h-10 sm:w-44" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-11 w-full rounded-md bg-bg-elevated" />
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-md bg-bg-elevated sm:w-24 sm:rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-bg-elevated sm:h-30 sm:rounded-xl"
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-bg-surface sm:rounded-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 rounded bg-bg-elevated" />
              <div className="h-3 w-24 rounded bg-bg-elevated" />
            </div>
            <div className="h-4 w-16 rounded bg-bg-elevated sm:w-28" />
          </div>
          <div className="px-3 py-4 sm:px-5 sm:py-6">
            <div className="h-40 rounded-lg bg-bg-elevated sm:h-52" />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-bg-surface sm:rounded-xl">
          <div className="flex justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <div className="h-4 w-36 rounded bg-bg-elevated" />
            <div className="h-4 w-16 rounded bg-bg-elevated" />
          </div>
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex}>
              <div className="border-b border-border bg-bg-elevated px-4 py-2.5 sm:px-5 sm:py-3">
                <div className="h-3 w-28 rounded bg-bg-surface sm:w-44" />
              </div>
              {[...Array(3)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 sm:gap-4 sm:px-5 sm:py-4"
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
