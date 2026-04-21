import { useMe } from "../../../../hooks/auth/useMe";
import { useMyPackages } from "../../../../hooks/packages/useMyPackages";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import { getMonthName } from "../../../../utils/constants/date.constants";
import { PACKAGE_STATUSES } from "../../../../utils/types";

export function useDashboardData() {
  const { data: userData, isLoading: isUserLoading } = useMe();
  const { data: packagesData, isLoading: isPackagesLoading } = useMyPackages();
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(
    2,
    "0"
  )}-${`${today.getDate()}`.padStart(2, "0")}`;
  const { data: todayRotueData } = useMyDailyRoute(todayKey);

  const todayPackagesData = packagesData?.filter((pkg) => {
    const deliveryDate = new Date(pkg.estimated_delivery || pkg.created_at);
    return (
      deliveryDate.getDate() === today.getDate() &&
      deliveryDate.getMonth() === today.getMonth() &&
      deliveryDate.getFullYear() === today.getFullYear()
    );
  });
  const now = new Date();
  const monthNameEn = now.toLocaleDateString("en-EN", { month: "long" });
  const todayDay = `${now.getDate()} ${getMonthName(monthNameEn)} ${now.getFullYear()}`;

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const estimatedTimes = todayRotueData?.stops
    .map((s) => s.estimated_arrival)
    .filter((t): t is string => !!t)
    .sort();

  const todayRouteHours = (() => {
    if (!estimatedTimes || estimatedTimes.length === 0) return null;
    const totalMinutes =
      timeToMinutes(estimatedTimes[estimatedTimes.length - 1]) -
      timeToMinutes(estimatedTimes[0]);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
  })();

  const todayRouteStops =
    todayRotueData?.stops.filter(
      (s) =>
        s.package.status === PACKAGE_STATUSES.assigned ||
        s.package.status === PACKAGE_STATUSES.in_transit
    ).length ?? 0;

  return {
    userData,
    packagesData,
    todayPackagesData,
    todayRoutesData: {
      todayRouteHours,
      todayRouteStops,
    },

    todayDay,
    isUserLoading,
    isPackagesLoading,
  };
}
