'use client';
import { useLogin } from '@/app/hooks/auth/useLogin';
import { useRef, useState } from 'react';
import { redirect } from 'next/navigation';
import { REDIRECT_AFTER_LOGIN_STORAGE_KEY } from '../../../config/envConfig';

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

  const onLoginRedirect = () => {
    const redirectPathName = sessionStorage.getItem(
      REDIRECT_AFTER_LOGIN_STORAGE_KEY
    );
    if (typeof redirectPathName === 'object' || redirectPathName === '') {
      redirect('/dashboard');
    } else {
      sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_STORAGE_KEY);
      redirect(redirectPathName ?? '/dashboard');
    }
  };

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
    } catch {
      // error queda capturado en `error` / `isError` del mutation
      return;
    }

    onLoginRedirect();
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
