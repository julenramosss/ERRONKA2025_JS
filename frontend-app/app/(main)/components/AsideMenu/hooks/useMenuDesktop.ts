import { useState } from 'react';

export function useMenuDesktop() {
  const [isMinimized, setIsMinimized] = useState(false);

  function onClickMinimize() {
    setIsMinimized((prev) => !prev);
  }

  return {
    isMinimized,
    onClickMinimize,
  };
}
