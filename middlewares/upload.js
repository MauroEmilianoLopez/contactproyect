import multer from "multer";
import { join, extname } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const destination = (req, file, cb) => {
  const folder = join(process.cwd(), "public", "assets");
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }
  return cb(null, folder);
};

const filename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + extname(file.originalname));
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!file || allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)"), false);
  }
};

const upload = multer({
  storage: multer.diskStorage({ destination, filename }),
  fileFilter,
});

export default upload;
