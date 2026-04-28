export const packagesKeys = {
  all: () => ['packages'] as const,
  myPackages: () => [...packagesKeys.all(), 'myPackages'] as const,
  detail: (id: number) => [...packagesKeys.all(), 'detail', id] as const,
};
