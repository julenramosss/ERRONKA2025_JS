import type { Ref } from "react";

export type GpsStatus =
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable"
  | "arrived";

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
