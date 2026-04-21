import { usePathname } from "next/navigation";
import { useMe } from "../../../hooks/auth/useMe";

export function useHeader() {
  const pathname = usePathname();
  const { data } = useMe();
  const userName = data?.name.split(" ")[0] || "";
  const userSurname = data?.name.split(" ").slice(1).join(" ") || "";

  return {
    pathname,
    userName,
    userSurname,
  };
}
