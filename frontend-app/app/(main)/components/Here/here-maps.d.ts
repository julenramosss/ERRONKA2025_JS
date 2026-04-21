declare global {
  interface HereMapsViewPort {
    resize(): void;
  }

  interface HereMapsMapObject {
    getBoundingBox(): object;
  }

  interface HereMapsPoint {
    lat: number;
    lng: number;
  }

  interface HereMapsLineString {
    extractPoint(index: number): HereMapsPoint;
  }

  interface HereMapsViewModel {
    setLookAtData(data: object, animate: boolean): void;
  }

  interface HereMapOptions {
    zoom: number;
    center: { lat: number; lng: number };
    pixelRatio: number;
    tilt?: number;
    heading?: number;
    engineType?: unknown;
  }

  interface HereMapsMap {
    addObject(obj: object): void;
    getViewPort(): HereMapsViewPort;
    getViewModel(): HereMapsViewModel;
    getObjects(): HereMapsMapObject[];
    setCenter(coords: { lat: number; lng: number }, animate?: boolean): void;
    setZoom(zoom: number, animate?: boolean): void;
    setRotation(angle: number, animate?: boolean): void;
    dispose(): void;
  }

  interface HereDefaultLayers {
    vector: {
      normal: { map: object; traffic: object };
      terrain: { map: object };
    };
    raster: {
      satellite: { map: object };
      terrain: { map: object };
      normal: { map: object };
    };
  }

  interface HereTurnAction {
    action: string;
    direction?: string;
    instruction: string;
    length: number;
    offset?: number;
  }

  interface HereRoutingResult {
    routes: Array<{
      sections: Array<{
        polyline: string;
        summary: { duration: number; length: number };
        actions: HereTurnAction[];
      }>;
    }>;
  }

  interface HereRoutingService {
    calculateRoute(
      params: {
        origin: string;
        destination: string;
        transportMode: string;
        return: string;
      },
      onSuccess: (result: HereRoutingResult) => void,
      onError: (error: unknown) => void
    ): void;
  }

  interface HerePlatform {
    createDefaultLayers(options?: object): HereDefaultLayers;
    getRoutingService(
      options: object | null,
      version: number
    ): HereRoutingService;
  }

  interface HereMapsNamespace {
    service: {
      Platform: new (options: { apikey: string }) => HerePlatform;
    };
    Map: new (
      el: HTMLElement,
      layer: object,
      options: HereMapOptions
    ) => HereMapsMap;
    mapevents: {
      MapEvents: new (map: HereMapsMap) => object;
      Behavior: new (events: object) => object;
    };
    map: {
      Marker: new (
        coords: { lat: number; lng: number },
        options?: { icon?: object }
      ) => HereMapsMapObject & {
        setGeometry(coords: { lat: number; lng: number }): void;
      };
      DomMarker: new (
        coords: { lat: number; lng: number },
        options?: { icon?: object }
      ) => HereMapsMapObject;
      Icon: new (
        bitmap: string | HTMLElement,
        options?: {
          size?: { w: number; h: number };
          anchor?: { x: number; y: number };
        }
      ) => object;
      DomIcon: new (element: HTMLElement | string, options?: object) => object;
      Polyline: new (
        lineString: object,
        options?: { style?: { strokeColor?: string; lineWidth?: number } }
      ) => HereMapsMapObject;
      render?: {
        RenderEngine: {
          EngineType: {
            P2D: unknown;
          };
        };
      };
    };
    geo: {
      LineString: {
        fromFlexiblePolyline(encoded: string): HereMapsLineString;
      };
    };
    ui: {
      InfoBubble: new (
        coords: { lat: number; lng: number },
        options: { content: string }
      ) => object;
      UI: {
        createDefault(
          map: HereMapsMap,
          layers: object
        ): { addBubble(bubble: object): void };
      };
    };
  }

  interface Window {
    H: HereMapsNamespace;
  }
}

export {};
