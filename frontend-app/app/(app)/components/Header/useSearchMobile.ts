import { useState } from "react";

export function useSearchMobile() {
  const [isOpen, setIsOpen] = useState(false);

  function onClickOpen() {
    setIsOpen(true);
  }

  function onClickClose() {
    setIsOpen(false);
  }

  return { isOpen, onClickOpen, onClickClose };
}
