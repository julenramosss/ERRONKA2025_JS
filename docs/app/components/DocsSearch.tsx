"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface SearchEntry {
  title: string;
  path: string;
  content: string;
  excerpt: string;
}

interface SearchResult {
  entry: SearchEntry;
  snippet: string;
}

interface DocsSearchProps {
  entries: SearchEntry[];
  placeholder?: string;
  hideTrigger?: boolean;
}

function getSnippet(content: string, query: string, radius = 100): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, radius * 2) + "…";
  const start = Math.max(0, idx - radius);
  const end = Math.min(content.length, idx + query.length + radius);
  return (
    (start > 0 ? "…" : "") +
    content.slice(start, end) +
    (end < content.length ? "…" : "")
  );
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent-subtle text-accent-light rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function DocsSearch({
  entries,
  placeholder = "Search docs...",
  hideTrigger = false,
}: DocsSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results: SearchResult[] =
    query.trim().length > 1
      ? entries
          .filter(
            (e) =>
              e.title.toLowerCase().includes(query.toLowerCase()) ||
              e.content.toLowerCase().includes(query.toLowerCase()),
          )
          .map((e) => ({ entry: e, snippet: getSnippet(e.content, query) }))
          .slice(0, 12)
      : [];

  const openModal = useCallback(() => {
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  function navigate(path: string) {
    closeModal();
    router.push(path);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openModal();
      }
      if (e.key === "Escape" && open) closeModal();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, openModal, closeModal]);

  useEffect(() => {
    const handleOpen = () => openModal();
    window.addEventListener("docs:search:open", handleOpen);
    return () => window.removeEventListener("docs:search:open", handleOpen);
  }, [openModal]);

  return (
    <>
      {/* Trigger button */}
      {!hideTrigger && (
        <button
          onClick={openModal}
          className="search-trigger-btn"
          aria-label="Search documentation (Ctrl+K)"
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="search-trigger-text">Search</span>
          <kbd className="search-trigger-kbd">⌘K</kbd>
        </button>
      )}

      {/* Modal */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="Search documentation"
            aria-modal
            className="search-modal"
          >
            {/* Input row */}
            <div className="search-modal-input-row">
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-disabled shrink-0"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="search-modal-input"
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeModal();
                }}
              />
              <button
                onClick={closeModal}
                className="search-modal-esc"
                aria-label="Close search"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <ul className="search-modal-results" role="listbox">
              {query.trim().length > 1 && results.length === 0 ? (
                <li className="search-no-results">
                  No results for &quot;{query}&quot;
                </li>
              ) : (
                results.map(({ entry, snippet }) => (
                  <li key={entry.path} role="option">
                    <button
                      onClick={() => navigate(entry.path)}
                      className="search-result-item flex-col items-start gap-1"
                    >
                      <span className="text-sm font-medium text-text-primary">
                        {highlight(entry.title, query)}
                      </span>
                      <span className="text-xs text-text-disabled text-left leading-relaxed line-clamp-2">
                        {highlight(snippet, query)}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
