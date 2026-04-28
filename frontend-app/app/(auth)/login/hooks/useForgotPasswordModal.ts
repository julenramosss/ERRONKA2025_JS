import { useEffect, useRef, useState } from 'react';
import { useForgotPassword } from '../../../hooks/auth/useForgotPassword';

export function useForgotPasswordModal(onClose: () => void) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { isSuccess, isPending, error, isError, mutateAsync } =
    useForgotPassword();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);

  async function onClickForgotPassword() {
    const email = emailRef.current?.value;
    if (email) {
      setIsButtonDisabled(true);
      try {
        await mutateAsync(email);
      } catch {
        // error queda capturado en `error` / `isError` del mutation
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
