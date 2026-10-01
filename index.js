require("dotenv").config();

const path = require("node:path");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const { authenticate, authorizeRoles } = require("./src/middleware/auth");
const errorHandler = require("./src/middleware/errorHandler");
const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");
const adminBlogRoutes = require("./src/routes/adminBlog");
const projectRoutes = require("./src/routes/projects");
const adminProjectRoutes = require("./src/routes/adminProjects");
const chatRoutes = require("./src/routes/chat");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		const error = new Error("Origin is not allowed by CORS.");
		error.status = 403;
		return callback(error);
	},
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use("/uploads/blog", express.static(path.resolve(__dirname, "uploads/blog"), {
	dotfiles: "deny",
	index: false,
	maxAge: "1d",
	fallthrough: false,
}));

app.get("/api/health", async (_req, res) => {
	await sequelize.authenticate();
	return res.json({ status: "ok", database: "connected" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin/blog", authenticate, authorizeRoles("admin"), adminBlogRoutes);
app.use("/api/admin/projects", authenticate, authorizeRoles("admin"), adminProjectRoutes);

app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` }));
app.use((error, _req, res, _next) => {
	if (error.status === 403) return res.status(403).json({ error: error.message });
	return errorHandler(error, _req, res, _next);
});

async function startServer() {
	if (
		!process.env.JWT_SECRET ||
		process.env.JWT_SECRET.length < 32 ||
		/^(replace|change-me|your-secret)/i.test(process.env.JWT_SECRET)
	) {
		throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
	}

	await sequelize.authenticate();
	const port = Number(process.env.PORT || 4000);
	return app.listen(port, () => console.log(`Portfolio API listening on port ${port}.`));
}

if (require.main === module) {
	startServer().catch((error) => {
		console.error(`Unable to start portfolio API: ${error.message}`);
		process.exitCode = 1;
	});
}

module.exports = { app, startServer };
