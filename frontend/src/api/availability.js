import axiosInstance from "../lib/axios";

export const availabilityApi = {
  getMyAvailability: async () => {
    const response = await axiosInstance.get("/availability/me");
    return response.data;
  },

  updateMyAvailability: async (weeklySchedule) => {
    const response = await axiosInstance.put("/availability/me", {
      weeklySchedule,
    });
    return response.data;
  },

  getUserAvailability: async (userId) => {
    const response = await axiosInstance.get(`/availability/${userId}`);
    return response.data;
  },
};
