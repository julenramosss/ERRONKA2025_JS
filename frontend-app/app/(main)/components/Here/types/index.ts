import type { CSSProperties, ReactNode, Ref } from "react";

export type CoordinateValue = number | string | null | undefined;
export type Coordinates = { lat: number; lng: number };
export type Coords = Coordinates;
export type AnimationFrameRef = { current: number | null };

export type HereMarker = HereMapsMapObject & {
  setGeometry(coords: Coordinates): void;
};

export interface HereMapProps {
  reference?: Ref<HTMLDivElement>;
  center: { lat?: CoordinateValue; lng?: CoordinateValue };
  label?: string;
  height?: string;
}

export interface NoHereMapProps {
  height: string;
}

export interface UseHereMapOptions {
  center: { lat?: CoordinateValue; lng?: CoordinateValue };
}

export interface DriverNavigationProps {
  origin: Coords;
  destination: Coords;
}

export interface NavigationAction extends HereTurnAction {
  coords: Coords | null;
}

export interface NavigationPosition {
  coords: Coords;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface NavigationMetrics {
  remainingDistanceMeters: number | null;
  distanceToNextActionMeters: number | null;
  speedKmh: number | null;
  accuracyMeters: number | null;
  eta: Date | null;
}

export type RouteSummary = { duration: number; length: number };

export interface NavigationRoute {
  actions: NavigationAction[];
  lineString: HereMapsLineString;
  summary: RouteSummary;
}

export interface MapInstanceRef {
  map: HereMapsMap;
  driverMarker: HereMarker;
  resizeObserver: ResizeObserver;
}

export interface UseDriverRouteMapOptions {
  destination: Coords;
  hereApiKey: string;
  loaded: boolean;
  origin: Coords;
  stopWatchingPosition: () => void;
}

export interface TurnIconProps {
  action: string;
  direction?: string;
  compact?: boolean;
}

export interface StatusRowProps {
  icon: ReactNode;
  children: ReactNode;
}

export interface MetricProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export interface NavigationStatusPanelProps {
  routeLoading: boolean;
  navigationError: string | null;
  currentAction: NavigationAction | null;
  maneuverDistance: number | null;
}

export interface NavigationControlsProps {
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onRecenter: () => void;
}

export interface NavigationMetricsPanelProps {
  currentPosition: NavigationPosition | null;
  isRouteReady: boolean;
  metrics: NavigationMetrics;
  navigating: boolean;
  nextAction: NavigationAction | null;
  onStart: () => void;
  onStop: () => void;
  summary: RouteSummary | null;
}

export interface TurnIconRenderOptions {
  size: number;
  style?: CSSProperties;
}
