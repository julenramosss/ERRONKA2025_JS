const STORAGE_KEY = 'tutorial.v1';

export interface TutorialHasSeen {
  hasSeen: boolean;
}

export interface TutorialState {
  dashboard: TutorialHasSeen;
  myPackages: TutorialHasSeen;
  myRoute: TutorialHasSeen;
  history: TutorialHasSeen;
  settings: TutorialHasSeen;
}

export const DEFAULTS_TUTORIAL: TutorialState = {
  dashboard: { hasSeen: false },
  myPackages: { hasSeen: false },
  myRoute: { hasSeen: false },
  history: { hasSeen: false },
  settings: { hasSeen: false },
};

let cache: TutorialState | null = null;
const listeners = new Set<() => void>();
let isStorageListenerBound = false;

function notify(): void {
  listeners.forEach((listener) => listener());
}

function bindStorageListener(): void {
  if (isStorageListenerBound || typeof window === 'undefined') return;

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    cache = load();
    notify();
  });

  isStorageListenerBound = true;
}

function isTutorialState(value: unknown): value is TutorialState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.dashboard === 'object' &&
    typeof v.myPackages === 'object' &&
    typeof v.myRoute === 'object' &&
    typeof v.history === 'object' &&
    typeof v.settings === 'object'
  );
}

function load(): TutorialState {
  if (typeof window === 'undefined') return DEFAULTS_TUTORIAL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS_TUTORIAL;
    const parsed: unknown = JSON.parse(raw);
    if (!isTutorialState(parsed)) return DEFAULTS_TUTORIAL;
    return parsed;
  } catch {
    return DEFAULTS_TUTORIAL;
  }
}

function persist(value: Partial<TutorialState>): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = load();
    // Agregate the new value with the stored one to avoid overwriting unseen states when only updating a part of the tutorial state.
    const storedMerged = { ...stored, ...value };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedMerged));
  } catch {
    // Quota full, private mode, etc.
  }
}

export function getTutorialState(key: keyof TutorialState): TutorialHasSeen {
  if (typeof window === 'undefined') return DEFAULTS_TUTORIAL[key];
  if (cache === null) cache = load();

  if (typeof cache[key] === 'undefined') return DEFAULTS_TUTORIAL[key];
  if (typeof cache[key] === 'string') return DEFAULTS_TUTORIAL[key];
  return cache[key] ?? DEFAULTS_TUTORIAL[key];
}

export function resetTutorialState(): void {
  cache = DEFAULTS_TUTORIAL;
  persist(DEFAULTS_TUTORIAL);
  notify();
}

export function setTutorialState(updates: Partial<TutorialState>): void {
  if (cache === null) cache = load();
  const next = { ...cache, ...updates };
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
  return DEFAULTS_TUTORIAL;
}
