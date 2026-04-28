export const logsKeys = {
  all: () => ['logs'] as const,
  package: (packageId: number) =>
    [...logsKeys.all(), 'package', packageId] as const,
  list: (packageId: number, page: number, limit: number) =>
    [...logsKeys.package(packageId), 'list', { page, limit }] as const,
};
