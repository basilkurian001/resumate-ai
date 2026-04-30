import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";
import { ensureTesseractModel } from "./utils/tesseractEnsureModel.js";

await ensureTesseractModel(); //Make sure the tesseract model exist in /tessdata

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resumes", resumeRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Server start
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});