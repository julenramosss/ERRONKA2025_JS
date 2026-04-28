import { useRef, useState } from 'react';
import { useForgotPassword } from '../../../hooks/auth/useForgotPassword';

export function useForgotPasswordModal(onClose: () => void) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { isSuccess, isPending, error, isError, mutateAsync } =
    useForgotPassword();
  const emailRef = useRef<HTMLInputElement>(null);

  async function onClickForgotPassword() {
    const email = emailRef.current?.value;
    if (email) {
      setIsButtonDisabled(true);
      try {
        await mutateAsync(email);
        setTimeout(onClose, 4000);
      } catch {
        // error queda capturado en `error` / `isError` del mutation
        setIsButtonDisabled(false);
      }
    }
  }

  return {
    emailRef,
    showToast: isSuccess,
    isPending,
    isError,
    error,
    isButtonDisabled,
    onClickForgotPassword,
  };
}
