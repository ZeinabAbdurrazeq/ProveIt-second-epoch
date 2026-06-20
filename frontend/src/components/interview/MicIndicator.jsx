import { MicIcon } from "lucide-react";

// Centered microphone icon with a pulsing ring while listening so the user
// knows the AI is hearing them.
function MicIndicator({ isListening, isSpeaking }) {
  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <span className="absolute inline-flex size-28 rounded-full bg-primary/30 animate-ping" />
          <span className="absolute inline-flex size-36 rounded-full bg-primary/10 animate-pulse" />
        </>
      )}
      <div
        className={`relative z-10 flex size-24 items-center justify-center rounded-full transition-colors ${
          isListening
            ? "bg-gradient-to-br from-primary to-secondary"
            : isSpeaking
              ? "bg-gradient-to-br from-secondary to-accent"
              : "bg-base-300"
        }`}
      >
        <MicIcon
          className={`size-10 ${
            isListening || isSpeaking ? "text-white" : "text-base-content/50"
          }`}
        />
      </div>
    </div>
  );
}

export default MicIndicator;
