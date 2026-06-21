import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  Loader2Icon,
  UploadCloudIcon,
  FileTextIcon,
  CheckCircle2Icon,
  SparklesIcon,
  RefreshCwIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useCandidateProfile, useUploadCV } from "../hooks/useAiInterview";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function CvUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { language } = useLanguage();
  const t = getTranslator(language);

  const { data: profileData } = useCandidateProfile();
  const uploadMutation = useUploadCV();

  const profile = profileData?.profile || uploadMutation.data?.profile || null;
  const isProcessing = uploadMutation.isPending;

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error(t("aiInterview.pdfOnlyError"));
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error(t("aiInterview.fileTooLarge"));
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <SparklesIcon className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">{t("aiInterview.uploadTitle")}</h1>
                <p className="text-sm text-base-content/60">
                  {t("aiInterview.uploadSubtitle")}
                </p>
              </div>
            </div>

            {/* PROCESSING STATE */}
            {isProcessing ? (
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body items-center text-center py-16">
                  <Loader2Icon className="size-12 animate-spin text-primary mb-4" />
                  <p className="text-lg font-semibold">{t("aiInterview.readingCv")}</p>
                  <p className="text-sm text-base-content/60">
                    {t("aiInterview.analyzingCv")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* DROP ZONE */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`card border-2 border-dashed cursor-pointer transition-colors shadow-sm ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-base-content/20 bg-base-100 hover:border-primary/50"
                  }`}
                >
                  <div className="card-body items-center text-center py-16">
                    <UploadCloudIcon className="size-12 text-primary mb-4" />
                    <p className="text-lg font-semibold">
                      {t("aiInterview.dragDrop")}
                    </p>
                    <p className="text-sm text-base-content/60 mb-1">
                      {t("aiInterview.clickBrowse")}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>

                {/* PARSED SUMMARY */}
                {profile && (
                  <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-6">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2Icon className="size-5 text-success" />
                          <h2 className="text-lg font-bold">{t("aiInterview.parsedSummary")}</h2>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <RefreshCwIcon className="size-4" />
                          {t("aiInterview.reUpload")}
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-base-200/60 p-4">
                          <p className="text-xs uppercase opacity-60 mb-1">
                            {t("aiInterview.detectedField")}
                          </p>
                          <p className="font-semibold capitalize">
                            {profile.primaryField}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-base-200/60 p-4">
                          <p className="text-xs uppercase opacity-60 mb-1">
                            {t("aiInterview.experienceLabel")}
                          </p>
                          <p className="font-semibold">
                            {profile.yearsOfExperience} {t("aiInterview.experienceYears")}
                          </p>
                        </div>
                      </div>

                      {profile.keySkills?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs uppercase opacity-60 mb-2">
                            {t("aiInterview.keySkills")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.keySkills.map((skill) => (
                              <span key={skill} className="badge badge-primary badge-outline">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.notableTechnologies?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs uppercase opacity-60 mb-2">
                            {t("aiInterview.technologies")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.notableTechnologies.map((tech) => (
                              <span key={tech} className="badge badge-ghost">
                                <FileTextIcon className="size-3 mr-1" />
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="card-actions justify-end mt-6">
                        <button
                          className="btn btn-primary gap-2"
                          onClick={() => navigate("/ai-interview")}
                        >
                          {t("aiInterview.looksGoodContinue")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm sticky top-24">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("aiInterview.whatWeExtract")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li>{t("aiInterview.fieldLabel")} and {t("aiInterview.experienceLabel")}</li>
                  <li>{t("aiInterview.keySkills")} and {t("aiInterview.strongestAreas")}</li>
                  <li>{t("aiInterview.technologies")} mentioned in the CV</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("aiInterview.bestResults")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li>{t("aiInterview.bestResults1Upload")}</li>
                  <li>{t("aiInterview.bestResults2Upload")}</li>
                  <li>{t("aiInterview.bestResults3Upload")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CvUploadPage;
