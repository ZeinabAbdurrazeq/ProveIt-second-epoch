import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  SparklesIcon,
  MicIcon,
  Loader2Icon,
  ArrowRightIcon,
  ClipboardListIcon,
  CalendarIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";
import {
  useCandidateProfile,
  useInterviewHistory,
  useStartInterview,
} from "../hooks/useAiInterview";

// Color the overall-score badge: green > 7, yellow 5-7, red < 5.
function scoreBadgeClass(score) {
  if (score >= 7) return "badge-success";
  if (score >= 5) return "badge-warning";
  return "badge-error";
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AiInterviewHubPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslator(language);

  const { data: profileData, isLoading: loadingProfile } = useCandidateProfile();
  const { data: historyData, isLoading: loadingHistory } = useInterviewHistory();
  const startMutation = useStartInterview();

  const profile = profileData?.profile || null;
  const sessions = historyData?.sessions || [];
  const overviewCards = [
    {
      label: t("aiInterview.fieldLabel"),
      value: profile?.primaryField || t("aiInterview.notSet"),
    },
    {
      label: t("aiInterview.experienceLabel"),
      value:
        profile?.yearsOfExperience != null
          ? `${profile.yearsOfExperience} ${t("aiInterview.yearsShort")}`
          : `0 ${t("aiInterview.yearsShort")}`,
    },
    {
      label: t("aiInterview.completedLabel"),
      value: String(profile?.totalInterviewsCompleted || 0),
    },
    {
      label: t("aiInterview.avgScoreLabel"),
      value: `${Number(profile?.overallAverageScore || 0).toFixed(1)}/10`,
    },
  ];

  // If the profile has loaded and there's no CV on file, send to upload first.
  useEffect(() => {
    if (!loadingProfile && !profile) {
      navigate("/ai-interview/upload-cv");
    }
  }, [loadingProfile, profile, navigate]);

  const handleStart = () => {
    startMutation.mutate(
      { language },
      {
        onSuccess: (data) => {
          // Pass the first question / total so InterviewPage can start
          // immediately without a destructive fetch.
          navigate(`/ai-interview/session/${data.sessionId}`, {
            state: {
              firstQuestion: data.firstQuestion,
              totalQuestions: data.totalQuestions,
              language,
            },
          });
        },
      },
    );
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2Icon className="size-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 overflow-hidden shadow-sm">
              <div className="card-body p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                    <SparklesIcon className="size-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black">{t("aiInterview.title")}</h1>
                    <p className="text-sm text-base-content/60">
                      {t("aiInterview.subtitle")}
                    </p>
                  </div>
                </div>

                <p className="text-base-content/70 max-w-3xl text-lg leading-relaxed">
                  {t("aiInterview.description")}
                </p>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mt-6">
                  {overviewCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-base-300 bg-base-200/60 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-black">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="card-actions mt-6">
                  <button
                    className="btn btn-primary btn-lg gap-2"
                    onClick={handleStart}
                    disabled={startMutation.isPending}
                  >
                    {startMutation.isPending ? (
                      <>
                        <Loader2Icon className="size-4 animate-spin" />
                        {t("aiInterview.preparing")}
                      </>
                    ) : (
                      <>
                        <MicIcon className="size-4" />
                        {t("aiInterview.startNew")}
                        <ArrowRightIcon className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-8">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardListIcon className="size-5 text-base-content/70" />
                  <h2 className="text-lg font-bold">{t("aiInterview.pastInterviews")}</h2>
                </div>

                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2Icon className="size-8 animate-spin text-primary" />
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 py-16 text-center">
                    <p className="text-base-content/60">
                      {t("aiInterview.noInterviews")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session._id}
                        className="card bg-base-200/50 border border-base-300"
                      >
                        <div className="card-body flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                              <CalendarIcon className="size-4" />
                              {formatDate(session.createdAt)}
                            </div>
                            <span className="text-sm text-base-content/60">
                              {session.questions?.length || 0} {t("aiInterview.questionsLabel")}
                            </span>
                            {session.status !== "completed" && (
                              <span className="badge badge-ghost badge-sm">
                                {session.status}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`badge badge-lg ${scoreBadgeClass(
                                session.overallScore,
                              )}`}
                            >
                              {Number(session.overallScore || 0).toFixed(1)}/10
                            </span>
                            <button
                              className="btn btn-ghost btn-sm gap-1"
                              onClick={() =>
                                navigate(`/ai-interview/results/${session._id}`)
                              }
                            >
                              {t("aiInterview.viewResults")}
                              <ArrowRightIcon className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card sticky top-24 bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("aiInterview.yourProfile")}</h2>
                {profile ? (
                  <div className="mt-4 space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-base-200/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                          {t("aiInterview.primaryField")}
                        </p>
                        <p className="mt-2 text-xl font-bold capitalize">
                          {profile.primaryField}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-base-200/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                          {t("aiInterview.experienceLabel")}
                        </p>
                        <p className="mt-2 text-xl font-bold">
                          {profile.yearsOfExperience} {t("aiInterview.yearsShort")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                        {t("aiInterview.keySkills")}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.keySkills?.length > 0 ? (
                          profile.keySkills.map((skill) => (
                            <span
                              key={skill}
                              className="badge badge-primary badge-outline"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-base-content/50">
                            {t("aiInterview.noSkills")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                        {t("aiInterview.strongestAreas")}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.strongestAreas?.length > 0 ? (
                          profile.strongestAreas.map((area) => (
                            <span key={area} className="badge badge-ghost">
                              {area}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-base-content/50">
                            {t("aiInterview.noAreas")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-primary/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
                        {t("aiInterview.avgScoreLabel")}
                      </p>
                      <p className="mt-2 text-3xl font-black text-primary">
                        {Number(profile.overallAverageScore || 0).toFixed(1)}/10
                      </p>
                      <p className="mt-2 text-sm text-base-content/60">
                        {t("aiInterview.startHint").replace(
                          "{count}",
                          String(profile.totalInterviewsCompleted || 0),
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-base-content/60">
                    {t("aiInterview.unlockPrompt")}
                  </p>
                )}
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("aiInterview.betterResults")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li>{t("aiInterview.betterResults1")}</li>
                  <li>{t("aiInterview.betterResults2")}</li>
                  <li>{t("aiInterview.betterResults3")}</li>
                  <li>{t("aiInterview.betterResults4")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiInterviewHubPage;
