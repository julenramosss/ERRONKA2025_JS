import { Icons } from "../../../../components/icons";
import { PakLogo } from "../../../../components/PackLogo";
import { USER_ROLES } from "../../../../utils/types";
import { useMenuDesktop } from "../hooks/useMenuDesktop";
import { MenuOptions } from "./MenuOptions";

export function AsideDesktop() {
  const {
    fullName,
    userName,
    userSurname,
    role,
    isMinimized,
    onClickMinimize,
    onClickLogout,
  } = useMenuDesktop();
  return (
    <aside
      className={`tour-sidebar hidden z-100 sticky top-0 h-screen md:flex flex-col gap-5 bg-bg-surface border-r border-border transition-all duration-200 ${
        isMinimized ? "w-16" : "w-60"
      }`}
    >
      <header
        className={`w-full h-18 px-4 border-b border-border flex gap-3 items-center overflow-hidden ${isMinimized ? "justify-center" : "justify-between"}`}
      >
        <PakLogo size={25} showText={!isMinimized} />
        <button
          className={`tour-sidebar-toggle w-7 h-7 shrink-0 items-center justify-center rounded-full hover:bg-accent-subtle transition-colors text-text-secondary hover:text-text-primary cursor-pointer ${isMinimized ? "hidden" : "flex"}`}
          onClick={() => onClickMinimize()}
        >
          <Icons.ChevronLeft size={20} />
        </button>
      </header>
      <nav
        className={`w-full flex flex-col gap-2 px-2 ${isMinimized ? "items-center" : ""}`}
      >
        {!isMinimized && (
          <h3 className="px-4 text-[10px] text-text-disabled font-bold uppercase tracking-wide">
            {role === USER_ROLES.admin ? "ADMINISTRATZAILEA" : "DISTRIBUIDOREA"}
          </h3>
        )}
        <button
          className={`w-7 h-7 shrink-0 items-center justify-center rounded-full hover:bg-accent-subtle transition-colors text-text-secondary hover:text-text-primary cursor-pointer ${isMinimized ? "flex" : "hidden"}`}
          onClick={() => onClickMinimize()}
        >
          <Icons.ChevronRight size={20} />
        </button>
        <MenuOptions isMinimized={isMinimized} />
      </nav>
      <footer className="tour-sidebar-user w-full mt-auto py-4 px-2 border-t border-border">
        {isMinimized ? (
          <div className="flex flex-col items-center gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #7c3aed 100%)",
              }}
            >
              {userName.slice(0, 1)}
              {userSurname.slice(0, 1)}
            </span>
            <button
              className="p-1 cursor-pointer text-text-secondary hover:text-text-primary group"
              onClick={() => onClickLogout()}
            >
              <Icons.LogOut
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        ) : (
          <div className="w-full bg-bg-elevated px-2 py-2 rounded-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm text-white font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #7c3aed 100%)",
                }}
              >
                {userName.slice(0, 1)}
                {userSurname.slice(0, 1)}
              </span>
              <div className="flex flex-col gap-2 items-start justify-between min-w-0">
                <p className="text-xs font-medium truncate">
                  {fullName.split(" ").slice(0, 2).join(" ")}
                </p>
                <span
                  className={`border text-[9px] rounded font-semibold text-center uppercase px-1 py-0.5 ${
                    role === USER_ROLES.admin
                      ? "border-border-admin bg-bg-admin text-text-admin"
                      : "border-border-focus bg-accent-subtle text-text-secondary"
                  }`}
                >
                  {role === USER_ROLES.admin
                    ? "ADMINISTRATZAILEA"
                    : "DISTRIBUIDOREA"}
                </span>
              </div>
            </div>
            <button
              className="p-1 cursor-pointer text-text-secondary hover:text-text-primary group shrink-0"
              onClick={() => onClickLogout()}
            >
              <Icons.LogOut
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </footer>
    </aside>
  );
}
