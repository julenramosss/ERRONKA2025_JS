export const SETTINGS_ROUTES = {
  general: 'general',
  security: 'security',
  appearance: 'appearance',
  documentation: 'documentation',
} as const;

export type SettingsRoute =
  (typeof SETTINGS_ROUTES)[keyof typeof SETTINGS_ROUTES];
