import type { HistoryChartProps } from "../types";

export function HistoryChart({ bars }: HistoryChartProps) {
  if (bars.length === 0) {
    return (
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Eguneko emaitzak
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Azken 14 egunak
            </p>
          </div>
        </div>
        <div className="px-6 py-10 flex items-center justify-center text-sm text-text-disabled">
          Ez dago daturik
        </div>
      </div>
    );
  }

  const max = Math.max(...bars.map((bar) => bar.total), 0);
  const minChartWidth = Math.max(bars.length * 56, 640);

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex flex-wrap justify-between items-center gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Eguneko emaitzak
          </p>
          <p className="text-xs text-text-secondary mt-0.5">Azken 14 egunak</p>
        </div>
        <div className="flex gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
            Entregatuta
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

      <div className="overflow-x-auto">
        <div className="px-5 py-6" style={{ minWidth: `${minChartWidth}px` }}>
          <div className="flex items-end gap-3 h-52">
            {bars.map((bar) => {
              const deliveredPct = max > 0 ? (bar.delivered / max) * 100 : 0;
              const failedPct = max > 0 ? (bar.failed / max) * 100 : 0;

              return (
                <div
                  key={bar.dateKey}
                  className="flex-1 flex flex-col items-center gap-2"
                  title={`${bar.fullLabel}: ${bar.total} pakete`}
                >
                  <div className="h-4 text-[10px] font-mono text-text-disabled">
                    {bar.total > 0 ? bar.total : ""}
                  </div>
                  <div className="h-36 w-full max-w-10">
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
                  <span className="text-[10px] text-text-disabled font-mono text-center">
                    {bar.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
