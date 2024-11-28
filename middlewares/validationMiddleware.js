import { validationResult } from "express-validator";
import multer from "multer";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";

export const validationMiddleware = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const imagePath = path.join(__dirname, "../uploads");
      await fs.unlink(`${imagePath}/${req.file.filename}`);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const globalErrorMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
  } else if (err.message === "Unexpected end of form") {
    res.status(400).json({ message: "Imagen no encontrada" });
  } else {
    res.status(500).json({ message: err.message });
  }
};
