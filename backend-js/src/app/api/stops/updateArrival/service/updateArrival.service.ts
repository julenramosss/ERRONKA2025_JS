import { ConflictError, ForbiddenError, NotFoundError } from '@/app/lib/errors';
import { UpdatedStop } from '../types';
import {
  findStopWithRoute,
  markActualArrival,
  findStopById,
} from '../repository/updateArrival.repository';

export async function updateArrivalService(
  stopId: number,
  userId: number
): Promise<UpdatedStop> {
  const stop = await findStopWithRoute(stopId);

  if (!stop) throw new NotFoundError(`Stop ${stopId} not found`);

  if (stop.route_user_id !== userId) {
    throw new ForbiddenError('You can only update your own route stops');
  }

  if (stop.actual_arrival !== null) {
    throw new ConflictError(`Stop ${stopId} already has an arrival recorded`);
  }

  await markActualArrival(stopId);

  const updated = await findStopById(stopId);
  return updated!;
}
