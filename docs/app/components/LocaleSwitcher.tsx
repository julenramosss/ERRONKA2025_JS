"use client";
import { usePathname, useRouter } from "next/navigation";

const locales = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "eus", label: "Euskara" },
];

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newLocale: string) {
    // Replace the locale segment: /en/foo/bar → /es/foo/bar
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-bg-surface border border-border text-text-secondary text-xs rounded-md px-2 py-1 focus:outline-none focus:border-border-focus cursor-pointer hover:border-border-focus transition-colors"
      aria-label="Select language"
    >
      {locales.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
