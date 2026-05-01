import { extractText } from "../utils/parser.js";
import logger from "../utils/logger.js";
import { analyzeResume } from "../services/aiService.js";
import { v4 as uuidv4 } from "uuid";

const jobs = new Map();

export const createResume = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const jobId = uuidv4();

  // Initial job state
  jobs.set(jobId, {
    status: "uploading",
    progress: 10,
    result: null,
  });

  // RETURN STATUS IMMEDIATELY
  res.status(202).json({ jobId });

  // BACKGROUND PROCESS (no await here)
  processResume(jobId, file);
};

const processResume = async (jobId, file) => {
  try {
    // Step 1 -> Parsing
    jobs.set(jobId, {
      status: "parsing",
      progress: 40,
    });

    const text = await extractText(file);

    // Step 2 -> AI Analysis
    jobs.set(jobId, {
      status: "analyzing",
      progress: 70,
    });

    const analysis = await analyzeResume(text);

    // Step 3 -> Done
    jobs.set(jobId, {
      status: "completed",
      progress: 100,
      result: analysis,
    });

  } catch (err) {
    console.error("PROCESS ERROR:", err);

    logger.error({
      message: err.message,
      stack: err.stack,
    });

    jobs.set(jobId, {
      status: "failed",
      progress: 100,
      error: err.message,
    });
  }
};

export const getStatus = (req, res) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
};