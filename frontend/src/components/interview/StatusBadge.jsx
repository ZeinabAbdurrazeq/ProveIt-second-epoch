import { Loader2Icon, MicIcon, Volume2Icon } from "lucide-react";

// Three interview states: AI Speaking, Listening, Processing.
function StatusBadge({ status, t = (key) => key }) {
  const label = (key, fallback) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const config = {
    speaking: {
      label: label("aiInterview.aiSpeaking", "AI Speaking"),
      className: "badge-secondary",
      icon: <Volume2Icon className="size-4" />,
    },
    listening: {
      label: label("aiInterview.listening", "Listening"),
      className: "badge-primary",
      icon: <MicIcon className="size-4" />,
    },
    processing: {
      label: label("aiInterview.processing", "Processing"),
      className: "badge-accent",
      icon: <Loader2Icon className="size-4 animate-spin" />,
    },
  };

  const current = config[status] || config.processing;

  return (
    <div className={`badge badge-lg gap-2 ${current.className}`}>
      {current.icon}
      <span className="font-semibold">{current.label}</span>
    </div>
  );
}

export default StatusBadge;
