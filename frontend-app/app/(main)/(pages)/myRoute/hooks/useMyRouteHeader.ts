'use client';

import { useState } from 'react';
import { useMyDailyRoute } from '../../../../hooks/routes/useMyDailyRoute';
import { usePreferences } from '../../../../hooks/usePreferences';
import { useUpdateRouteStatus } from '../../../../hooks/routes/useUpdateRouteStatus';
import {
  formatDate,
  normalizeDateKey,
  toLocalDateKey,
} from '../../../../utils/date.utils';
import { isTerminalPackageStatus, ROUTE_STATUS_LABEL } from '../constants';
import { getActionErrorMessage } from './routeUtils';
import { ROUTE_STATUSES } from '../../../../utils/types';

export function useMyRouteHeader() {
  const routeQuery = useMyDailyRoute();
  const updateRouteStatus = useUpdateRouteStatus();
  usePreferences();

  const routeData = routeQuery.data ?? null;
  const stops = routeData?.stops ?? [];

  const [isStartingRoute, setIsStartingRoute] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const todayKey = toLocalDateKey();
  const routeDateKey = routeData
    ? normalizeDateKey(routeData.route.route_date)
    : null;
  const isToday = routeDateKey === todayKey;

  const totalStops = stops.length;

  const completedStops = stops.filter((stop) =>
    isTerminalPackageStatus(stop.package.status)
  ).length;

  const isCompleted = routeData?.route.status === ROUTE_STATUSES.completed;
  const isInProgress = routeData?.route.status === ROUTE_STATUSES.in_progress;
  const isPlanned = routeData?.route.status === ROUTE_STATUSES.planned;
  const canUpdateRoute = Boolean(
    routeData && !isCompleted && (isInProgress || (isPlanned && isToday))
  );

  const startButtonLabel = (() => {
    if (isCompleted) return 'Ez dago ibilbide pendenterik';
    if (isInProgress) return 'Ibilbidea bukatu';
    if (!isToday) return 'Gaurko ibilbidea sortu';
    return 'Ibilbidea hasi';
  })();

  const routeStatusLabel = routeData
    ? ROUTE_STATUS_LABEL[routeData.route.status]
    : '--';

  const routeDateLabel = routeData
    ? formatDate(normalizeDateKey(routeData.route.route_date))
    : '--';

  async function onClickUpdateRouteStatus(): Promise<void> {
    if (!routeData || !canUpdateRoute) return;

    if (routeData.route.status === ROUTE_STATUSES.planned) {
      setActionError(null);
      setIsStartingRoute(true);

      try {
        await updateRouteStatus.mutateAsync({
          routeId: routeData.route.id,
          payload: { status: ROUTE_STATUSES.in_progress },
        });
      } catch (error) {
        setActionError(getActionErrorMessage(error));
      } finally {
        setIsStartingRoute(false);
      }
      return;
    }

    if (routeData.route.status === ROUTE_STATUSES.in_progress) {
      setActionError(null);
      try {
        await updateRouteStatus.mutateAsync({
          routeId: routeData.route.id,
          payload: { status: ROUTE_STATUSES.completed },
        });
      } catch (error) {
        setActionError(getActionErrorMessage(error));
      }
    }
  }

  return {
    routeDateLabel,
    routeStatusLabel,
    totalStops,
    completedStops,
    isToday,
    isPlanned,
    canUpdateRoute,
    isStartingRoute: isStartingRoute || updateRouteStatus.isPending,
    actionError,
    startButtonLabel,
    onClickUpdateRouteStatus,
  };
}
