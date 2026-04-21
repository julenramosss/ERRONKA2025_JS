import type { Coords, HereMarker, NavigationPosition } from "../types";
import { TRUCK_SVG } from "./mapConstants";
import { getNavigationZoom } from "./navigationMetrics";

export function addDriverMarkers({
  destination,
  map,
  origin,
}: {
  destination: Coords;
  map: HereMapsMap;
  origin: Coords;
}): HereMarker {
  const H = window.H;
  const truckIcon = new H.map.Icon(TRUCK_SVG, {
    size: { w: 32, h: 44 },
    anchor: { x: 16, y: 22 },
  });
  const driverMarker = new H.map.Marker(origin, { icon: truckIcon });
  const destinationMarker = new H.map.Marker(destination);

  map.addObject(driverMarker);
  map.addObject(destinationMarker);

  return driverMarker;
}

export function addRoutePolyline(
  map: HereMapsMap,
  lineString: HereMapsLineString
): void {
  const H = window.H;
  const polyline = new H.map.Polyline(lineString, {
    style: { strokeColor: "#7c3aed", lineWidth: 7 },
  });

  map.addObject(polyline);
  map.getViewModel().setLookAtData(
    { bounds: polyline.getBoundingBox() },
    true
  );
}

export function focusMapOnPosition(
  map: HereMapsMap,
  position: NavigationPosition,
  animate: boolean
): void {
  map.getViewModel().setLookAtData(
    {
      position: position.coords,
      zoom: getNavigationZoom(position.speed),
      tilt: 0,
      heading: 0,
    },
    animate
  );
}
