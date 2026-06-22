import { useNavigate, useParams } from "react-router";
import {
  Loader2Icon,
  ThumbsUpIcon,
  TargetIcon,
  LayoutDashboardIcon,
  RefreshCwIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useInterviewResults } from "../hooks/useAiInterview";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

// Color the score ring/badge: green > 7, yellow 5-7, red < 5.
function scoreColor(score) {
  if (score >= 7) return "text-success";
  if (score >= 5) return "text-warning";
  return "text-error";
}

function scoreBadgeClass(score) {
  if (score >= 7) return "badge-success";
  if (score >= 5) return "badge-warning";
  return "badge-error";
}

function ResultsPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const { data, isLoading } = useInterviewResults(sessionId);

  const session = data?.session;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2Icon className="size-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="text-base-content/60">{t("aiInterview.resultsNotFound")}</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => navigate("/ai-interview")}
          >
            {t("aiInterview.backToAIInterview")}
          </button>
        </div>
      </div>
    );
  }

  const overall = Number(session.overallScore || 0);

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* OVERALL SCORE */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body items-center text-center">
            <div
              className="radial-progress font-black text-3xl"
              style={{
                "--value": overall * 10,
                "--size": "9rem",
                "--thickness": "0.8rem",
              }}
              role="progressbar"
            >
              <span className={scoreColor(overall)}>{overall.toFixed(1)}</span>
            </div>
            <h1 className="text-2xl font-black mt-4">{t("aiInterview.interviewComplete")}</h1>
            {session.overallFeedback && (
              <p className="text-base-content/70 max-w-2xl mt-2">
                {session.overallFeedback}
              </p>
            )}
          </div>
        </div>

        {/* STRENGTHS / WEAKNESSES */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUpIcon className="size-5 text-success" />
                <h2 className="font-bold">{t("aiInterview.strengths")}</h2>
              </div>
              {session.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {session.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-success">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-base-content/50">{t("aiInterview.noneRecorded")}</p>
              )}
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <TargetIcon className="size-5 text-warning" />
                <h2 className="font-bold">{t("aiInterview.areasToImprove")}</h2>
              </div>
              {session.weaknesses?.length > 0 ? (
                <ul className="space-y-2">
                  {session.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-warning">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-base-content/50">{t("aiInterview.noneRecorded")}</p>
              )}
            </div>
          </div>
        </div>

        {/* PER-QUESTION BREAKDOWN */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">{t("aiInterview.questionBreakdown")}</h2>
          <div className="space-y-4">
            {(session.questions || []).map((q, i) => (
              <div key={i} className="card bg-base-100 border border-base-300">
                <div className="card-body">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-semibold">
                      {i + 1}. {q.questionText}
                    </p>
                    <span
                      className={`badge ${scoreBadgeClass(q.score)} shrink-0`}
                    >
                      {Number(q.score || 0)}/10
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs uppercase opacity-60 mb-1">
                      {t("aiInterview.yourAnswer")}
                    </p>
                    <p className="text-sm text-base-content/80 whitespace-pre-wrap">
                      {q.userAnswer || t("aiInterview.noneRecorded")}
                    </p>
                  </div>

                  {q.aiFeedback && (
                    <div className="mt-3">
                      <p className="text-xs uppercase opacity-60 mb-1">
                        {t("aiInterview.feedback")}
                      </p>
                      <p className="text-sm text-base-content/80">
                        {q.aiFeedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <button
            className="btn btn-primary gap-2"
            onClick={() => navigate("/ai-interview")}
          >
            <RefreshCwIcon className="size-4" />
            {t("aiInterview.startAnother")}
          </button>
          <button
            className="btn btn-ghost gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboardIcon className="size-4" />
            {t("aiInterview.backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
