export type AnimationsPref = 'on' | 'off';
export type DateFormatPref = 'short' | 'long';

export interface AppPreferences {
  animations: AnimationsPref;
  dateFormat: DateFormatPref;
  showTutorial: boolean;
}

const STORAGE_KEY = 'pakag.prefs.v1';

const DEFAULTS: AppPreferences = {
  animations: 'on',
  dateFormat: 'short',
  showTutorial: true,
};

let cache: AppPreferences | null = null;
const listeners = new Set<() => void>();
let isStorageListenerBound = false;

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function bindStorageListener(): void {
  if (isStorageListenerBound || typeof window === 'undefined') return;

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    cache = load();
    notifyListeners();
  });

  isStorageListenerBound = true;
}

function isAppPreferences(value: unknown): value is AppPreferences {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    (v.animations === 'on' || v.animations === 'off') &&
    (v.dateFormat === 'short' || v.dateFormat === 'long') &&
    typeof v.showTutorial === 'boolean'
  );
}

function load(): AppPreferences {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed: unknown = JSON.parse(raw);
    if (!isAppPreferences(parsed)) return DEFAULTS;
    return parsed;
  } catch {
    return DEFAULTS;
  }
}

function persist(value: AppPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignoramos: quota llena, modo privado, etc.
  }
}

export function getPreferences(): AppPreferences {
  if (typeof window === 'undefined') return DEFAULTS;
  if (cache === null) cache = load();
  return cache;
}

export function setPreferences(updates: Partial<AppPreferences>): void {
  const next = { ...getPreferences(), ...updates };
  cache = next;
  persist(next);
  notifyListeners();
}

export function subscribePreferences(listener: () => void): () => void {
  bindStorageListener();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getDefaultPreferences(): AppPreferences {
  return DEFAULTS;
}
