import type { Coords } from '../types';

export function createHerePlatform(apiKey: string): HerePlatform | null {
  const H = window.H as HereMapsNamespace | undefined;
  if (!H?.service) return null;
  return new H.service.Platform({ apikey: apiKey });
}

export function createRasterHereMap({
  apiKey,
  center,
  container,
  zoom,
}: {
  apiKey: string;
  center: Coords;
  container: HTMLElement;
  zoom: number;
}): { map: HereMapsMap; platform: HerePlatform } | null {
  const H = window.H as HereMapsNamespace | undefined;
  const platform = createHerePlatform(apiKey);
  if (!H?.Map || !platform) return null;

  const engineType = H.map.render?.RenderEngine?.EngineType?.P2D;
  const layers = platform.createDefaultLayers();
  // Raster tiles only work correctly with P2D engine.
  // When P2D is unavailable, Tangram (vector renderer) is default → must use vector tiles.
  const baseLayer = engineType
    ? layers.raster.normal.map
    : layers.vector.normal.map;

  const options: HereMapOptions = {
    zoom,
    center,
    pixelRatio: window.devicePixelRatio || 1,
    tilt: 0,
    heading: 0,
  };

  if (engineType) options.engineType = engineType;

  return {
    map: new H.Map(container, baseLayer, options),
    platform,
  };
}

export function enableMapBehavior(map: HereMapsMap): void {
  const H = window.H as HereMapsNamespace | undefined;
  if (!H?.mapevents) return;
  new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
}
