"use client";

import { useState } from "react";
import { useChangeMyPwd } from "../../../../hooks/auth/useChangeMyPwd";

function mapApiMessage(message: string): string {
  switch (message) {
    case "Current password is incorrect":
      return "Uneko pasahitza ez da zuzena.";
    case "new_password must be at least 6 characters":
      return "Pasahitz berriak gutxienez 6 karaktere izan behar ditu.";
    case "new_password must be different from current_password":
      return "Pasahitz berria ezin da unekoaren berdina izan.";
    case "Password changed successfully":
      return "Pasahitza ondo eguneratu da.";
    default:
      return message;
  }
}

export function useSecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const changeMyPwd = useChangeMyPwd();

  function clearFeedback() {
    setClientError(null);
    setSuccessMessage(null);
    if (changeMyPwd.isError || changeMyPwd.isSuccess) {
      changeMyPwd.reset();
    }
  }

  function onChangeCurrentPassword(value: string) {
    clearFeedback();
    setCurrentPassword(value);
  }

  function onChangeNewPassword(value: string) {
    clearFeedback();
    setNewPassword(value);
  }

  function onChangeConfirmPassword(value: string) {
    clearFeedback();
    setConfirmPassword(value);
  }

  async function onSubmitChangePassword() {
    setClientError(null);
    setSuccessMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setClientError("Hiru eremuak bete pasahitza eguneratzeko.");
      return;
    }

    if (newPassword.length < 6) {
      setClientError("Pasahitz berriak gutxienez 6 karaktere izan behar ditu.");
      return;
    }

    if (currentPassword === newPassword) {
      setClientError("Pasahitz berria ezin da unekoaren berdina izan.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setClientError("Pasahitzak ez datoz bat.");
      return;
    }

    try {
      await changeMyPwd.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Pasahitza ondo eguneratu da.");
    } catch {
      // El error queda expuesto en el mutation para la UI.
    }
  }

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    clientError,
    successMessage,
    isPending: changeMyPwd.isPending,
    apiErrorMessage: changeMyPwd.isError
      ? mapApiMessage(changeMyPwd.error.message)
      : null,
    onChangeCurrentPassword,
    onChangeNewPassword,
    onChangeConfirmPassword,
    onSubmitChangePassword,
    toggleCurrentPasswordVisibility: () =>
      setShowCurrentPassword((prev) => !prev),
    toggleNewPasswordVisibility: () => setShowNewPassword((prev) => !prev),
    toggleConfirmPasswordVisibility: () =>
      setShowConfirmPassword((prev) => !prev),
  };
}
