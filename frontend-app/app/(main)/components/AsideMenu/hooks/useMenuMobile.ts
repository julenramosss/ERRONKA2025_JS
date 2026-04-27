import { useState } from "react";
import { useLogout } from "../../../../hooks/auth/useLogout";
import { useMe } from "../../../../hooks/auth/useMe";
import { redirect } from "next/navigation";

export function useMenuMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync } = useLogout();
  const { data } = useMe();
  const userName = data?.name.split(" ")[0] || "";
  const userSurname = data?.name.split(" ").slice(1).join(" ") || "";

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  async function onClickLogout() {
    await mutateAsync();
    redirect("/login");
  }

  return {
    fullName: data?.name || "",
    userName,
    userSurname,
    role: data?.role || "",
    isOpen,
    onOpen,
    onClose,
    onClickLogout,
  };
}
