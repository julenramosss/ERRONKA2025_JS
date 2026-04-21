import { Icons } from "../../../../components/icons";
import type { NavigationControlsProps } from "../types";

export function NavigationControls({
  onRecenter,
  onToggleVoice,
  voiceEnabled,
  hasPosition,
}: NavigationControlsProps) {
  return (
    <div className="absolute right-3 bottom-28 z-30 flex flex-col gap-2">
      {hasPosition && (
        <button
          type="button"
          onClick={onRecenter}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary shadow-xl transition-colors hover:border-border-focus active:scale-95"
          aria-label="Zentratu kokapenean"
        >
          <Icons.Navigation size={19} />
        </button>
      )}
      <button
        type="button"
        onClick={onToggleVoice}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary shadow-xl transition-colors hover:border-border-focus active:scale-95"
        aria-label={voiceEnabled ? "Ahotsa itzali" : "Ahotsa piztu"}
      >
        {voiceEnabled ? <Icons.Wifi size={19} /> : <Icons.WifiOff size={19} />}
      </button>
    </div>
  );
}
