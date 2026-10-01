const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");

const uploadDirectory = path.resolve(__dirname, "../../uploads/blog");
fs.mkdirSync(uploadDirectory, { recursive: true });

const acceptedTypes = new Map([
  ["image/jpeg", new Set([".jpg", ".jpeg"])],
  ["image/png", new Set([".png"])],
  ["image/webp", new Set([".webp"])],
  ["video/mp4", new Set([".mp4"])],
  ["video/webm", new Set([".webm"])],
  ["text/vtt", new Set([".vtt"])],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 4,
    fileSize: Number(process.env.MAX_UPLOAD_MB || 100) * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const extensions = acceptedTypes.get(file.mimetype);
    if (!extensions?.has(extension)) {
      return callback(new Error("Unsupported upload. Use JPG, PNG, WebP, MP4, WebM, or VTT files."));
    }
    return callback(null, true);
  },
});

const blogMediaUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "videoPoster", maxCount: 1 },
  { name: "captions", maxCount: 1 },
]);
const projectImageUpload = upload.single("image");

module.exports = { blogMediaUpload, projectImageUpload, uploadDirectory };