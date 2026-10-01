const { Router } = require("express");
const { Op } = require("sequelize");
const { Project, User } = require("../models");

const router = Router();

router.get("/", async (_req, res) => {
  const projects = await Project.findAll({
    where: { status: "published", publishedAt: { [Op.ne]: null } },
    include: [{ model: User, as: "author", attributes: ["name"] }],
    order: [["featured", "DESC"], ["sortOrder", "ASC"], ["publishedAt", "DESC"]],
  });

  return res.json({ projects });
});

router.get("/:slug", async (req, res) => {
  const project = await Project.findOne({
    where: { slug: req.params.slug, status: "published", publishedAt: { [Op.ne]: null } },
    include: [{ model: User, as: "author", attributes: ["name"] }],
  });

  if (!project) return res.status(404).json({ error: "Project not found." });
  return res.json({ project });
});

module.exports = router;