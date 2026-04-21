"use client";
import { useLogin } from "@/app/hooks/auth/useLogin";
import { useCallback, useRef, useState } from "react";
import { refresh } from "../../../lib/api/auth-api";
import { redirect } from "next/navigation";

export function useLoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const { data, isError, error, isPending, isSuccess, mutateAsync } =
    useLogin();

  const toggleForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen((prev) => !prev);
  };

  const onLoginRedirect = useCallback(() => {
    const onExecuteRedirect = async () => {
      await refresh();
      const redirectPathName = sessionStorage.getItem("redirect_after_login");
      sessionStorage.removeItem("redirect_after_login");
      redirect(redirectPathName ?? "/dashboard");
    };

    onExecuteRedirect();
  }, []);

  async function onSubmitLogin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      // Handle validation error (e.g., show a message to the user)
      return;
    }

    try {
      await mutateAsync({
        email: email,
        password: password,
      });

      onLoginRedirect();
    } catch {
      // error queda capturado en `error` / `isError` del mutation
    }
  }

  return {
    data,
    isError,
    error,
    isPending,
    isSuccess,
    emailRef,
    passwordRef,
    onSubmitLogin,
    isForgotPasswordModalOpen,
    toggleForgotPasswordModal,
  };
}
