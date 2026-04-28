export const trackingKeys = {
  all: () => ['tracking'] as const,
  detail: (trackingToken: string) =>
    [...trackingKeys.all(), 'detail', trackingToken] as const,
};
