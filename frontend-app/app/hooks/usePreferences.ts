"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  AppPreferences,
  getDefaultPreferences,
  getPreferences,
  setPreferences,
  subscribePreferences,
} from "../utils/preferences";

export function usePreferences(): AppPreferences {
  return useSyncExternalStore(
    subscribePreferences,
    getPreferences,
    getDefaultPreferences
  );
}

export function useSetPreference<K extends keyof AppPreferences>(key: K) {
  return useCallback(
    (value: AppPreferences[K]) => {
      setPreferences({ [key]: value } as Partial<AppPreferences>);
    },
    [key]
  );
}
