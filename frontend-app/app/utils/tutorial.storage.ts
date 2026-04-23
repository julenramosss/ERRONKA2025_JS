const STORAGE_KEY = "pakag.tutorial.v1";

export interface TutorialState {
  hasSeen: boolean;
}

const DEFAULTS: TutorialState = { hasSeen: false };

let cache: TutorialState | null = null;
const listeners = new Set<() => void>();
let isStorageListenerBound = false;

function notify(): void {
  listeners.forEach((listener) => listener());
}

function bindStorageListener(): void {
  if (isStorageListenerBound || typeof window === "undefined") return;

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    cache = load();
    notify();
  });

  isStorageListenerBound = true;
}

function isTutorialState(value: unknown): value is TutorialState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.hasSeen === "boolean";
}

function load(): TutorialState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed: unknown = JSON.parse(raw);
    if (!isTutorialState(parsed)) return DEFAULTS;
    return parsed;
  } catch {
    return DEFAULTS;
  }
}

function persist(value: TutorialState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Quota full, private mode, etc.
  }
}

export function getTutorialState(): TutorialState {
  if (typeof window === "undefined") return DEFAULTS;
  if (cache === null) cache = load();
  return cache;
}

export function setTutorialState(updates: Partial<TutorialState>): void {
  const next = { ...getTutorialState(), ...updates };
  cache = next;
  persist(next);
  notify();
}

export function subscribeTutorialState(listener: () => void): () => void {
  bindStorageListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDefaultTutorialState(): TutorialState {
  return DEFAULTS;
}
