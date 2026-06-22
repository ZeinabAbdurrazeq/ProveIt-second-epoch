import { ENV } from "../lib/env.js";

// Map our supported languages to Judge0 language IDs.
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
};

const RAPIDAPI_URL = ENV.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const PUBLIC_CE_URL = "https://ce.judge0.com";
const USE_RAPIDAPI = /rapidapi/i.test(RAPIDAPI_URL);

function buildHeaders(useRapidApi = false) {
  const headers = { "Content-Type": "application/json" };

  if (useRapidApi && ENV.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = ENV.JUDGE0_API_KEY;
    if (ENV.JUDGE0_API_HOST) {
      headers["X-RapidAPI-Host"] = ENV.JUDGE0_API_HOST;
    }
  }

  return headers;
}

async function submitToJudge0(baseUrl, headers, code, languageId) {
  return fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      language_id: languageId,
      source_code: code,
    }),
  });
}

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || typeof code !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "language and code are required" });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return res
        .status(400)
        .json({ success: false, error: `Unsupported language: ${language}` });
    }

    let response = await submitToJudge0(
      USE_RAPIDAPI ? RAPIDAPI_URL : PUBLIC_CE_URL,
      buildHeaders(USE_RAPIDAPI),
      code,
      languageId,
    );

    if (
      USE_RAPIDAPI &&
      !response.ok &&
      (response.status === 401 || response.status === 403)
    ) {
      // If the RapidAPI credential or plan is the problem, retry once against
      // the public CE endpoint so the code runner can still work.
      response = await submitToJudge0(
        PUBLIC_CE_URL,
        buildHeaders(false),
        code,
        languageId,
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return res.status(502).json({
        success: false,
        error:
          errorText ||
          `Judge0 request failed with status ${response.status}`,
      });
    }

    const data = await response.json();

    const output = data.stdout || "";
    const stderr = data.stderr || data.compile_output || "";

    if (stderr) {
      return res.status(200).json({ success: false, output, error: stderr });
    }

    return res
      .status(200)
      .json({ success: true, output: output || "No output" });
  } catch (error) {
    console.error("Error in executeCode controller:", error.message);
    return res.status(500).json({
      success: false,
      error: `Failed to execute code: ${error.message}`,
    });
  }
}
