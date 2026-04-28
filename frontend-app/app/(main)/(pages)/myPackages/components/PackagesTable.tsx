import Link from 'next/link';
import { Icons } from '../../../../components/icons';
import { formatListDate, TABLE_COLS } from '../constants';
import type { PackagesTableProps } from '../types';
import { PackageMobileCard } from './PackageMobileCard';
import { StatusBadge } from '../../../components/StatusBadge';

export function PackagesTable({ packages }: PackagesTableProps) {
  if (packages.length === 0) {
    return (
      <div className="bg-bg-surface border border-border rounded-xl flex flex-col items-center justify-center py-16 gap-3 text-text-disabled">
        <Icons.Package size={32} />
        <p className="text-sm">Ez da paketerik aurkitu</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards (< md) */}
      <div className="md:hidden flex flex-col gap-3">
        {packages.map((pkg) => (
          <PackageMobileCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border">
                {TABLE_COLS.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-5 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, i) => (
                <tr
                  key={pkg.id}
                  className={`hover:bg-[rgba(124,58,237,0.05)] transition-colors ${
                    i < packages.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-accent-light bg-accent-subtle px-2 py-1 rounded">
                      {pkg.tracking_code}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent-subtle border border-border-focus text-accent-light flex items-center justify-center text-xs font-bold shrink-0">
                        {pkg.recipient_name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {pkg.recipient_name}
                        </p>
                        <p className="text-xs text-text-disabled">
                          {pkg.weight_kg} kg
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-text-secondary max-w-45">
                    <p className="truncate">{pkg.street}</p>
                    <p className="text-xs text-text-disabled">{pkg.city}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={pkg.status} />
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-text-secondary">
                    {formatListDate(pkg.estimated_delivery)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/myPackages/${pkg.id}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-accent-light hover:text-white border border-border-focus hover:bg-accent px-2.5 py-1.5 rounded transition-colors"
                    >
                      <Icons.Eye size={13} />
                      Ikusi gehiago
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
