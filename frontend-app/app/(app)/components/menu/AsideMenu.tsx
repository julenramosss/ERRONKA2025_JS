"use client";
import { usePathname } from "next/navigation";
import { Icons } from "../../../components/icons";
import { PakLogo } from "../../../components/PackLogo";

export function AsideMenu() {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col gap-5 w-60 bg-bg-surface border-r border-border">
      <header className="w-full py-4 px-4 border-b border-border">
        <PakLogo size={25} showText={true} />
      </header>
      <nav className="w-full flex flex-col gap-2 px-4">
        <h3 className="px-4 text-[10px] text-text-disabled font-bold uppercase tracking-wide">
          DISTRIBUIDOREA
        </h3>
        <div>
          <ul className="flex flex-col gap-2 text-text-secondary">
            <li
              className={`w-full rounded-md ${pathname === "/dashboard" ? "bg-accent-subtle border-l-2 border-border-focus text-accent-light cursor-default" : "hover:bg-accent-subtle cursor-pointer"}`}
            >
              <a
                href={pathname === "/dashboard" ? "#" : "/dashboard"}
                className={`flex text-sm font-semibold items-center gap-2 px-4 py-2 ${pathname === "/dashboard" ? "cursor-default" : ""}`}
              >
                <Icons.Home size={15} />
                Dashboard
              </a>
            </li>
            <li
              className={`w-full rounded-md ${pathname === "/profile" ? "bg-accent-subtle border-l-2 border-border-focus text-accent-light cursor-default" : "hover:bg-accent-subtle cursor-pointer"}`}
            >
              <a
                href={pathname === "/profile" ? "#" : "/profile"}
                className={`flex text-sm font-semibold items-center gap-2 px-4 py-2 ${pathname === "/profile" ? "cursor-default" : ""}`}
              >
                <Icons.User size={15} />
                Profila
              </a>
            </li>
            <li
              className={`w-full rounded-md ${pathname === "/settings" ? "bg-accent-subtle border-l-2 border-border-focus text-accent-light cursor-default" : "hover:bg-accent-subtle cursor-pointer"}`}
            >
              <a
                href={pathname === "/settings" ? "#" : "/settings"}
                className={`flex text-sm font-semibold items-center gap-2 px-4 py-2 ${pathname === "/settings" ? "cursor-default" : ""}`}
              >
                <Icons.Settings size={15} />
                Ezarpenak
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
