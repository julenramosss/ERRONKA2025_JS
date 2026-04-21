import { useState } from "react";
import { useLogout } from "../../../../hooks/auth/useLogout";
import { useMe } from "../../../../hooks/auth/useMe";

export function useMenuDesktop() {
  const [isMinimized, setIsMinimized] = useState(false);
  const { mutateAsync } = useLogout();
  const { data } = useMe();
  const userName = data?.name.split(" ")[0] || ""; // Obtener el nombre
  const userSurname = data?.name.split(" ").slice(1).join(" ") || ""; // Obtener el apellido

  function onClickLogout() {
    mutateAsync();
    window.location.href = "/login"; // Redirigir al login después de hacer logout
  }

  function onClickMinimize() {
    setIsMinimized((prev) => !prev);
  }

  return {
    fullName: data?.name || "",
    userName,
    userSurname,
    role: data?.role || "",
    isMinimized,
    onClickMinimize,
    onClickLogout,
  };
}
