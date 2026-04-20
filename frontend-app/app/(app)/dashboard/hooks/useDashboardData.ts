import { useMe } from "../../../hooks/auth/useMe";
import { useMyPackages } from "../../../hooks/packages/useMyPackages";

export function useDashboardData() {
  const { data: userData, isLoading: isUserLoading } = useMe();
  const { data: packagesData, isLoading: isPackagesLoading } = useMyPackages();

  const todayPackagesData = packagesData?.filter((pkg) => {
    const today = new Date();
    const deliveryDate = new Date(pkg.estimated_delivery || pkg.created_at);
    return (
      deliveryDate.getDate() === today.getDate() &&
      deliveryDate.getMonth() === today.getMonth() &&
      deliveryDate.getFullYear() === today.getFullYear()
    );
  });

  const MONTHS_EU = [
    "Urtarrila",
    "Otsaila",
    "Martxoa",
    "Apirila",
    "Maiatza",
    "Ekaina",
    "Uztaila",
    "Abuztua",
    "Irailara",
    "Urrira",
    "Azaroa",
    "Abendua",
  ];
  const now = new Date();
  const todayDay = `${MONTHS_EU[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return {
    userData,
    packagesData,
    todayPackagesData,
    todayDay,
    isUserLoading,
    isPackagesLoading,
  };
}
