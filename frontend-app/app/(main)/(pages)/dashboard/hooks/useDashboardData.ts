import { useMe } from "../../../../hooks/auth/useMe";
import { useMyPackages } from "../../../../hooks/packages/useMyPackages";
import { getMonthName } from "../../../../utils/constants/date.constants";
import { PACKAGE_STATUSES } from "../../../../utils/types";

export function useDashboardData() {
  const { data: userData, isLoading: isUserLoading } = useMe();
  const { data: packagesData, isLoading: isPackagesLoading } = useMyPackages();
  const today = new Date();

  const todayPackagesData = packagesData?.filter((pkg) => {
    const deliveryDate = new Date(pkg.estimated_delivery || pkg.created_at);
    return (
      deliveryDate.getDate() === today.getDate() &&
      deliveryDate.getMonth() === today.getMonth() &&
      deliveryDate.getFullYear() === today.getFullYear() &&
      (pkg.status === PACKAGE_STATUSES.in_transit ||
        pkg.status === PACKAGE_STATUSES.assigned)
    );
  });
  const now = new Date();
  const monthNameEn = now.toLocaleDateString("en-EN", { month: "long" });
  const todayDay = `${now.getDate()} ${getMonthName(monthNameEn)} ${now.getFullYear()}`;

  return {
    userData,
    packagesData,
    todayPackagesData,

    todayDay,
    isUserLoading,
    isPackagesLoading,
  };
}
