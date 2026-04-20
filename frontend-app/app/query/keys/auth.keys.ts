export const authKeys = {
  all: () => ["auth"] as const,
  me: () => [...authKeys.all(), "me"] as const,
  refresh: () => [...authKeys.all(), "refresh"] as const,
};
