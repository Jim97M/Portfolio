const multer = require("multer");
const { UniqueConstraintError, ValidationError } = require("sequelize");

function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({ error: error.message });
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ error: "A record with that email or slug already exists." });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.errors.map((item) => item.message).join(" ") });
  }

  if (error.message?.startsWith("Unsupported upload.")) {
    return res.status(400).json({ error: error.message });
  }

  if (process.env.NODE_ENV !== "production") console.error(error);
  return res.status(500).json({ error: "An unexpected server error occurred." });
}

module.exports = errorHandler;