import type { PackageStatus } from "../../../../utils/types/api/package.types";
import type {
  RouteStatus,
  RouteStop,
} from "../../../../utils/types/api/route.types";
import type { Coords } from "../../../components/Here/types";

export interface MyRouteHeaderProps {
  onOpenNavigation: (origin: Coords, destination: Coords) => void;
}

export interface RouteStopsListProps {
  selectedStopId: number | null;
  onSelectStop: (stopId: number) => void;
}

export interface RouteStopActionsProps {
  stop: RouteStop;
  isActive: boolean;
  routeStatus: RouteStatus;
  isUpdatingStop: boolean;
  onMarkStop: (
    stop: RouteStop,
    status: Extract<PackageStatus, "delivered" | "failed">
  ) => void;
}

export interface RouteMapPanelProps {
  selectedStopId: number | null;
}

export interface NavigationModalProps {
  origin: Coords | null;
  destination: Coords | null;
  onClose: () => void;
}

export interface NavigationModalProps {
  origin: Coords | null;
  destination: Coords | null;
  onClose: () => void;
}
