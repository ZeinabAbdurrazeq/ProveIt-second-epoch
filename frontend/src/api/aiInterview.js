import axiosInstance from "../lib/axios";

export const aiInterviewApi = {
  // Upload the CV PDF as multipart form data and get back the analyzed profile.
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append("cv", file);
    const response = await axiosInstance.post(
      "/ai-interview/upload-cv",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  // Get the current user's candidate profile (null if no CV on file).
  getProfile: async () => {
    const response = await axiosInstance.get("/ai-interview/profile");
    return response.data;
  },

  // Start a new AI interview. Returns { sessionId, totalQuestions, firstQuestion }.
  startInterview: async (payload = {}) => {
    const response = await axiosInstance.post("/ai-interview/start", payload);
    return response.data;
  },

  // Submit an answer (or skip / follow-up) for a question in a session.
  // payload: { questionIndex, answer, timeSpent, isFollowUp, skipped }
  submitAnswer: async ({ sessionId, ...payload }) => {
    const response = await axiosInstance.post(
      `/ai-interview/${sessionId}/answer`,
      payload,
    );
    return response.data;
  },

  // Read-only fetch of a session (resume / refresh). Does NOT finalize it.
  getSession: async (sessionId) => {
    const response = await axiosInstance.get(`/ai-interview/${sessionId}`);
    return response.data;
  },

  // Finalize a session and get the generated scorecard.
  getResults: async (sessionId) => {
    const response = await axiosInstance.get(
      `/ai-interview/${sessionId}/results`,
    );
    return response.data;
  },

  // List the current user's past interview sessions (newest first).
  getHistory: async () => {
    const response = await axiosInstance.get("/ai-interview/history");
    return response.data;
  },
};
