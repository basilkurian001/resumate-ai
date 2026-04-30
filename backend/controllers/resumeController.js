import { extractText } from "../utils/parser.js";
import logger from "../utils/logger.js";
import { analyzeResume } from "../services/aiService.js";

export const createResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //file parsing
    const text = await extractText(file);
    const analysis = await analyzeResume(text);
    console.log(analysis);

    const result = {
      score: 85,
      suggestions: ["Improve keywords", "Add metrics"],
    };

    res.status(201).json(result);

  } catch (err) {
    console.log("Error: "+err);
    logger.error({
    message: err.message,
    stack: err.stack,
    });
    res.status(500).json({ error: "Server error" });
  }
};