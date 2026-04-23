"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { STATUS, useJoyride, type Status } from "react-joyride";
import { usePreferences } from "../hooks/usePreferences";
import { useTutorialSeen } from "../hooks/useTutorialSeen";
import { setPreferences } from "../utils/preferences";
import { getStepsForPath } from "../utils/constants/steps.Joyride";
import { setTutorialState } from "../utils/tutorial.storage";
import { TutorialTooltip } from "../components/tutorial/TutorialTooltip";

interface TutorialContextValue {
  isRunning: boolean;
  hasSteps: boolean;
  restart: () => void;
  dismiss: () => void;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

const FINAL_STATUSES: Status[] = [STATUS.FINISHED, STATUS.SKIPPED];

export function TutorialProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { showTutorial } = usePreferences();
  const hasSeen = useTutorialSeen();

  const steps = useMemo(
    () => getStepsForPath(pathname, !hasSeen),
    [pathname, hasSeen]
  );
  const hasSteps = steps.length > 0;
  const shouldRun = showTutorial && !hasSeen && hasSteps;

  const { Tour } = useJoyride({
    continuous: true,
    run: shouldRun,
    steps,
    scrollToFirstStep: true,
    tooltipComponent: TutorialTooltip,
    options: {
      zIndex: 10000,
      arrowSize: 10,
      spotlightPadding: 6,
      spotlightRadius: 12,
      skipBeacon: true,
      primaryColor: "#7c3aed",
      backgroundColor: "#231d35",
      textColor: "#f5f3ff",
      arrowColor: "#231d35",
      overlayColor: "rgba(14, 11, 22, 0.72)",
    },
    onEvent: (data) => {
      if (FINAL_STATUSES.includes(data.status)) {
        setTutorialState({ hasSeen: true });
      }
    },
  });

  const restart = useCallback(() => {
    setPreferences({ showTutorial: true });
    setTutorialState({ hasSeen: false });
  }, []);

  const dismiss = useCallback(() => {
    setTutorialState({ hasSeen: true });
  }, []);

  const value = useMemo<TutorialContextValue>(
    () => ({ isRunning: shouldRun, hasSteps, restart, dismiss }),
    [shouldRun, hasSteps, restart, dismiss]
  );

  return (
    <TutorialContext.Provider value={value}>
      {Tour}
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial(): TutorialContextValue {
  const ctx = useContext(TutorialContext);
  if (!ctx) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return ctx;
}
