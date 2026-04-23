import { useState } from "react";
import { SETTINGS_ROUTES, SettingsRoute } from "../types";

export function useSettingsRoute() {
  const [settingsRoute, setSettingsRoute] = useState<SettingsRoute>(
    SETTINGS_ROUTES.general
  );

  const onClickChangeRoute = (route: SettingsRoute) => {
    setSettingsRoute(route);
  };

  return {
    settingsRoute,
    onClickChangeRoute,
  };
}
