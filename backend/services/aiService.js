import OpenAI from "openai";
import { logger } from "../utils/logger.js"
import path from "path";

/* =========================
   LAZY INIT (fixes env timing bug)
========================= */
let openai;

const getClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }

    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }
  return openai;
};

/* =========================
   SAFE JSON EXTRACTION
========================= */
const extractJSON = (text) => {
  try {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");

    if (first === -1 || last === -1) return null;

    const jsonString = text.slice(first, last + 1);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

/* =========================
   RESPONSE VALIDATION
========================= */
const validateResponse = (data) => {
  return (
    typeof data?.atsScore === "number" &&
    typeof data?.summary === "string" &&
    Array.isArray(data?.skills) &&
    Array.isArray(data?.missingSkills) &&
    Array.isArray(data?.strengths) &&
    Array.isArray(data?.keyHighlights) &&
    Array.isArray(data?.improvements)
  );
};

/* =========================
   TIMEOUT PROTECTION
========================= */
const withTimeout = (promise, ms = 20000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI_TIMEOUT")), ms)
    ),
  ]);
};

/* =========================
  AI analysis prompt
========================= */
const buildPrompt = (resumeText) => `
You are an expert resume analyzer and ATS (Applicant Tracking System) specialist.
Your task is to analyze the provided resume text and return a structured evaluation in strict JSON format only.
Do not include any extra text, explanations, or markdown formatting.
The output must be valid JSON that matches the schema below exactly.
{
  "atsScore": number,
  "summary": string,
  "skills": string[],
  "missingSkills": string[],
  "strengths": string[],
  "keyHighlights": string[],
  "improvements": string[]
}
Instructions:
1. atsScore : Evaluate keyword density, section clarity (e.g., Work Experience, Skills), use of standard headings, and avoidance of graphics/tables (assume plain text). Penalize missing contact info, ambiguous dates, or irrelevant content.

2. summary : Be concise, factual, and professional. Mention overall strength, potential role fit, and atsScore interpretation (e.g., "Good ATS score but lacks specific tools").

3. skills : Extract only skills explicitly mentioned (e.g., "Python", "Project Management", "Data Analysis"). Do not infer.

4. missingSkills : Based on the resume's industry/role (e.g., data science → missing "SQL", "TensorFlow"; marketing → missing "SEO", "Google Analytics"). If role ambiguous, list common missing skills from similar resumes.

5. strengths : Focus on quantifiable achievements, clear sectioning, keyword optimization, and relevant experience.

6. keyHighlights : Quote or paraphrase specific accomplishments (e.g., "Increased sales by 40% in 6 months"). Limit to 3-5 items.

7. improvements : Suggest concrete fixes: add a professional summary, quantify bullet points, include missing keywords, reformat dates, remove irrelevant experience, etc.

Important:
- Use double quotes for all strings and keys.
- Ensure arrays do not have trailing commas.
- If the resume is empty or invalid, return an empty skills/missingSkills array and set atsScore to 0 with a clear summary.
- Return ONLY ONE JSON object.
- Do NOT repeat the response.
- Do NOT generate multiple outputs.
- If you violate this, the response will be rejected

Now analyze the following resume:
${resumeText}
`;

/* =========================
   MAIN FUNCTION
========================= */
export const analyzeResume = async (resumeText, fileMeta = {}) => {
  const client = getClient();

  try {
    const completion = await withTimeout(
      client.chat.completions.create({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        messages: [
          {
            role: "user",
            content: buildPrompt(resumeText),
          },
        ],
        temperature: 0.2, // low = stable output
        top_p: 0.9,
        max_tokens: 2048,
        chat_template_kwargs: { enable_thinking: false },
        stream: false,
      }),
      20000
    );

    const raw = completion.choices?.[0]?.message?.content || "";

    const parsed = extractJSON(raw);

    if (!parsed || !validateResponse(parsed)) {
      throw new Error("INVALID_AI_RESPONSE");
    }

    return parsed;

  } catch (err) {
    //console.error("AI_ERROR:", err.message);
    logger.error("AI_RESPONSE_ERROR", {
      message: err.message,
      file: fileMeta.file,
      savedAt: fileMeta.savedAt,
      mime: fileMeta.mime
    });
    // Safe fallback (prevents frontend crash)
    return {
      status: 0,
      atsScore: 0,
      summary: "AI analysis failed. Please try again.",
      skills: [],
      missingSkills: [],
      strengths: [],
      keyHighlights: [],
      improvements: [],
    };
  }
};