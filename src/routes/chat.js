const { Router } = require("express");
const { rateLimit } = require("express-rate-limit");
const { Op } = require("sequelize");
const { z } = require("zod");
const { BlogPost, Project } = require("../models");
const { createChatResponse } = require("../services/chatAssistant");

const router = Router();
const requestSchema = z.object({ message: z.string().trim().min(2).max(600) });
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "That’s a lot of questions for now. Please try again in a little while." },
});

router.post("/", chatLimiter, async (req, res) => {
  const input = requestSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ error: "Ask a question between 2 and 600 characters." });

  const publishedWhere = { status: "published", publishedAt: { [Op.ne]: null } };
  const [projects, posts] = await Promise.all([
    Project.findAll({
      where: publishedWhere,
      attributes: ["title", "slug", "role", "summary", "techStack", "featured", "sortOrder"],
      order: [["featured", "DESC"], ["sortOrder", "ASC"], ["publishedAt", "DESC"]],
      limit: 20,
    }),
    BlogPost.findAll({
      where: publishedWhere,
      attributes: ["title", "slug", "excerpt", "publishedAt"],
      order: [["publishedAt", "DESC"]],
      limit: 20,
    }),
  ]);

  return res.json(createChatResponse(input.data.message, { projects, posts }));
});

module.exports = router;