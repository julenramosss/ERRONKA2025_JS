"use client";

import { RefObject, useEffect, useState } from "react";

interface ShortcutLabel {
  modifier: string;
  key: string;
}

const DEFAULT_LABEL: ShortcutLabel = { modifier: "Ctrl", key: "K" };

export function useSearchShortcut(ref: RefObject<HTMLInputElement | null>) {
  const [label, setLabel] = useState<ShortcutLabel>(DEFAULT_LABEL);

  useEffect(() => {
    async function getLabel() {
      const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
      if (isMac) setLabel({ modifier: "⌘", key: "K" });
    }
    getLabel();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;
      event.preventDefault();
      const input = ref.current;
      if (!input) return;
      input.focus();
      input.select();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref]);

  return label;
}
