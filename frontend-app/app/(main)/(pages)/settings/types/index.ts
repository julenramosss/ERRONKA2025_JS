export const SETTINGS_ROUTES = {
  general: "general",
  security: "security",
  notifications: "notifications",
  appearance: "appearance",
} as const;

export type SettingsRoute =
  (typeof SETTINGS_ROUTES)[keyof typeof SETTINGS_ROUTES];
