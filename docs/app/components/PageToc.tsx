'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DocsSearch } from './DocsSearch';
import { getDictionary, SupportedLocale } from '../i18n';
import { navItems } from '../utils/constants';
import { buildSearchIndex } from '../lib/search-index';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface PageTocProps {
  label?: string;
}

export function PageToc({ label = 'On this page' }: PageTocProps) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        '.docs-content h2[id], .docs-content h3[id]'
      );
      const items: Heading[] = [];
      elements.forEach((el) => {
        if (el.id) {
          items.push({
            id: el.id,
            text: el.textContent?.trim() ?? '',
            level: el.tagName === 'H2' ? 2 : 3,
          });
        }
      });
      setHeadings(items);
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={label} className="toc-nav">
      <p className="toc-title">{label}</p>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'toc-item-h3' : ''}>
            <a href={`#${h.id}`} className="toc-link">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
