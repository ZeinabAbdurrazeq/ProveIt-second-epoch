// Large transcript area. Shows live speech-to-text, or a typed textarea when
// the user has switched to typing mode (mic muted / not working).
function TranscriptArea({
  transcript,
  isTypingMode,
  onTypedChange,
  disabled,
  t = (key) => key,
}) {
  if (isTypingMode) {
    return (
      <textarea
        className="textarea textarea-bordered w-full min-h-40 text-base"
        placeholder={t("aiInterview.typePlaceholder")}
        value={transcript}
        onChange={(e) => onTypedChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="w-full min-h-40 rounded-xl bg-base-200 border border-base-300 p-4">
      {transcript ? (
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {transcript}
        </p>
      ) : (
        <p className="text-base-content/40 text-base">
          {t("aiInterview.transcriptHint")}
        </p>
      )}
    </div>
  );
}

export default TranscriptArea;
