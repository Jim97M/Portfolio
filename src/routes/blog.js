const { Router } = require("express");
const { Op } = require("sequelize");
const { z } = require("zod");
const { BlogPost, User } = require("../models");

const router = Router();
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

router.get("/", async (req, res) => {
  const pagination = paginationSchema.safeParse(req.query);
  if (!pagination.success) {
    return res.status(400).json({ error: "Invalid pagination parameters." });
  }

  const { page, limit } = pagination.data;
  const result = await BlogPost.findAndCountAll({
    where: { status: "published", publishedAt: { [Op.ne]: null } },
    attributes: { exclude: ["updatedAt"] },
    include: [{ model: User, as: "author", attributes: ["name"] }],
    order: [["publishedAt", "DESC"]],
    limit,
    offset: (page - 1) * limit,
  });

  return res.json({
    posts: result.rows,
    pagination: { page, limit, total: result.count, pages: Math.ceil(result.count / limit) },
  });
});

router.get("/:slug", async (req, res) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, status: "published", publishedAt: { [Op.ne]: null } },
    attributes: { exclude: ["updatedAt"] },
    include: [{ model: User, as: "author", attributes: ["name"] }],
  });

  if (!post) return res.status(404).json({ error: "Blog post not found." });
  return res.json({ post });
});

module.exports = router;