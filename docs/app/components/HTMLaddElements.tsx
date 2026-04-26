"use client";
import { useEffect } from "react";

interface HTMLaddElementsProps {
  lang: string;
  dir?: string;
}

export function HTMLaddElements({ lang, dir = "ltr" }: HTMLaddElementsProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}
