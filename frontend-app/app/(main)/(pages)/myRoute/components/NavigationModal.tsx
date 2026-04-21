"use client";

import dynamic from "next/dynamic";
import { Icons } from "../../../../components/icons";
import type { NavigationModalProps } from "../types";

const DriverNavigation = dynamic(
  () => import("../../../components/Here/DriverNavigation"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-bg-darkest text-text-secondary">
        <div className="flex items-center gap-2 text-sm">
          <Icons.Loader size={18} className="animate-spin" />
          Nabigazioa kargatzen...
        </div>
      </div>
    ),
  }
);

export function NavigationModal({
  origin,
  destination,
  onClose,
}: NavigationModalProps) {
  if (!origin || !destination) return null;

  return (
    <div className="fixed inset-0 z-999 bg-bg-darkest">
      <button
        type="button"
        onClick={onClose}
        aria-label="Itxi nabigazioa"
        className="absolute right-3 top-3 z-1000 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary shadow-xl transition-colors hover:border-border-focus"
      >
        <Icons.X size={20} />
      </button>
      <DriverNavigation origin={origin} destination={destination} />
    </div>
  );
}
