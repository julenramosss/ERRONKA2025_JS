import type { HistoryChartProps } from "../types";

export function HistoryChart({ bars }: HistoryChartProps) {
  if (bars.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-bg-surface sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Eguneko emaitzak
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Azken 14 egunak
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 py-8 text-sm text-text-disabled sm:px-6 sm:py-10">
          Ez dago daturik
        </div>
      </div>
    );
  }

  const max = Math.max(...bars.map((bar) => bar.total), 0);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-surface sm:rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Eguneko emaitzak
          </p>
          <p className="text-xs text-text-secondary mt-0.5">Azken 14 egunak</p>
        </div>
        <div className="flex gap-3 text-xs text-text-secondary sm:gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
            OK
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: "var(--st-failed-fg)" }}
            />
            Huts
          </span>
        </div>
      </div>

      <div className="px-3 py-4 sm:px-5 sm:py-6">
        <div className="flex h-40 items-end gap-1 sm:h-52 sm:gap-3">
          {bars.map((bar, index) => {
              const deliveredPct = max > 0 ? (bar.delivered / max) * 100 : 0;
              const failedPct = max > 0 ? (bar.failed / max) * 100 : 0;

              return (
                <div
                  key={bar.dateKey}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:gap-2"
                  title={`${bar.fullLabel}: ${bar.total} pakete`}
                >
                  <div className="h-4 text-[10px] font-mono text-text-disabled">
                    {bar.total > 0 ? bar.total : ""}
                  </div>
                  <div className="h-28 w-full max-w-7 sm:h-36 sm:max-w-10">
                    <div className="flex h-full flex-col-reverse overflow-hidden rounded-md border border-border bg-bg-elevated">
                      {deliveredPct > 0 && (
                        <div
                          className="w-full transition-all duration-500"
                          style={{
                            height: `${deliveredPct}%`,
                            background:
                              "linear-gradient(to top, #7C3AED, #A78BFA)",
                          }}
                        />
                      )}
                      {failedPct > 0 && (
                        <div
                          className="w-full transition-all duration-500"
                          style={{
                            height: `${failedPct}%`,
                            background: "var(--st-failed-fg)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <span className="h-3 text-center font-mono text-[9px] text-text-disabled sm:text-[10px]">
                    <span className={index % 2 === 0 ? "" : "hidden sm:inline"}>
                      {bar.shortLabel}
                    </span>
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
