export function StatsCardsLoader() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-bg-elevated rounded-xl h-28" />
      ))}
    </div>
  );
}
