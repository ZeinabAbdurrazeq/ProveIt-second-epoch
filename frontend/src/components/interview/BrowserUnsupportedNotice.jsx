import { AlertTriangleIcon } from "lucide-react";

// Friendly notice shown when the browser lacks Web Speech API support.
function BrowserUnsupportedNotice({ t = (key) => key }) {
  return (
    <div className="card bg-base-100 border border-warning/40 max-w-lg mx-auto">
      <div className="card-body items-center text-center">
        <div className="size-16 rounded-full bg-warning/10 flex items-center justify-center mb-2">
          <AlertTriangleIcon className="size-8 text-warning" />
        </div>
        <h2 className="card-title">{t("aiInterview.voiceUnsupportedTitle")}</h2>
        <p className="text-base-content/70">
          {t("aiInterview.voiceUnsupportedBody")}
        </p>
      </div>
    </div>
  );
}

export default BrowserUnsupportedNotice;
