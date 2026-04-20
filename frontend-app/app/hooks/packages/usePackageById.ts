"use client";

import { useQuery } from "@tanstack/react-query";
import { packageByIdQueryOptions } from "../../query/options/packages.options";

export function usePackageById(id: number) {
  return useQuery(packageByIdQueryOptions(id));
}
