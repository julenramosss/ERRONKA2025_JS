import { useMe } from '../../../../hooks/auth/useMe';
import { useMyPackages } from '../../../../hooks/packages/useMyPackages';
import { usePreferences } from '../../../../hooks/usePreferences';
import { formatDate } from '../../../../utils/date.utils';
import { PACKAGE_STATUSES } from '../../../../utils/types';

export function useDashboardData() {
  const { data: userData, isLoading: isUserLoading } = useMe();
  const { data: packagesData, isLoading: isPackagesLoading } = useMyPackages();
  usePreferences();
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
  const todayDay = formatDate(new Date());

  return {
    userData,
    packagesData,
    todayPackagesData,

    todayDay,
    isUserLoading,
    isPackagesLoading,
  };
}
