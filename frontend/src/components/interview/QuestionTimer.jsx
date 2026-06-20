import { useEffect, useRef, useState } from "react";
import { ClockIcon } from "lucide-react";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Counts up how long the user has been on the current question. Resets whenever
 * `resetKey` changes (i.e. when a new question begins).
 */
function QuestionTimer({ resetKey, running = true, onTick }) {
  const [seconds, setSeconds] = useState(0);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  // Reset on new question.
  useEffect(() => {
    setSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onTickRef.current?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, resetKey]);

  return (
    <div className="flex items-center gap-2 text-base-content/70">
      <ClockIcon className="size-4" />
      <span className="font-mono text-sm">{formatTime(seconds)}</span>
    </div>
  );
}

export default QuestionTimer;
