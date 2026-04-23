import { useEffect, useRef, useState } from "react";
import { AssignedPackageLatLng } from "../types";
import { usePreferences } from "../../../../hooks/usePreferences";
import type { PackageWithAddress } from "../../../../utils/types/api/package.types";

export function useDashboardMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { animations } = usePreferences();
  const [assignedPackageLatLng, setAssignedPackageLatLng] =
    useState<AssignedPackageLatLng | null>(null);
  const [isLinkAvailable, setIsLinkAvailable] = useState(false);

  const assignPackage = (pkg: PackageWithAddress) => {
    setAssignedPackageLatLng((prev) => {
      if (isLinkAvailable) return prev;
      const newLatLng = {
        lat: pkg.latitude,
        lng: pkg.longitude,
        label: `${pkg.city}, ${pkg.street}, ${pkg.postal_code}, ${pkg.country}`,
      };
      setIsLinkAvailable(true);
      return newLatLng;
    });
  };

  useEffect(() => {
    if (!isLinkAvailable) return;

    const timer = setTimeout(() => {
      setIsLinkAvailable(false);

      if (!mapRef.current || !assignedPackageLatLng) return;
      const mapRect = mapRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + mapRect.top - 100;

      window.scrollTo({
        top: scrollTop,
        behavior: animations === "off" ? "auto" : "smooth",
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [animations, assignedPackageLatLng, isLinkAvailable]);

  return {
    mapRef,
    assignPackage,
    assignedPackageLatLng,
    isHrefAvailable: isLinkAvailable,
  };
}
