// Top progress bar showing overall interview completion.
function InterviewProgress({ current, total }) {
  const safeTotal = total || 1;
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));

  return (
    <div className="w-full">
      <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default InterviewProgress;
