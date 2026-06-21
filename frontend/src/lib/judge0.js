import axiosInstance from "./axios";

// Code execution now goes through our backend proxy (/api/code/execute)
// instead of calling the public Judge0 endpoint directly from the browser.
// This keeps the Judge0 API key on the server and requires authentication.
export async function executeCode(language, code) {
  try {
    const response = await axiosInstance.post("/code/execute", {
      language,
      code,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        `Failed to execute code: ${error.message}`,
    };
  }
}
