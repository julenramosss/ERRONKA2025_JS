import type { ReactNode } from "react";

export function SettingToggle({
  icon,
  title,
  description,
  checked,
  onChange,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}) {
  return (
    <div
      className={`py-4 px-4 sm:py-5 sm:px-6 md:px-8 flex flex-row items-start sm:items-center justify-between gap-4 ${className ?? ""}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <span className="mt-0.5 text-text-secondary shrink-0">{icon}</span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
          checked ? "bg-accent" : "bg-bg-elevated border border-border"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
