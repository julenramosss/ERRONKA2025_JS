export function MyRouteLoader() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-28 animate-pulse rounded-xl bg-bg-surface" />
      <div className="h-24 animate-pulse rounded-xl bg-bg-surface" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <div className="h-[560px] animate-pulse rounded-xl bg-bg-surface" />
        <div className="h-[560px] animate-pulse rounded-xl bg-bg-surface" />
      </div>
    </div>
  );
}
