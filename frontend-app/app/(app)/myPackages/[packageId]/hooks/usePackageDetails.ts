import { redirect, useParams } from "next/navigation";
import { usePackageById } from "../../../../hooks/packages/usePackageById";
import { usePackageLogs } from "../../../../hooks/packages/usePackageLogs";

export function usePackageDetails() {
  const { packageId: packageIdParam }: { packageId: string } = useParams();
  const packageId = parseInt(packageIdParam);

  if (!/^\d+$/.test(packageIdParam) || Number.isNaN(packageId)) {
    redirect("/404");
  }

  const {
    data: pkg,
    isLoading: pkgLoading,
    isError,
  } = usePackageById(packageId);

  const { data: logsData, isLoading: logsLoading } = usePackageLogs({
    packageId,
    limit: 50,
  });

  return {
    pkg,
    logs: logsData?.logs ?? [],
    isLoading: pkgLoading,
    logsLoading,
    isError,
  };
}
