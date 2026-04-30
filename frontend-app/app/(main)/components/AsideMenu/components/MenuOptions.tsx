'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../../../../components/icons';
import { USER_ROLES } from '../../../../utils/types';
import { useMe } from '../../../../hooks/auth/useMe';

export function MenuOptions({
  isMinimized,
  onClose,
}: {
  isMinimized?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { data: user } = useMe();

  const items = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <Icons.Home size={20} />,
      allowUsers: [USER_ROLES.distributor],
    },
    {
      href: '/myPackages',
      label: 'Nire Paketeak',
      icon: <Icons.Package size={20} />,
      allowUsers: [USER_ROLES.distributor],
    },
    {
      href: '/myRoute',
      label: 'Nire Bidea',
      icon: <Icons.Route size={20} />,
      allowUsers: [USER_ROLES.distributor],
    },
    {
      href: '/history',
      label: 'Historia',
      icon: <Icons.History size={20} />,
      allowUsers: [USER_ROLES.distributor],
    },
    {
      href: '/settings',
      label: 'Ezarpenak',
      icon: <Icons.Settings size={20} />,
      allowUsers: [USER_ROLES.distributor, USER_ROLES.admin],
    },
  ];

  return (
    <div>
      <ul className="flex flex-col gap-2 text-text-secondary">
        {items.map(({ href, label, icon, allowUsers }) => {
          const isActive = pathname === href;
          const isAllowed = user && allowUsers.includes(user.role);
          return (
            <li
              key={href}
              className={`w-full rounded-md ${
                isActive
                  ? 'bg-accent-subtle border-l-2 border-border-focus text-accent-light cursor-default'
                  : 'hover:bg-bg-elevated cursor-pointer'
              }`}
            >
              <Link
                onClick={() => onClose && onClose()}
                href={href}
                className={`flex text-base font-semibold items-center gap-3 py-2 ${
                  isMinimized ? 'justify-center px-2' : 'px-4'
                } ${isActive ? 'cursor-default pointer-events-none' : ''} ${!isAllowed ? 'pointer-events-none opacity-50' : ''}`}
                title={isMinimized ? label : undefined}
              >
                {icon}
                {!isMinimized && label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
