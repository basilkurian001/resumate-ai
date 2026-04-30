import { extractText } from "../utils/parser.js";
import logger from "../utils/logger.js";

export const createResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //file parsing
    const text = await extractText(file);
    //console.log("Extracted text:", text); // preview

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