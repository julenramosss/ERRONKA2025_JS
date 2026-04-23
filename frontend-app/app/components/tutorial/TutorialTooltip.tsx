"use client";

import type { TooltipRenderProps } from "react-joyride";
import { Icons } from "../icons";

export function TutorialTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  skipProps,
  step,
  tooltipProps,
}: TooltipRenderProps) {
  const showBack = index > 0;
  const showSkip = !isLastStep;

  return (
    <div
      {...tooltipProps}
      className="relative flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-bg-surface text-text-primary shadow-[0_8px_32px_rgba(124,58,237,0.25)] sm:w-96"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-accent/20 via-accent-subtle/20 to-transparent" />

      <div className="relative flex items-start justify-between gap-3 px-5 pt-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-light">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border-focus bg-accent-subtle">
            <Icons.Lightbulb size={12} />
          </span>
          <span>Tutoriala</span>
          <span className="text-text-disabled">·</span>
          <span className="text-text-secondary">
            {index + 1} / {size}
          </span>
        </div>
        <button
          {...closeProps}
          type="button"
          aria-label="Itxi tutoriala"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
        >
          <Icons.X size={14} />
        </button>
      </div>

      <div className="relative flex flex-col gap-2 px-5 py-4">
        {step.title && (
          <h3 className="text-base font-semibold leading-tight text-text-primary">
            {step.title}
          </h3>
        )}
        <div className="text-sm leading-relaxed text-text-secondary">
          {step.content}
        </div>
      </div>

      <div className="flex h-1 w-full overflow-hidden bg-bg-dark">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light transition-all"
          style={{ width: `${((index + 1) / size) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-bg-elevated/50 px-4 py-3">
        <div className="flex items-center gap-1">
          {showSkip && (
            <button
              {...skipProps}
              type="button"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              Saltatu
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              {...backProps}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-focus hover:text-text-primary"
            >
              <Icons.ArrowLeft size={13} />
              Atzera
            </button>
          )}
          <button
            {...primaryProps}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_16px_rgba(124,58,237,0.35)] transition-colors hover:bg-accent-hover"
          >
            {isLastStep ? "Bukatu" : "Hurrengoa"}
            {!isLastStep && <Icons.ArrowRight size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
