'use client';

export function MobileSearchButton() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('docs:search:open'));
  }

  return (
    <button
      onClick={openSearch}
      className="flex items-center justify-center w-8 h-8 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
      aria-label="Search documentation"
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
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );
}
