"use client";

import { useCallback } from "react";
import { usePreferences } from "../../../../hooks/usePreferences";
import { setPreferences } from "../../../../utils/preferences";
import type { DateFormatPref } from "../../../../utils/preferences";
import { formatLongDate, formatShortDate } from "../../../../utils/date.utils";

export function useAppearanceSettings() {
  const { animations, dateFormat, showTutorial } = usePreferences();

  const toggleAnimations = useCallback(() => {
    setPreferences({ animations: animations === "on" ? "off" : "on" });
  }, [animations]);

  const changeDateFormat = useCallback((value: DateFormatPref) => {
    setPreferences({ dateFormat: value });
  }, []);

  const toggleShowTutorial = useCallback(() => {
    setPreferences({ showTutorial: !showTutorial });
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
