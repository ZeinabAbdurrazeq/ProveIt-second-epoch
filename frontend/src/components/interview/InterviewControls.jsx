import { CheckIcon, KeyboardIcon, MicIcon, SkipForwardIcon } from "lucide-react";

// Interview action bar: Done Speaking, Skip Question, and a mute/type toggle.
function InterviewControls({
  isTypingMode,
  onToggleTypingMode,
  onDoneSpeaking,
  onSkip,
  canSubmit,
  disabled,
  t = (key) => key,
}) {
  const primaryLabel = isTypingMode
    ? t("aiInterview.done")
    : t("aiInterview.doneSpeaking");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        className="btn btn-primary gap-2"
        onClick={onDoneSpeaking}
        disabled={disabled || !canSubmit}
      >
        <CheckIcon className="size-4" />
        {primaryLabel}
      </button>

      <button
        className="btn btn-ghost gap-2"
        onClick={onSkip}
        disabled={disabled}
      >
        <SkipForwardIcon className="size-4" />
        {t("aiInterview.skipQuestion")}
      </button>

      <button
        className="btn btn-outline gap-2"
        onClick={onToggleTypingMode}
        disabled={disabled}
        title={isTypingMode ? t("aiInterview.useVoice") : t("aiInterview.typeInstead")}
      >
        {isTypingMode ? (
          <>
            <MicIcon className="size-4" />
            {t("aiInterview.useVoice")}
          </>
        ) : (
          <>
            <KeyboardIcon className="size-4" />
            {t("aiInterview.typeInstead")}
          </>
        )}
      </button>
    </div>
  );
}

export default InterviewControls;
