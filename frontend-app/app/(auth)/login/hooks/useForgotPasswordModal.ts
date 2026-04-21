import { useEffect, useRef, useState } from "react";
import { useForgotPassword } from "../../../hooks/auth/useForgotPassword";

export function useForgotPasswordModal(onClose: () => void) {
  const { isSuccess, isPending, error, isError, mutateAsync } =
    useForgotPassword();
  const emailRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  async function onClickForgotPassword() {
    const email = emailRef.current?.value;
    if (email) {
      try {
        await mutateAsync(email);
      } catch {
        // error queda capturado en `error` / `isError` del mutation
      }
    }
  }

  return {
    emailRef,
    showToast,
    isPending,
    isError,
    error,
    onClickForgotPassword,
  };
}
