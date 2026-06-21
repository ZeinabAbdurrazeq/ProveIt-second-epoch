import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Loader2Icon } from "lucide-react";
import Navbar from "../components/Navbar";
import MicIndicator from "../components/interview/MicIndicator";
import StatusBadge from "../components/interview/StatusBadge";
import InterviewProgress from "../components/interview/InterviewProgress";
import QuestionTimer from "../components/interview/QuestionTimer";
import TranscriptArea from "../components/interview/TranscriptArea";
import InterviewControls from "../components/interview/InterviewControls";
import BrowserUnsupportedNotice from "../components/interview/BrowserUnsupportedNotice";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import { useSubmitAnswer } from "../hooks/useAiInterview";
import { aiInterviewApi } from "../api/aiInterview";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

// The interview is driven by a small state machine:
//   speaking  -> AI reads the question, mic is off
//   listening -> mic is on, transcript fills in live
//   processing-> answer is being evaluated by GPT
function InterviewPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { state } = useLocation();
  const { language: appLanguage } = useLanguage();

  const submitMutation = useSubmitAnswer();
  const [interviewLanguage, setInterviewLanguage] = useState(
    state?.language || appLanguage || "en",
  );
  const t = getTranslator(interviewLanguage || appLanguage);
  const { speak, cancel: cancelSpeech, isSpeaking } = useSpeechSynthesis({
    language: interviewLanguage,
  });

  // Interview state.
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(
    state?.totalQuestions || 0,
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    state?.firstQuestion || "",
  );
  const [status, setStatus] = useState("speaking");
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [loading, setLoading] = useState(!state?.firstQuestion);

  // Keep the latest elapsed seconds for the current question.
  const timeSpentRef = useRef(0);
  // Guards the initial question fetch so it runs once.
  const bootstrappedRef = useRef(false);
  // Prevents the same question from being submitted twice when the voice
  // auto-submit (onSilence) and the "Done" button race each other.
  const submittingRef = useRef(false);

  const finishInterview = useCallback(() => {
    cancelSpeech();
    navigate(`/ai-interview/results/${sessionId}`);
  }, [cancelSpeech, navigate, sessionId]);

  // Submit the current answer text. Shared by voice auto-submit, the
  // "Done" button, and typing mode.
  const submitAnswer = useCallback(
    (answerText, { skipped = false } = {}) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      setStatus("processing");

      submitMutation.mutate(
        {
          sessionId,
          questionIndex,
          answer: answerText || "",
          timeSpent: timeSpentRef.current,
          isFollowUp,
          skipped,
        },
        {
          onSuccess: (data) => {
            submittingRef.current = false;
            timeSpentRef.current = 0;
            resetTranscript();
            setTranscript("");

            if (data.askFollowUp && data.followUpQuestion) {
              setIsFollowUp(true);
              setCurrentQuestion(data.followUpQuestion);
              setStatus("speaking");
              return;
            }

            if (data.isComplete) {
              finishInterview();
              return;
            }

            setIsFollowUp(false);
            setQuestionIndex(data.questionIndex);
            setCurrentQuestion(data.nextQuestion);
            setStatus("speaking");
          },
          onError: () => {
            submittingRef.current = false;
            setStatus("listening");
          },
        },
      );
    },
    [finishInterview, isFollowUp, questionIndex, sessionId, submitMutation],
  );

  // Voice recognition: auto-submit after the silence window.
  const {
    isSupported,
    isListening,
    transcript,
    setTranscript,
    start: startListening,
    stop: stopListening,
    reset: resetTranscript,
  } = useSpeechRecognition({
    silenceTimeout: 2500,
    language: interviewLanguage,
    onSilence: (finalText) => {
      if (finalText && finalText.trim()) submitAnswer(finalText);
    },
  });

  // If we didn't arrive with the first question in router state, fetch the
  // session once (read-only) so a page refresh still works.
  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    if (currentQuestion) return;

    aiInterviewApi
      .getSession(sessionId)
      .then((data) => {
        const session = data?.session;
        if (!session) return;

        setInterviewLanguage(session.language || appLanguage || "en");

        if (session.status === "completed") {
          navigate(`/ai-interview/results/${sessionId}`, { replace: true });
          return;
        }

        const questions = session.questions || [];
        setTotalQuestions(questions.length);
        const resumeIndex = questions.findIndex((q) => !q.userAnswer);
        const index = resumeIndex === -1 ? 0 : resumeIndex;
        setQuestionIndex(index);
        setCurrentQuestion(questions[index]?.questionText || "");
        setStatus("speaking");
      })
      .catch(() => {
        /* handled below by the empty-question guard */
      })
      .finally(() => setLoading(false));
  }, [appLanguage, currentQuestion, navigate, sessionId]);

  // Speak each new question, then start listening (voice mode only).
  useEffect(() => {
    if (!currentQuestion || status !== "speaking") return;

    if (isTypingMode || !isSupported) {
      setStatus("listening");
      return;
    }

    resetTranscript();
    speak(currentQuestion, () => {
      setStatus("listening");
      startListening();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, status, isTypingMode, isSupported, speak, startListening]);

  const handleDoneSpeaking = () => {
    stopListening();
    submitAnswer(transcript);
  };

  const handleSkip = () => {
    stopListening();
    cancelSpeech();
    resetTranscript();
    setTranscript("");
    timeSpentRef.current = 0;
    submitAnswer("", { skipped: true });
  };

  const handleToggleTypingMode = () => {
    cancelSpeech();
    stopListening();
    setIsTypingMode((prev) => !prev);
    resetTranscript();
    setStatus("listening");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2Icon className="size-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isSupported && !isTypingMode) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-12 space-y-6">
          <BrowserUnsupportedNotice t={t} />
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsTypingMode(true);
                setStatus("listening");
              }}
            >
              {t("aiInterview.continueByTyping")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const uiStatus = isSpeaking ? "speaking" : status;

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <InterviewProgress current={questionIndex} total={totalQuestions} />

        <div className="flex items-center justify-between mt-4 mb-6">
          <span className="font-semibold">
            {t("aiInterview.question")}{" "}
            {Math.min(questionIndex + 1, totalQuestions || questionIndex + 1)}
            {totalQuestions ? ` / ${totalQuestions}` : ""}
            {isFollowUp && (
              <span className="badge badge-secondary badge-sm ms-2">
                {t("aiInterview.followUp")}
              </span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <QuestionTimer
              resetKey={`${questionIndex}-${isFollowUp}`}
              running={status !== "processing"}
              onTick={(s) => {
                timeSpentRef.current = s;
              }}
            />
            <StatusBadge status={uiStatus} t={t} />
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 mb-6">
          <div className="card-body">
            <p className="text-lg font-medium">{currentQuestion}</p>
          </div>
        </div>

        {!isTypingMode && (
          <div className="flex justify-center my-8">
            <MicIndicator isListening={isListening} isSpeaking={isSpeaking} />
          </div>
        )}

        <div className="mb-6">
          <TranscriptArea
            transcript={transcript}
            isTypingMode={isTypingMode}
            onTypedChange={setTranscript}
            disabled={status === "processing"}
            t={t}
          />
        </div>

        <InterviewControls
          isTypingMode={isTypingMode}
          onToggleTypingMode={handleToggleTypingMode}
          onDoneSpeaking={handleDoneSpeaking}
          onSkip={handleSkip}
          canSubmit={!!transcript.trim()}
          disabled={status === "processing" || isSpeaking}
          t={t}
        />

        {status === "processing" && (
          <p className="text-center text-sm text-base-content/60 mt-6">
            {t("aiInterview.feedbackGenerating")}
          </p>
        )}
      </div>
    </div>
  );
}

export default InterviewPage;
