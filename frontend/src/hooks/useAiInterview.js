import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { aiInterviewApi } from "../api/aiInterview";

// Returns the current user's candidate profile (CV analysis + progress).
export const useCandidateProfile = () => {
  return useQuery({
    queryKey: ["candidateProfile"],
    queryFn: aiInterviewApi.getProfile,
  });
};

// Uploads a CV PDF, analyzes it, and refreshes the cached profile.
export const useUploadCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["uploadCV"],
    mutationFn: (file) => aiInterviewApi.uploadCV(file),
    onSuccess: () => {
      toast.success("CV analyzed successfully!");
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.msg || "Failed to analyze CV"),
  });
};

// Starts a new AI interview session.
export const useStartInterview = () => {
  return useMutation({
    mutationKey: ["startInterview"],
    mutationFn: (payload) => aiInterviewApi.startInterview(payload),
    onError: (error) =>
      toast.error(error.response?.data?.msg || "Failed to start interview"),
  });
};

// Submits an answer (or skip / follow-up) for the current question.
export const useSubmitAnswer = () => {
  return useMutation({
    mutationKey: ["submitAnswer"],
    mutationFn: aiInterviewApi.submitAnswer,
    onError: (error) =>
      toast.error(error.response?.data?.msg || "Failed to submit answer"),
  });
};

// Finalizes a session and returns the generated scorecard.
export const useInterviewResults = (sessionId) => {
  return useQuery({
    queryKey: ["interviewResults", sessionId],
    queryFn: () => aiInterviewApi.getResults(sessionId),
    enabled: !!sessionId,
  });
};

// Lists the current user's past interview sessions.
export const useInterviewHistory = () => {
  return useQuery({
    queryKey: ["interviewHistory"],
    queryFn: aiInterviewApi.getHistory,
  });
};
