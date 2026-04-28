import { forwardRef } from 'react';
import type { NoHereMapProps } from '../types';

export const NoHereMap = forwardRef<HTMLDivElement, NoHereMapProps>(
  function NoHereMap({ height }, ref) {
    return (
      <div
        ref={ref}
        style={{ width: '100%', height }}
        className="relative flex items-center justify-center overflow-hidden rounded-xl bg-bg-darkest"
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#3d2960"
                strokeWidth="1"
              />
            </pattern>
            <pattern
              id="roads"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <rect width="120" height="120" fill="url(#grid)" />
              <rect x="52" width="16" height="120" fill="#3d2960" />
              <rect y="52" width="120" height="16" fill="#3d2960" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roads)" />
        </svg>

        <div
          className="relative z-10 flex flex-col items-center gap-2 rounded-xl px-5 py-3"
          style={{
            background: 'rgba(35,29,53,0.9)',
            border: '1px solid var(--border-normal)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            style={{ color: 'var(--accent-light)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-text-secondary">
            Lokalekua ez dago eskuragarri
          </p>
        </div>
      </div>
    );
  }
);
