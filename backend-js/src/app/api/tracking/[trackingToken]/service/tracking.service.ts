import { NotFoundError } from '@/app/lib/errors';
import { findPackageByTrackingToken } from '../repository/tracking.repo';
import { TrackingResult } from '../types';

export async function trackingService(token: string): Promise<TrackingResult> {
  const result = await findPackageByTrackingToken(token);
  if (!result) throw new NotFoundError('Invalid or expired tracking token');
  return result;
}
