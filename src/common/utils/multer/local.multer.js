import multer from "multer";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";

export const localFileUpload = (customPath = "general") => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const fullPath = resolve(`../uploads/${customPath}`);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueFileName = randomUUID() + "_" + file.originalname;
      file.finalPath = `uploads/${customPath}/${uniqueFileName}`
      cb(null, uniqueFileName);
    },
  });
  return multer({ storage });
};
