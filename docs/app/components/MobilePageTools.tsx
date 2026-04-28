'use client';
import { useState } from 'react';
import { PageToc } from './PageToc';

interface MobilePageToolsProps {
  tocLabel?: string;
}

export function MobilePageTools({
  tocLabel = 'On this page',
}: MobilePageToolsProps) {
  const [open, setOpen] = useState(false);

  function openSearch() {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('docs:search:open'));
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={tocLabel}
        className="mobile-toc-btn"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="9" y2="18" />
        </svg>
        <span>{tocLabel}</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Bottom drawer */}
      <div
        role="dialog"
        aria-label={tocLabel}
        aria-modal
        className={`mobile-toc-drawer ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Drawer header */}
        <div className="mobile-toc-drawer-header">
          <span className="text-sm font-semibold text-text-primary">
            {tocLabel}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="mobile-toc-search-btn"
              aria-label="Open search"
            >
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="mobile-toc-close-btn"
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer body */}
        <div className="mobile-toc-drawer-body">
          <PageToc label={tocLabel} />
        </div>
      </div>
    </>
  );
}
