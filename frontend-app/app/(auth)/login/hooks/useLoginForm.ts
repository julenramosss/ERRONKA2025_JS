"use client";
import { useLogin } from "@/app/hooks/auth/useLogin";
import { redirect } from "next/navigation";

export function useLoginForm() {
  const { data, isError, error, isPending, isSuccess, mutateAsync } =
    useLogin();

  async function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      // Handle validation error (e.g., show a message to the user)
      return;
    }

    try {
      await mutateAsync({
        email: email,
        password: password,
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
