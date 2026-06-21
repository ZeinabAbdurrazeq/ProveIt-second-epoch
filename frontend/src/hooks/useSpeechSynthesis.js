import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps the browser SpeechSynthesis API to read interview questions aloud.
 *
 * - Picks the first English voice from getVoices().
 * - Always cancels any ongoing speech before starting new speech (no overlap).
 * - Exposes isSpeaking so the UI can show the "AI Speaking" status.
 */
export default function useSpeechSynthesis({ language = "en" } = {}) {
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef(null);

  // Resolve the preferred voice now and again when the list loads.
  useEffect(() => {
    if (!isSupported) return;

    const loadVoice = () => {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      const isArabic = String(language).toLowerCase().startsWith("ar");
      const preferredPrefix = isArabic ? "ar" : "en";
      voiceRef.current =
        voices.find((v) => v.lang?.toLowerCase().startsWith(preferredPrefix)) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
        voices[0] ||
        null;
    };
    loadVoice();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoice);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoice);
      window.speechSynthesis.cancel();
    };
  }, [isSupported, language]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Speak text, invoking onEnd when finished (or immediately if unsupported).
  const speak = useCallback(
    (text, onEnd) => {
      if (!isSupported || !text) {
        onEnd?.();
        return;
      }

      // Always cancel ongoing speech first to avoid overlap.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.lang =
        voiceRef.current?.lang ||
        (String(language).toLowerCase().startsWith("ar") ? "ar-SA" : "en-US");
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, language],
  );

  return { speak, cancel, isSpeaking, isSupported };
}
