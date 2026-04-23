"use client";

import { useLayoutEffect } from "react";
import { usePreferences } from "../hooks/usePreferences";

export function PreferencesSync() {
  const { animations } = usePreferences();

  useLayoutEffect(() => {
    document.documentElement.dataset.animations = animations;
  }, [animations]);

  return null;
}
