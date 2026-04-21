"use client";
import { Icons } from "../../../../components/icons";
import { PakLogo } from "../../../../components/PackLogo";
import { USER_ROLES } from "../../../../utils/types";
import { useMenuMobile } from "../hooks/useMenuMobile";
import { MenuOptions } from "./MenuOptions";

export function AsideMobile() {
  const {
    fullName,
    userName,
    userSurname,
    role,
    isOpen,
    onOpen,
    onClose,
    onClickLogout,
  } = useMenuMobile();

  return (
    <>
      {/* Botón hamburguesa — solo visible en móvil */}
      <button
        className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer shadow-md"
        onClick={onOpen}
        aria-label="Abrir menú"
      >
        <Icons.Menu size={23} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-60 flex flex-col gap-5 bg-bg-surface border-r border-border shadow-xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="w-full py-4 px-4 border-b border-border flex items-center justify-between">
          <PakLogo size={25} showText={true} />
          <button
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full hover:bg-accent-subtle transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <Icons.ChevronLeft size={20} />
          </button>
        </header>

        <nav className="w-full flex flex-col gap-2 px-2">
          <h3 className="px-4 text-[10px] text-text-disabled font-bold uppercase tracking-wide">
            {role === USER_ROLES.admin ? "ADMINISTRATZAILEA" : "DISTRIBUIDOREA"}
          </h3>
          <MenuOptions onClose={onClose} />
        </nav>

        <footer className="w-full mt-auto py-4 px-2 border-t border-border">
          <div className="w-full bg-bg-elevated px-2 py-2 rounded-md flex items-center justify-between gap-3">
            <span
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm text-white font-bold"
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
        </footer>
      </aside>
    </>
  );
}
