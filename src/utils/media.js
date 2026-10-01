const fs = require("node:fs/promises");
const path = require("node:path");
const { uploadDirectory } = require("../middleware/upload");

function uploadedUrl(file) {
  return file ? `/uploads/blog/${file.filename}` : null;
}

async function removeUploadedFiles(files = []) {
  await Promise.all(files.map(async (file) => {
    try {
      await fs.unlink(path.join(uploadDirectory, path.basename(file.filename)));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }));
}

async function removeMediaUrl(url) {
  if (!url?.startsWith("/uploads/blog/")) return;
  const filename = path.basename(url);
  await removeUploadedFiles([{ filename }]);
}

function requestFiles(req) {
  return Object.values(req.files || {}).flat();
}

module.exports = { uploadedUrl, removeUploadedFiles, removeMediaUrl, requestFiles };