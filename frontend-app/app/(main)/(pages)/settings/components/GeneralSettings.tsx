import { usePreferences } from '../../../../hooks/usePreferences';
import { formatDate } from '../../../../utils/date.utils';
import { USER_ROLES } from '../../../../utils/types';
import { useGeneralSettings } from '../hooks/useGeneralSettings';

export function GeneralSettings({ isActive }: { isActive: boolean }) {
  const { userData, userName, userSurname } = useGeneralSettings();
  usePreferences();
  if (!isActive) return null;
  return (
    <div className="">
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        <div className="py-4 px-4 sm:py-5 sm:px-6 md:px-8 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Profila</h3>
          <p className="text-sm text-text-secondary">
            PakAG barruan nola ikusten dizuten
          </p>
        </div>
        <div className="px-2 sm:px-5">
          <div className="py-4 px-2 sm:py-5 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 border-b border-border">
            <span
              className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl text-white font-bold"
              style={{
                background:
                  'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #7c3aed 100%)',
              }}
            >
              {userName.slice(0, 1)}
              {userSurname.slice(0, 1)}
            </span>
            <div className="flex flex-col gap-3 min-w-0">
              <div className="min-w-0">
                <p className="text-text-primary font-semibold truncate">
                  {userData?.name.split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-sm text-text-secondary truncate">
                  {userData?.email}
                </p>
              </div>

              <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
                <span
                  className={`border text-[10px] rounded-full font-semibold text-center uppercase px-2 py-1 ${
                    userData?.role === USER_ROLES.admin
                      ? 'border-border-admin bg-bg-admin text-text-admin'
                      : 'border-border-focus bg-accent-subtle text-text-secondary'
                  }`}
                >
                  {userData?.role === USER_ROLES.admin
                    ? 'ADMINISTRATZAILEA'
                    : 'BANATZAILEA'}
                </span>
                <span>
                  {userData?.is_active ? (
                    <span className="px-2 py-1 text-st-delivered bg-bg-delivered border-st-delivered border text-[10px] rounded-full font-semibold text-center">
                      <span className="w-2 h-2 bg-st-delivered rounded-full inline-block mr-1"></span>
                      Aktibo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-text-error bg-bg-error border-st-error border text-[10px] rounded-full font-semibold text-center">
                      <span className="w-2 h-2 bg-text-error rounded-full inline-block mr-1"></span>
                      Ez aktibo
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="py-4 px-2 sm:py-5 sm:px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                  Izen osoa
                </label>
                <div className="bg-bg-base border border-border rounded-lg px-4 py-3 text-text-primary text-sm">
                  {userData?.name ?? '—'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                  Email
                </label>
                <div className="bg-bg-base border border-border rounded-lg px-4 py-3 text-text-primary text-sm flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-text-secondary shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="truncate">{userData?.email ?? '—'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                  Erabiltzaile IDa
                </label>
                <div className="bg-bg-base border border-border rounded-lg px-4 py-3 text-text-primary text-sm font-mono">
                  #{userData?.id ?? '—'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                  Kontua sortuta
                </label>
                <div className="bg-bg-base border border-border rounded-lg px-4 py-3 text-text-primary text-sm">
                  {userData?.created_at ? formatDate(userData.created_at) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
