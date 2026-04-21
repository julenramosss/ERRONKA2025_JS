import type { PackageStatus } from "../../../../utils/types/api/package.types";
import type { RouteStatus, RouteStop } from "../../../../utils/types/api/route.types";
import type { Coords } from "../../../components/Here/types";

export interface MyRouteHeaderProps {
  routeDateLabel: string;
  routeStatusLabel: string;
  totalStops: number;
  completedStops: number;
  isToday: boolean;
  isStartingRoute: boolean;
  canStartRoute: boolean;
  actionError: string | null;
  startButtonLabel: string;
  onStartRoute: () => void;
}

export interface RouteProgressProps {
  totalStops: number;
  completedStops: number;
  activeStopOrder: number | null;
}

export interface RouteStopsListProps {
  stops: RouteStop[];
  selectedStopId: number | null;
  activeStopId: number | null;
  isToday: boolean;
  routeStatus: RouteStatus;
  isUpdatingStop: boolean;
  onSelectStop: (stopId: number) => void;
  onMarkStop: (stop: RouteStop, status: Extract<PackageStatus, "delivered" | "failed">) => void;
}

export interface RouteStopActionsProps {
  stop: RouteStop;
  isActive: boolean;
  isToday: boolean;
  routeStatus: RouteStatus;
  isUpdatingStop: boolean;
  onMarkStop: (stop: RouteStop, status: Extract<PackageStatus, "delivered" | "failed">) => void;
}

export interface RouteMapPanelProps {
  selectedStop: RouteStop | null;
  activeStop: RouteStop | null;
  isToday: boolean;
  isOpeningNavigation: boolean;
  onOpenNavigation: () => void;
}

export interface NavigationModalProps {
  origin: Coords | null;
  destination: Coords | null;
  onClose: () => void;
}
