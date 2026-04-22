export const routesKeys = {
  all: () => ["routes"] as const,
  daily: (date = "today") => [...routesKeys.all(), "daily", date] as const,
  pendingPast: () => [...routesKeys.all(), "pendingPast"] as const,
};
