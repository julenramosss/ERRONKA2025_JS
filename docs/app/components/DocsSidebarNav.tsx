"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface DocsSidebarNavProps {
  locale: string;
  navItems: NavItem[];
  onClose?: () => void;
}

export function DocsSidebarNav({
  locale,
  navItems,
  onClose,
}: DocsSidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  function navigate(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    onClose?.();

    const scrollContainer = document.getElementById("docs-scroll");

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => {
        scrollContainer?.scrollTo({ top: 0 });
        router.push(href);
      });
    } else {
      scrollContainer?.scrollTo({ top: 0 });
      router.push(href);
    }
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {navItems.map(({ href, label }) => {
        const fullHref = `/${locale}${href === "/" ? "" : href}`;
        const isActive =
          href === "/"
            ? pathname === `/${locale}` || pathname === `/${locale}/`
            : pathname.startsWith(fullHref);

        return (
          <li key={href}>
            <Link
              href={fullHref}
              onClick={(e) => navigate(e, fullHref)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-subtle border-l-2 border-border-focus text-accent-light cursor-default pointer-events-none"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isActive ? "bg-accent-light" : "bg-text-disabled"
                }`}
              />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
