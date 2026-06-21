import axiosInstance from "../lib/axios";

export const invitationApi = {
  searchUsers: async (q) => {
    const response = await axiosInstance.get("/invitations/search-users", {
      params: { q },
    });
    return response.data;
  },

  sendInvitation: async (data) => {
    const response = await axiosInstance.post("/invitations", data);
    return response.data;
  },

  getMyInvitations: async () => {
    const response = await axiosInstance.get("/invitations/me");
    return response.data;
  },

  getPendingCount: async () => {
    const response = await axiosInstance.get("/invitations/pending-count");
    return response.data;
  },

  respondToInvitation: async ({ invitationId, action }) => {
    const response = await axiosInstance.post(
      `/invitations/${invitationId}/respond`,
      { action },
    );
    return response.data;
  },
};
