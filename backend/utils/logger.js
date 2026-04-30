import winston from "winston";
import fs from "fs";
import path from "path";

// Define log directory
const logDir = path.join("logs");

// Create logs folder if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

//create logs/files if not exist
const filesDir = path.join(logDir, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "error.log") }),
  ],
});

export default logger;