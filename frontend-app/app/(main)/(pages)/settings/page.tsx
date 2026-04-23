"use client";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { GeneralSettings } from "./components/GeneralSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { SettingsAside } from "./components/SettingsAside";
import { SettingsMobileAside } from "./components/SettingsMobileAside";
import { useSettingsRoute } from "./hooks/useSettingsRoute";
import { SETTINGS_ROUTES } from "./types";

export default function SettingsPage() {
  const { settingsRoute, onClickChangeRoute } = useSettingsRoute();

  return (
    <div className="px-3 py-4 sm:px-5 md:px-8 md:py-6 lg:px-10">
      <SettingsMobileAside
        settingsRoute={settingsRoute}
        onClickChangeRoute={onClickChangeRoute}
      />
      <div className="relative flex flex-col py-4 md:py-0">
        <div className="flex flex-row gap-5">
          <div className="hidden md:block shrink-0 w-56">
            <SettingsAside
              settingsRoute={settingsRoute}
              onClickChangeRoute={onClickChangeRoute}
            />
          </div>
          <div className="tour-settings-content w-full min-w-0">
            <GeneralSettings
              isActive={settingsRoute === SETTINGS_ROUTES.general}
            />
            <SecuritySettings
              isActive={settingsRoute === SETTINGS_ROUTES.security}
            />
            <AppearanceSettings
              isActive={settingsRoute === SETTINGS_ROUTES.appearance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
