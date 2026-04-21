"use client";

import { NavigationControls } from "./components/NavigationControls";
import { NavigationMetricsPanel } from "./components/NavigationMetricsPanel";
import { NavigationStatusPanel } from "./components/NavigationStatusPanel";
import { useDriverNavigation } from "./hooks/useDriverNavigation";
import type { DriverNavigationProps } from "./types";
import { ALERT_DISTANCE_M } from "./utils/mapConstants";

export default function DriverNavigation({
  origin,
  destination,
}: DriverNavigationProps) {
  const {
    currentAction,
    currentPosition,
    gpsStatus,
    mapRef,
    metrics,
    navigationError,
    recenter,
    routeLoading,
    summary,
    toggleVoice,
    voiceEnabled,
  } = useDriverNavigation({ origin, destination });

  const maneuverDistance =
    metrics.distanceToNextActionMeters ?? currentAction?.length ?? null;

  // Show turn alert only when close to a maneuver (not depart) or on error/loading
  const showTurnAlert =
    !!currentAction &&
    currentAction.action !== "depart" &&
    maneuverDistance != null &&
    maneuverDistance <= ALERT_DISTANCE_M;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg-darkest">
      <div ref={mapRef} className="absolute inset-0 z-0 h-full w-full" />

      <NavigationStatusPanel
        currentAction={currentAction}
        maneuverDistance={maneuverDistance}
        navigationError={navigationError}
        routeLoading={routeLoading}
        show={showTurnAlert}
      />

      <NavigationControls
        onRecenter={recenter}
        onToggleVoice={toggleVoice}
        voiceEnabled={voiceEnabled}
        hasPosition={!!currentPosition}
      />

      <NavigationMetricsPanel
        metrics={metrics}
        gpsStatus={gpsStatus}
        summary={summary}
      />
    </div>
  );
}
