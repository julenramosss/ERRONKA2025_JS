import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forgotPassword } from "../../lib/api/auth-api";

export function useForgotPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => forgotPassword(email),
  });
}
