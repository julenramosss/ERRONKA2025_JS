"use client";
import { Skeleton } from "boneyard-js/react";
import { PackageDetailLoader } from "./components/loaders/PackageDetail.loader";
import { redirect } from "next/dist/client/components/navigation";
import { usePackageDetails } from "./hooks/usePackageDetails";
import { PackageStatusHistory } from "./components/PackageStatusHistory";
import { PackageInfoCard } from "./components/PackageInfoCard";
import { PackageDetailHeader } from "./components/PackageDetailHeader";
import { DeliveryLocation } from "./components/DeliveryLocation";

export default function PackageDetailPage() {
  const { pkg, logs, logsLoading, isLoading, isError } = usePackageDetails();

  if (!isLoading && isError) redirect("/404");

  return (
    <div className="px-4 md:px-8 lg:px-10 flex flex-col gap-6">
      <Skeleton
        name="pkg-detail"
        loading={isLoading}
        fallback={<PackageDetailLoader />}
      >
        {pkg && (
          <>
            <PackageDetailHeader pkg={pkg} />
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
              <div className="flex flex-col gap-5">
                <PackageInfoCard pkg={pkg} />
                <PackageStatusHistory logs={logs} isLoading={logsLoading} />
              </div>
              <DeliveryLocation pkg={pkg} />
            </div>
          </>
        )}
      </Skeleton>
    </div>
  );
}
