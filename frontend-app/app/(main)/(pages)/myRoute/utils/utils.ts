import { RouteStopPackageAddress } from '../../../../utils/types/api/route.types';

export function pointToString(point?: RouteStopPackageAddress) {
  if (!point) return '';
  return `${point.lat},${point.lng}`;
}
