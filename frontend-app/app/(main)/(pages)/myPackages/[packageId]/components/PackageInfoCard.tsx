import type { ReactNode } from 'react';
import { Icons } from '../../../../../components/icons';
import { formatDate } from '../../../../../utils/date.utils';
import { usePreferences } from '../../../../../hooks/usePreferences';
import type { DetailRowProps, PackageInfoCardProps } from '../types';
import { StatusBadge } from '../../../../components/StatusBadge';

function DetailRow({ label, value, icon, span }: DetailRowProps) {
  return (
    <div className={span ? 'sm:col-span-2' : ''}>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-disabled mb-1.5">
        {icon as ReactNode}
        {label}
      </div>
      <div className="text-sm font-medium text-text-primary">
        {value !== null && value !== undefined && value !== '' ? value : '—'}
      </div>
    </div>
  );
}

export function PackageInfoCard({ pkg }: PackageInfoCardProps) {
  usePreferences();
  return (
    <div className="tour-pkg-info-card bg-bg-surface border border-border rounded-xl px-5 py-4 md:px-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4 mb-5">
        <h2 className="text-2xl font-semibold text-accent-light tracking-wide">
          {pkg.tracking_code}
        </h2>
        <StatusBadge status={pkg.status} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <DetailRow
          label="Hartzailea"
          value={pkg.recipient_name}
          icon={<Icons.User size={12} />}
        />
        <DetailRow
          label="Emaila"
          value={pkg.recipient_email}
          icon={<Icons.Mail size={12} />}
        />
        <DetailRow
          label="Helbidea"
          value={`${pkg.street}, ${pkg.postal_code} ${pkg.city}`}
          icon={<Icons.MapPin size={12} />}
          span
        />
        <DetailRow
          label="Pisua"
          value={`${pkg.weight_kg} kg`}
          icon={<Icons.Weight size={12} />}
        />
        <DetailRow
          label="Deskribapena"
          value={pkg.description}
          icon={<Icons.FileText size={12} />}
        />
        <DetailRow
          label="Sortze-data"
          value={formatDate(pkg.created_at)}
          icon={<Icons.Calendar size={12} />}
        />
        <DetailRow
          label="ETA"
          value={
            pkg.estimated_delivery ? formatDate(pkg.estimated_delivery) : '—'
          }
          icon={<Icons.Clock size={12} />}
        />
      </div>
    </div>
  );
}
