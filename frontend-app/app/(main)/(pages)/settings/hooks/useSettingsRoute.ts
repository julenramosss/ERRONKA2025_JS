import { useState } from 'react';
import { SETTINGS_ROUTES, SettingsRoute } from '../types';
import { redirect } from 'next/navigation';

export function useSettingsRoute() {
  const [settingsRoute, setSettingsRoute] = useState<SettingsRoute>(
    SETTINGS_ROUTES.general
  );

  const onClickChangeRoute = (route: SettingsRoute) => {
    if (route === SETTINGS_ROUTES.documentation) {
      redirect('https://docs.tolosaerronka.es/');
    }
    setSettingsRoute(route);
  };

  return {
    settingsRoute,
    onClickChangeRoute,
  };
}
