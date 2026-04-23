import Link from "next/link";
import { Icons } from "../../../../../components/icons";
import type { PackageDetailHeaderProps } from "../types";

export function PackageDetailHeader({ pkg }: PackageDetailHeaderProps) {
  return (
    <div className="tour-pkg-detail-header flex flex-col py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Link
          href="/myPackages"
          className="inline-flex items-center gap-1 hover:text-text-primary transition-colors"
        >
          Nire paketeak
        </Link>
        <Icons.ChevronRight size={12} />
        <span className="font-mono text-accent-light">{pkg.tracking_code}</span>
      </div>
    </div>
  );
}
