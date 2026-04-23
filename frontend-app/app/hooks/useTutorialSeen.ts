"use client";

import { useSyncExternalStore } from "react";
import {
  getDefaultTutorialState,
  getTutorialState,
  subscribeTutorialState,
} from "../utils/tutorial.storage";

export function useTutorialSeen(): boolean {
  return useSyncExternalStore(
    subscribeTutorialState,
    () => getTutorialState().hasSeen,
    () => getDefaultTutorialState().hasSeen
  );
}
