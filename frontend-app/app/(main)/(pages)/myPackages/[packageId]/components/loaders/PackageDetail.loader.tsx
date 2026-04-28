export function PackageDetailLoader() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Breadcrumb (matches PackageDetailHeader: flex flex-col py-6) */}
      <div className="flex flex-col py-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 rounded bg-bg-elevated" />
          <div className="h-3 w-3 rounded bg-bg-elevated" />
          <div className="h-3 w-32 rounded bg-bg-elevated" />
        </div>
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          {/* Info card (matches PackageInfoCard: px-5 py-4 md:px-6) */}
          <div className="bg-bg-surface border border-border rounded-xl px-5 py-4">
            {/* Header row with title + badge */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div className="h-4 w-40 rounded bg-bg-elevated" />
              <div className="h-5 w-16 rounded bg-bg-elevated" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={i === 2 ? 'sm:col-span-2' : ''}>
                  <div className="h-2.5 w-14 rounded bg-bg-elevated mb-1.5" />
                  <div className="h-4 w-full rounded bg-bg-elevated" />
                </div>
              ))}
            </div>
          </div>

          {/* History card */}
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-border">
              <div className="h-4 w-32 rounded bg-bg-elevated mb-2" />
              <div className="h-3 w-24 rounded bg-bg-elevated" />
            </div>
            <div className="px-5 md:px-8 py-5 flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-bg-elevated mt-1 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-4 w-24 rounded bg-bg-elevated" />
                    <div className="h-3 w-36 rounded bg-bg-elevated" />
                  </div>
                  <div className="h-3 w-20 rounded bg-bg-elevated" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map card (matches DeliveryLocation structure) */}
        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-border">
            <div className="h-4 w-36 rounded bg-bg-elevated" />
          </div>
          <div
            className="mx-4 mt-4 rounded-lg bg-bg-elevated"
            style={{ height: 220 }}
          />
          <div className="px-5 py-4 mt-2 flex flex-col gap-2">
            <div className="h-4 w-40 rounded bg-bg-elevated" />
            <div className="h-3 w-52 rounded bg-bg-elevated mb-2" />
            <div className="h-9 w-full rounded-lg bg-bg-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}
