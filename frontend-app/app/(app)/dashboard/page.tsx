"use client";
import { Skeleton } from "boneyard-js/react";
import { DashboardHeader } from "./components/DashboardHeader";
import { NextDeliveries } from "./components/NextDeliveries";
import { RecentActivity } from "./components/RecentActivity";
import { StatCards } from "./components/StatCards";
import { useDashboardData } from "./hooks/useDashboardData";
import { HeroLoader } from "./components/loaders/Hero.loader";
import { StatsCardsLoader } from "./components/loaders/StatsCards.loader";
import { PackageInfoLoader } from "./components/loaders/PackageInfo.loader";

export default function DashboardPage() {
  const {
    userData,
    packagesData,
    todayPackagesData,
    todayRoutesData,
    todayDay,
    isUserLoading,
    isPackagesLoading,
  } = useDashboardData();

  const packages = packagesData ?? [];

  return (
    <div className="py-6 px-4 md:px-8 lg:px-10 flex flex-col gap-6">
      <Skeleton
        name="dashboard-hero"
        loading={isUserLoading}
        fallback={<HeroLoader />}
      >
        <DashboardHeader
          todayDay={todayDay}
          userName={userData?.name}
          todayPackagesData={todayPackagesData || []}
          todayRoutesData={todayRoutesData || null}
        />
      </Skeleton>

      <Skeleton
        name="dashboard-stat-cards"
        loading={isPackagesLoading}
        fallback={<StatsCardsLoader />}
      >
        <StatCards packagesData={packages} />
      </Skeleton>

      <Skeleton
        name="dashboard-recent-activity"
        loading={isPackagesLoading}
        fallback={<PackageInfoLoader />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <NextDeliveries packages={packages} />
          <RecentActivity packages={packages} />
        </div>
      </Skeleton>
    </div>
  );
}
