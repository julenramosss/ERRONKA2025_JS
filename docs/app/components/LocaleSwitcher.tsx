'use client';
import { usePathname, useRouter } from 'next/navigation';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'eus', label: 'Euskara' },
];

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newLocale: string) {
    // Replace the locale segment: /en/foo/bar → /es/foo/bar
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center gap-1" aria-label="Select language">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={`px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
            currentLocale === code
              ? 'bg-accent-subtle border-border-focus text-accent-light'
              : 'bg-bg-surface border-border text-text-secondary hover:border-border-focus hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
