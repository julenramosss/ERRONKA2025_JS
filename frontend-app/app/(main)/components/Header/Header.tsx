"use client";
import Link from "next/link";
import { useRef } from "react";
import { Icons } from "../../../components/icons";
import { AsideMobile } from "../AsideMenu/components/AsideMobile";
import { SearchMobile } from "./SearcMobile";
import { useHeader } from "./useHeader";
import { useSearchShortcut } from "./useSearchShortcut";
import { HeaderCorner } from "./HeaderCorner";

export function Header() {
  const { pathname, userName, userSurname } = useHeader();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shortcut = useSearchShortcut(searchInputRef);

  return (
    <header className="z-100 sticky top-0 w-full h-18 bg-bg-elevated border-b border-border flex items-center justify-between px-2 md:px-10">
      <HeaderCorner />
      <div className="flex items-center justify-start gap-4">
        <AsideMobile />
        <div className="tour-header-breadcrumb flex items-center justify-start gap-2">
          <Link
            aria-disabled={pathname === "/dashboard"}
            href={pathname === "/dashboard" ? "" : "/dashboard"}
            className={`text-text-secondary hover:text-text-primary ${pathname === "/dashboard" ? "pointer-events-none" : ""}`}
          >
            pakAg
          </Link>
          {pathname.split("/").map((segment, index) => {
            if (index === 0) return null;
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="text-text-disabled">
                  <Icons.ChevronRight size={20} />
                </span>
                <span className="m-0 text-text-primary font-semibold">
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* SEARCH INPUT DESKTOP */}
      <div className="flex flex-1 h-full items-center justify-end gap-4">
        <div className="tour-header-search hidden sm:flex flex-1 max-w-xs lg:max-w-md bg-bg-surface items-center gap-2 px-3 py-1 rounded-md border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors placeholder:text-text-secondary">
          <Icons.Search size={16} className="text-text-secondary shrink-0" />
          <kbd
            className="hidden md:inline-flex items-center gap-0.5 shrink-0 font-mono text-[10px] leading-none font-semibold text-text-secondary bg-bg-dark border border-border rounded px-1.5 py-1 select-none"
            aria-label={`Atajo: ${shortcut.modifier} + ${shortcut.key}`}
          >
            <span>{shortcut.modifier}</span>
            <span>+</span>
            <span>{shortcut.key}</span>
          </kbd>
          <input
            ref={searchInputRef}
            type="text"
            name="search"
            autoComplete="off"
            maxLength={200}
            className="w-full bg-transparent px-1 py-2 focus:outline-none text-white"
            placeholder="Bilatu pakete bat..."
          />
        </div>
        {/* ICON SEARCH ONLY MOBILE */}
        <SearchMobile />
        <span
          className="hidden lg:flex w-10 h-10 shrink-0 rounded-full items-center justify-center text-sm text-white font-bold"
          style={{
            background:
              "linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #7c3aed 100%)",
          }}
        >
          {userName.slice(0, 1)}
          {userSurname.slice(0, 1)}
        </span>
      </div>
    </header>
  );
}
