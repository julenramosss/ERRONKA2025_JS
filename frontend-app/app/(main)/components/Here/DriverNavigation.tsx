"use client";

import { NavigationControls } from "./components/NavigationControls";
import { NavigationMetricsPanel } from "./components/NavigationMetricsPanel";
import { NavigationStatusPanel } from "./components/NavigationStatusPanel";
import { useDriverNavigation } from "./hooks/useDriverNavigation";
import type { DriverNavigationProps } from "./types";

export default function DriverNavigation({
  origin,
  destination,
}: DriverNavigationProps) {
  const {
    currentAction,
    currentPosition,
    isRouteReady,
    mapRef,
    metrics,
    navigating,
    navigationError,
    nextAction,
    recenter,
    routeLoading,
    startNavigation,
    stopNavigation,
    summary,
    toggleVoice,
    voiceEnabled,
  } = useDriverNavigation({ origin, destination });

  const maneuverDistance =
    metrics.distanceToNextActionMeters ?? currentAction?.length ?? null;

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-bg-darkest">
      <div ref={mapRef} className="absolute inset-0 z-0 h-full w-full" />

      <NavigationStatusPanel
        currentAction={currentAction}
        maneuverDistance={maneuverDistance}
        navigationError={navigationError}
        routeLoading={routeLoading}
      />

      <NavigationControls
        onRecenter={recenter}
        onToggleVoice={toggleVoice}
        voiceEnabled={voiceEnabled}
      />

      <NavigationMetricsPanel
        currentPosition={currentPosition}
        isRouteReady={isRouteReady}
        metrics={metrics}
        navigating={navigating}
        nextAction={nextAction}
        onStart={startNavigation}
        onStop={stopNavigation}
        summary={summary}
      />
    </div>
  );
}
