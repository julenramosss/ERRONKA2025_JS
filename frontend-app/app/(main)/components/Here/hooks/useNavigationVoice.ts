import { useRef, useState } from "react";

export function useNavigationVoice() {
  const voiceEnabledRef = useRef(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  function toggleVoice(): void {
    setVoiceEnabled((current) => {
      const next = !current;
      voiceEnabledRef.current = next;
      if (!next && "speechSynthesis" in window) window.speechSynthesis.cancel();
      return next;
    });
  }

  function speak(text: string): void {
    if (!voiceEnabledRef.current || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  }

  return { speak, toggleVoice, voiceEnabled };
}
