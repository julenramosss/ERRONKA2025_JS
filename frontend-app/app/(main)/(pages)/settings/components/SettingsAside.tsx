import { Icons } from "../../../../components/icons";
import { SETTINGS_ROUTES, SettingsRoute } from "../types";

export function SettingsAside({
  settingsRoute,
  onClickChangeRoute,
  hideTitle = false,
}: {
  settingsRoute: SettingsRoute;
  onClickChangeRoute: (route: SettingsRoute) => void;
  hideTitle?: boolean;
}) {
  const items = [
    {
      route: SETTINGS_ROUTES.general,
      label: "Generala",
      icon: <Icons.User size={20} />,
    },
    {
      route: SETTINGS_ROUTES.notifications,
      label: "Notifikazioak",
      icon: <Icons.Bell size={20} />,
    },
    {
      route: SETTINGS_ROUTES.security,
      label: "Segurtasuna",
      icon: <Icons.Shield size={20} />,
    },
    {
      route: SETTINGS_ROUTES.appearance,
      label: "Itxura",
      icon: <Icons.Moon size={20} />,
    },
  ];

  return (
    <div className="tour-settings-aside flex flex-col gap-5 ">
      {!hideTitle && (
        <div className="flex flex-col items-start justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Konfigurazioa
          </h2>
          <p className="mt-1 hidden text-sm text-text-secondary sm:block">
            Zure kontuaren konfigurazioa hemen kudeatu dezakezu.
          </p>
        </div>
      )}
      <ul className="flex flex-col gap-2 text-text-secondary">
        {items.map(({ route, label, icon }) => {
          const isActive = settingsRoute === route;
          return (
            <li
              key={route}
              className={`flex w-full rounded-md ${
                isActive
                  ? "bg-accent-subtle border-l-2 border-border-focus text-accent-light cursor-default"
                  : "hover:bg-bg-elevated cursor-pointer"
              }`}
            >
              <button
                className="flex flex-1 text-base font-semibold items-center gap-3 py-2 pl-4 pr-8 cursor-pointer"
                onClick={() => onClickChangeRoute(route)}
              >
                {icon}
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
