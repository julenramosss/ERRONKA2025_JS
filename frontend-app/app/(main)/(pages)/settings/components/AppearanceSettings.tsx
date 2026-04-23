"use client";

import { Icons } from "../../../../components/icons";
import { useAppearanceSettings } from "../hooks/useAppearanceSettings";
import { SettingToggle } from "./SettingToggle";

export function AppearanceSettings({ isActive }: { isActive: boolean }) {
  const {
    animations,
    dateFormat,
    showTutorial,
    toggleAnimations,
    changeDateFormat,
    toggleShowTutorial,
    shortSample,
    longSample,
  } = useAppearanceSettings();

  if (!isActive) return null;

  return (
    <div>
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        <div className="py-4 px-4 sm:py-5 sm:px-6 md:px-8 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Itxura</h3>
          <p className="text-sm text-text-secondary">
            Zure esperientzia egokitu hobespenen arabera.
          </p>
        </div>

        <div className="divide-y divide-border">
          <SettingToggle
            icon={<Icons.Loader size={16} />}
            title="Animazioak"
            description="Desaktibatu trantsizio eta animazioak nabigazio azkarragoa lortzeko."
            checked={animations === "on"}
            onChange={toggleAnimations}
          />

          <div className="py-4 px-4 sm:py-5 sm:px-6 md:px-8 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Icons.Calendar
                size={16}
                className="mt-0.5 text-text-secondary shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  Data formatua
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Datak nola erakutsi aplikazio osoan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:ml-7">
              <FormatOption
                label="Laburra"
                sample={shortSample}
                active={dateFormat === "short"}
                onClick={() => changeDateFormat("short")}
              />
              <FormatOption
                label="Luzea"
                sample={longSample}
                active={dateFormat === "long"}
                onClick={() => changeDateFormat("long")}
              />
            </div>
          </div>

          <SettingToggle
            icon={<Icons.Lightbulb size={16} />}
            title="Hasierako tutoriala"
            description="Erakutsi aplikazioaren gidaliburua hurrengo saioan."
            checked={showTutorial}
            onChange={toggleShowTutorial}
          />
        </div>
      </div>
    </div>
  );
}

function FormatOption({
  label,
  sample,
  active,
  onClick,
}: {
  label: string;
  sample: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer ${
        active
          ? "border-border-focus bg-accent-subtle"
          : "border-border bg-bg-base hover:bg-bg-elevated"
      }`}
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-wide ${
          active ? "text-accent-light" : "text-text-secondary"
        }`}
      >
        {label}
      </span>
      <span className="text-sm font-mono text-text-primary">{sample}</span>
    </button>
  );
}
