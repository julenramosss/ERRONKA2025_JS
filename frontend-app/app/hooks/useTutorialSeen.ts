"use client";

import { useSyncExternalStore } from "react";
import {
  getDefaultTutorialState,
  getTutorialState,
  subscribeTutorialState,
  TutorialState,
} from "../utils/tutorial.storage";

export function useTutorialSeen(pathName: keyof TutorialState): boolean {
  return useSyncExternalStore(
    subscribeTutorialState,
    () => getTutorialState(pathName).hasSeen ?? false,
    () => getDefaultTutorialState()[pathName].hasSeen ?? false
  );
}
