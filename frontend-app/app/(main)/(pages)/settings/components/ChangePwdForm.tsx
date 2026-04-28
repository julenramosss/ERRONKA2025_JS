import { Icons } from '../../../../components/icons';
import { useSecuritySettings } from '../hooks/useSecuritySettings';
import { PasswordField } from './PasswordField';

export function ChangePwdForm() {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    clientError,
    successMessage,
    apiErrorMessage,
    isPending,
    onChangeCurrentPassword,
    onChangeNewPassword,
    onChangeConfirmPassword,
    onSubmitChangePassword,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useSecuritySettings();

  const errorMessage = clientError ?? apiErrorMessage;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitChangePassword();
      }}
      className="py-4 px-4 sm:py-5 sm:px-6 md:px-8 flex flex-col gap-5"
    >
      <div className="flex flex-col gap-5 max-w-xl">
        <PasswordField
          label="Uneko pasahitza"
          placeholder="Idatzi zure uneko pasahitza"
          value={currentPassword}
          visible={showCurrentPassword}
          onChange={onChangeCurrentPassword}
          onToggleVisibility={toggleCurrentPasswordVisibility}
          icon={<Icons.Lock size={16} />}
          autoComplete="current-password"
        />

        <PasswordField
          label="Pasahitz berria"
          placeholder="Idatzi pasahitz berria"
          value={newPassword}
          visible={showNewPassword}
          onChange={onChangeNewPassword}
          onToggleVisibility={toggleNewPasswordVisibility}
          icon={<Icons.KeyRound size={16} />}
          autoComplete="new-password"
          helper="Gutxienez 6 karaktere."
        />

        <PasswordField
          label="Berretsi pasahitz berria"
          placeholder="Errepikatu pasahitz berria"
          value={confirmPassword}
          visible={showConfirmPassword}
          onChange={onChangeConfirmPassword}
          onToggleVisibility={toggleConfirmPasswordVisibility}
          icon={<Icons.KeyRound size={16} />}
          autoComplete="new-password"
        />

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-st-error bg-bg-error px-3 py-2 text-xs text-text-error">
            <Icons.AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-st-delivered bg-bg-delivered px-3 py-2 text-xs text-st-delivered">
            <Icons.Check size={14} className="mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-border pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Icons.Loader size={16} className="animate-spin" />
              Eguneratzen...
            </>
          ) : (
            <>
              Pasahitza eguneratu
              <Icons.ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
