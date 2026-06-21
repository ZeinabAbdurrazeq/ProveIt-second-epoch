import { useCallback, useEffect, useRef, useState } from "react";

// Resolve the vendor-prefixed SpeechRecognition constructor.
function getRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Wraps the browser SpeechRecognition API for the voice interview.
 *
 * - continuous = false, interimResults = true so the transcript updates live.
 * - After the user stops speaking, waits `silenceTimeout` ms (default 2500)
 *   then auto-stops and fires onSilence with the final transcript.
 * - stop() (used by the "Done Speaking" button) bypasses the silence timer
 *   and never fires onSilence.
 *
 * Reliability notes (these fix the "mic dies after a question" and the
 * "answer submitted twice" bugs):
 *  - start() can be called immediately after a stop. The browser fires onend
 *    asynchronously, so calling start() too soon throws InvalidStateError.
 *    We abort first and, if start() still throws, retry on the next tick.
 *  - A manual stop sets manualStopRef so onend never auto-submits. We only
 *    reset that flag inside start(), so a pending onend from a manual stop
 *    cannot be "unflagged" by anything else.
 */
export default function useSpeechRecognition({
  silenceTimeout = 2500,
  language = "en",
  onSilence,
} = {}) {
  const SpeechRecognition = getRecognition();
  const isSupported = !!SpeechRecognition;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");
  const manualStopRef = useRef(false);
  // True while we are intentionally restarting; prevents the cleanup onend
  // handler from firing onSilence during a restart.
  const startingRef = useRef(false);
  const onSilenceRef = useRef(onSilence);

  // Keep the latest onSilence without re-creating the recognition instance.
  useEffect(() => {
    onSilenceRef.current = onSilence;
  }, [onSilence]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Build the recognition instance once.
  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = String(language).toLowerCase().startsWith("ar") ? "ar-SA" : "en-US";

    recognition.onresult = (event) => {
      // Build the transcript from all results. Final results are kept as-is;
      // interim results give live feedback but are replaced as they finalize.
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setTranscript(text);

      // Reset the silence countdown each time new speech arrives.
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        // Silence-triggered stop: this SHOULD auto-submit, so leave
        // manualStopRef false.
        manualStopRef.current = false;
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
      }, silenceTimeout);
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setIsListening(false);

      // Ignore onend that happens because we are restarting the engine.
      if (startingRef.current) return;

      // Only auto-submit when the stop came from silence, not a manual stop()
      // (the caller handles the manual case itself).
      if (!manualStopRef.current) {
        onSilenceRef.current?.(transcriptRef.current);
      }
    };

    recognition.onerror = (event) => {
      // "aborted" / "no-speech" are expected during normal restarts; don't
      // surface them. Any error just stops the listening indicator.
      clearSilenceTimer();
      setIsListening(false);
      void event;
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimer();
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
    };
  }, [isSupported, SpeechRecognition, silenceTimeout, clearSilenceTimer, language]);

  // Internal: actually start the engine, retrying once if it is still
  // shutting down from a previous stop (InvalidStateError).
  const beginRecognition = useCallback((attempt = 0) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      recognition.start();
      startingRef.current = false;
      setIsListening(true);
    } catch {
      // start() throws if the engine has not finished stopping yet. Abort and
      // retry shortly; give up after a few attempts to avoid an infinite loop.
      if (attempt >= 5) {
        startingRef.current = false;
        return;
      }
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      setTimeout(() => beginRecognition(attempt + 1), 150);
    }
  }, []);

  const start = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    clearSilenceTimer();
    transcriptRef.current = "";
    setTranscript("");
    manualStopRef.current = false;
    startingRef.current = true;
    beginRecognition(0);
  }, [isSupported, beginRecognition, clearSilenceTimer]);

  // Manual stop (Done Speaking): stop without firing the silence auto-submit.
  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    manualStopRef.current = true;
    startingRef.current = false;
    clearSilenceTimer();
    try {
      recognitionRef.current.stop();
    } catch {
      /* ignore */
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const reset = useCallback(() => {
    transcriptRef.current = "";
    setTranscript("");
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    setTranscript,
    start,
    stop,
    reset,
  };
}
