import type { ReactNode } from "react";
import { Icons } from "../../../../components/icons";

export function PasswordField({
  label,
  placeholder,
  value,
  visible,
  onChange,
  onToggleVisibility,
  icon,
  autoComplete,
  helper,
}: {
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  icon: ReactNode;
  autoComplete: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-base px-4 transition-colors focus-within:border-border-focus focus-within:ring-1 focus-within:ring-border-focus">
        <span className="shrink-0 text-text-secondary">{icon}</span>
        <input
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-disabled"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="shrink-0 rounded-full p-1 text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
          aria-label={visible ? "Pasahitza ezkutatu" : "Pasahitza erakutsi"}
        >
          {visible ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
        </button>
      </div>
      {helper && (
        <p className="text-xs text-text-secondary">{helper}</p>
      )}
    </div>
  );
}
