import Link from "next/link";
import { Icons } from "../../../components/icons";
import { PackageWithAddress } from "../../../utils/types/api/package.types";
import { GetMyDailyRouteResponse } from "../../../utils/types/api/route.types";

export function DashboardHeader({
  todayDay,
  userName,
  todayPackagesData,
  todayRoutesData,
}: {
  todayDay: string;
  userName?: string;
  todayPackagesData: PackageWithAddress[];
  todayRoutesData: {
    todayRouteHours: string | null;
    todayRouteStops: number;
  } | null;
}) {
  return (
    <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-6">
      <div className="flex items-start justify-between flex-col">
        <h3 className="text-[10px] sm:text-sm uppercase text-accent-light font-semibold">
          {todayDay}
        </h3>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2">
          Egun on, {userName?.split(" ").slice(0, 1).join(" ")}! 👋
        </h1>
        {todayPackagesData.length > 0 && (
          <p className="text-xs sm:text-base text-text-secondary text-balance mt-5">
            Gaur{" "}
            <span className="font-semibold text-accent-light text-balance">
              {todayPackagesData?.length} pakete pendiente
            </span>{" "}
            entregatzeko dituzu{" "}
            <span
              className={`${todayRoutesData?.todayRouteStops === 0 ? "hidden" : ""} font-semibold text-accent-light text-balance`}
            >
              <span className="font-semibold text-accent-light text-balance">
                · {todayRoutesData?.todayRouteStops} geltoki eta{" "}
                {todayRoutesData?.todayRouteHours} irauten duen ibilbidea{" "}
              </span>
              daukazu
            </span>
          </p>
        )}
      </div>
      <div>
        <Link
          href="/myRoute"
          className="flex items-center justify-between gap-3 font-semibold text-text-primary bg-accent rounded-md px-4 py-2 shadow-[0_0_20px_4px] shadow-accent/40 hover:bg-accent-hover hover:shadow-accent/60 transition-all"
        >
          <Icons.Route />
          <span>Ibilbidea hasi</span>
        </Link>
      </div>
    </div>
  );
}
