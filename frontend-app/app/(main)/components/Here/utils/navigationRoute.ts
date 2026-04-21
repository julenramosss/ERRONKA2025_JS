import type { Coords, NavigationAction, NavigationRoute } from "../types";

export function calculateNavigationRoute({
  destination,
  origin,
  platform,
}: {
  destination: Coords;
  origin: Coords;
  platform: HerePlatform;
}): Promise<NavigationRoute> {
  return new Promise((resolve, reject) => {
    const H = window.H as HereMapsNamespace | undefined;
    if (!H?.geo) {
      reject(new Error("HERE geo module is not available."));
      return;
    }

    const router = platform.getRoutingService(null, 8);
    router.calculateRoute(
      {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        transportMode: "car",
        return: "polyline,turnByTurnActions,summary,actions",
      },
      (result) => {
        const section = result.routes[0]?.sections[0];
        if (!section) {
          reject(new Error("Route section is missing."));
          return;
        }

        const lineString = H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );
        resolve({
          actions: buildRouteActions(section.actions ?? [], lineString),
          lineString,
          summary: section.summary,
        });
      },
      reject
    );
  });
}

function buildRouteActions(
  actions: HereTurnAction[],
  lineString: HereMapsLineString
): NavigationAction[] {
  return actions.map((action) => ({
    ...action,
    coords:
      typeof action.offset === "number"
        ? extractActionCoords(lineString, action.offset)
        : null,
  }));
}

function extractActionCoords(
  lineString: HereMapsLineString,
  offset: number
): Coords | null {
  try {
    const point = lineString.extractPoint(offset);
    return { lat: point.lat, lng: point.lng };
  } catch {
    return null;
  }
}
