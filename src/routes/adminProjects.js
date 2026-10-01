const { Router } = require("express");
const { z } = require("zod");
const { Project } = require("../models");
const { projectImageUpload } = require("../middleware/upload");
const { uploadedUrl, removeUploadedFiles, removeMediaUrl } = require("../utils/media");
const { createSlug } = require("../utils/slug");

const router = Router();
const urlSchema = z.union([z.string().url(), z.literal("")]).optional();
const techStackSchema = z.union([
  z.string().transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean)),
  z.array(z.string().trim().min(1)).max(30),
]);
const projectSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().max(200).optional(),
  role: z.string().trim().max(120).default(""),
  summary: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1),
  techStack: techStackSchema.default([]),
  liveUrl: urlSchema,
  sourceUrl: urlSchema,
  featured: z.preprocess((value) => value === true || value === "true", z.boolean()).default(false),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});
const updateSchema = projectSchema.partial();

router.get("/", async (_req, res) => {
  const projects = await Project.findAll({ order: [["sortOrder", "ASC"], ["updatedAt", "DESC"]] });
  return res.json({ projects });
});

router.post("/", projectImageUpload, async (req, res) => {
  const input = projectSchema.safeParse(req.body);
  if (!input.success) {
    if (req.file) await removeUploadedFiles([req.file]);
    return res.status(400).json({ error: "Invalid project.", details: input.error.issues });
  }

  const data = input.data;
  try {
    const project = await Project.create({
      ...data,
      slug: data.slug ? createSlug(data.slug) : createSlug(data.title),
      liveUrl: data.liveUrl || null,
      sourceUrl: data.sourceUrl || null,
      authorId: req.user.id,
      imageUrl: uploadedUrl(req.file),
      publishedAt: data.status === "published" ? new Date() : null,
    });
    return res.status(201).json({ project });
  } catch (error) {
    if (req.file) await removeUploadedFiles([req.file]);
    throw error;
  }
});

router.patch("/:id", projectImageUpload, async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    if (req.file) await removeUploadedFiles([req.file]);
    return res.status(404).json({ error: "Project not found." });
  }

  const input = updateSchema.safeParse(req.body);
  if (!input.success) {
    if (req.file) await removeUploadedFiles([req.file]);
    return res.status(400).json({ error: "Invalid project update.", details: input.error.issues });
  }

  const data = input.data;
  let oldImageUrl = null;
  if (data.title !== undefined) project.title = data.title;
  if (data.slug !== undefined) project.slug = createSlug(data.slug);
  if (data.role !== undefined) project.role = data.role;
  if (data.summary !== undefined) project.summary = data.summary;
  if (data.description !== undefined) project.description = data.description;
  if (data.techStack !== undefined) project.techStack = data.techStack;
  if (data.liveUrl !== undefined) project.liveUrl = data.liveUrl || null;
  if (data.sourceUrl !== undefined) project.sourceUrl = data.sourceUrl || null;
  if (data.featured !== undefined) project.featured = data.featured;
  if (data.sortOrder !== undefined) project.sortOrder = data.sortOrder;
  if (data.status !== undefined) {
    project.status = data.status;
    if (data.status === "published" && !project.publishedAt) project.publishedAt = new Date();
    if (data.status === "draft") project.publishedAt = null;
  }
  if (req.file) {
    oldImageUrl = project.imageUrl;
    project.imageUrl = uploadedUrl(req.file);
  } else if (req.body.removeImage === "true") {
    oldImageUrl = project.imageUrl;
    project.imageUrl = null;
  }

  try {
    await project.save();
  } catch (error) {
    if (req.file) await removeUploadedFiles([req.file]);
    throw error;
  }

  if (oldImageUrl) await removeMediaUrl(oldImageUrl);
  return res.json({ project });
});

router.delete("/:id", async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found." });

  await project.destroy();
  await removeMediaUrl(project.imageUrl);
  return res.status(204).end();
});

module.exports = router;