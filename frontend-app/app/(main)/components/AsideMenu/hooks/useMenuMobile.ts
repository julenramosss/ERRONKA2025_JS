import { useState } from 'react';

export function useMenuMobile() {
  const [isOpen, setIsOpen] = useState(false);

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
