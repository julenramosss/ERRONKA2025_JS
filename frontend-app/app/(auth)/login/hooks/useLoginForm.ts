"use client";
import { useLogin } from "@/app/hooks/auth/useLogin";
import { redirect } from "next/navigation";

export function useLoginForm() {
  const { data, isError, error, isPending, isSuccess, mutateAsync } =
    useLogin();

  async function onFormSubmit(e: React.FormEvent<HTMLFormElement> | undefined) {
    if (!e) return;
    e.preventDefault();
    const { email, password } = e.currentTarget
      .elements as typeof e.currentTarget.elements & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    if (!email.value || !password.value) {
      // Handle validation error (e.g., show a message to the user)
      return;
    }

    try {
      await mutateAsync({
        email: email.value,
        password: password.value,
      });

      const redirectPathName = sessionStorage.getItem("redirect_after_login");
      redirect(redirectPathName ?? "/"); // Redirigir de donde viene el usuario
    } catch {
      // error queda capturado en `error` / `isError` del mutation
    }
  }

  return {
    onFormSubmit,
    data,
    isError,
    error,
    isPending,
    isSuccess,
  };
}
