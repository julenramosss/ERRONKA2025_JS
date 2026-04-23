"use client";

import { useCallback } from "react";
import { usePreferences } from "../../../../hooks/usePreferences";
import { setPreferences } from "../../../../utils/preferences";
import type { DateFormatPref } from "../../../../utils/preferences";
import { formatLongDate, formatShortDate } from "../../../../utils/date.utils";
import { setTutorialState } from "../../../../utils/tutorial.storage";

export function useAppearanceSettings() {
  const { animations, dateFormat, showTutorial } = usePreferences();

  const toggleAnimations = useCallback(() => {
    setPreferences({ animations: animations === "on" ? "off" : "on" });
  }, [animations]);

  const changeDateFormat = useCallback((value: DateFormatPref) => {
    setPreferences({ dateFormat: value });
  }, []);

  const toggleShowTutorial = useCallback(() => {
    const next = !showTutorial;
    setPreferences({ showTutorial: next });
    // Turning the toggle on replays the tutorial from scratch on the next
    // navigation; turning it off is handled by the provider stopping any
    // running tour.
    if (next) setTutorialState({ hasSeen: false });
  }, [showTutorial]);

  const now = new Date();

  return {
    animations,
    dateFormat,
    showTutorial,
    toggleAnimations,
    changeDateFormat,
    toggleShowTutorial,
    shortSample: formatShortDate(now),
    longSample: formatLongDate(now),
  };
}
