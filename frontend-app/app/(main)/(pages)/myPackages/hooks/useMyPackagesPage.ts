import { useState } from 'react';
import { useMyPackages } from '../../../../hooks/packages/useMyPackages';
import { useUpdatePackageStatus } from '../../../../hooks/packages/useUpdatePackageStatus';
import type { PackageStatus } from '../../../../utils/types/api/package.types';
import type { ConfirmState, ViewMode } from '../types';
import { PACKAGE_STATUSES } from '../../../../utils/types';

export function useMyPackagesPage() {
  const { data: packagesData, isLoading } = useMyPackages();
  const { mutate: updateStatus, isPending } = useUpdatePackageStatus();

  const [filter, setFilter] = useState<PackageStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [toast, setToast] = useState<{
    status: PackageStatus;
    name: string;
  } | null>(null);

  const packages = packagesData ?? [];

  const counts = {} as Record<PackageStatus | 'all', number>;
  counts['all'] = packages.length;
  Object.keys(PACKAGE_STATUSES).forEach((status) => {
    counts[status as PackageStatus] = packages.filter(
      (p) => p.status === status
    ).length;
  });

  const filtered = packages.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.recipient_name.toLowerCase().includes(q) ||
      p.tracking_code.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.id.toString() === q
    );
  });

  function onConfirmAction() {
    if (!confirm) return;
    updateStatus(
      { package_id: confirm.pkg.id, new_status: confirm.to },
      {
        onSuccess: () => {
          setToast({ status: confirm.to, name: confirm.pkg.recipient_name });
          setConfirm(null);
          setTimeout(() => setToast(null), 3000);
        },
      }
    );
  }

  return {
    packages,
    filtered,
    counts,
    filter,
    setFilter,
    query,
    setQuery,
    view,
    setView,
    confirm,
    setConfirm,
    toast,
    onConfirmAction,
    isLoading,
    isPending,
  };
}
