const { Router } = require("express");
const { z } = require("zod");
const { BlogPost } = require("../models");
const { blogMediaUpload } = require("../middleware/upload");
const { uploadedUrl, removeUploadedFiles, removeMediaUrl, requestFiles } = require("../utils/media");
const { createSlug } = require("../utils/slug");

const router = Router();
const postSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(500).default(""),
  content: z.string().min(1),
  status: z.enum(["draft", "published"]).default("draft"),
});
const updateSchema = postSchema.partial();

function uploadFor(req, field) {
  return req.files?.[field]?.[0];
}

function isRequested(value) {
  return value === true || value === "true";
}

function setPublicationDate(post, nextStatus) {
  if (nextStatus === "published" && !post.publishedAt) post.publishedAt = new Date();
  if (nextStatus === "draft") post.publishedAt = null;
}

router.get("/", async (_req, res) => {
  const posts = await BlogPost.findAll({ order: [["updatedAt", "DESC"]] });
  return res.json({ posts });
});

router.post("/", blogMediaUpload, async (req, res) => {
  const input = postSchema.safeParse(req.body);
  if (!input.success) {
    await removeUploadedFiles(requestFiles(req));
    return res.status(400).json({ error: "Invalid blog post.", details: input.error.issues });
  }

  const data = input.data;
  const post = await BlogPost.create({
    ...data,
    slug: data.slug ? createSlug(data.slug) : createSlug(data.title),
    authorId: req.user.id,
    coverImageUrl: uploadedUrl(uploadFor(req, "coverImage")),
    videoUrl: uploadedUrl(uploadFor(req, "video")),
    videoPosterUrl: uploadedUrl(uploadFor(req, "videoPoster")),
    captionsUrl: uploadedUrl(uploadFor(req, "captions")),
    publishedAt: data.status === "published" ? new Date() : null,
  });

  return res.status(201).json({ post });
});

router.patch("/:id", blogMediaUpload, async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) {
    await removeUploadedFiles(requestFiles(req));
    return res.status(404).json({ error: "Blog post not found." });
  }

  const input = updateSchema.safeParse(req.body);
  if (!input.success) {
    await removeUploadedFiles(requestFiles(req));
    return res.status(400).json({ error: "Invalid blog post update.", details: input.error.issues });
  }

  const data = input.data;
  const files = {
    coverImageUrl: uploadFor(req, "coverImage"),
    videoUrl: uploadFor(req, "video"),
    videoPosterUrl: uploadFor(req, "videoPoster"),
    captionsUrl: uploadFor(req, "captions"),
  };
  const oldMedia = [];

  for (const [field, file] of Object.entries(files)) {
    if (file) {
      if (post[field]) oldMedia.push(post[field]);
      post[field] = uploadedUrl(file);
    }
  }

  for (const [requestField, modelField] of [
    ["removeCoverImage", "coverImageUrl"],
    ["removeVideo", "videoUrl"],
    ["removeVideoPoster", "videoPosterUrl"],
    ["removeCaptions", "captionsUrl"],
  ]) {
    if (isRequested(req.body[requestField]) && post[modelField]) {
      oldMedia.push(post[modelField]);
      post[modelField] = null;
    }
  }

  if (data.title !== undefined) post.title = data.title;
  if (data.slug !== undefined) post.slug = createSlug(data.slug);
  if (data.excerpt !== undefined) post.excerpt = data.excerpt;
  if (data.content !== undefined) post.content = data.content;
  if (data.status !== undefined) {
    post.status = data.status;
    setPublicationDate(post, data.status);
  }

  try {
    await post.save();
  } catch (error) {
    await removeUploadedFiles(requestFiles(req));
    throw error;
  }

  await Promise.all(oldMedia.map(removeMediaUrl));
  return res.json({ post });
});

router.delete("/:id", async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Blog post not found." });

  await post.destroy();
  await Promise.all([
    removeMediaUrl(post.coverImageUrl),
    removeMediaUrl(post.videoUrl),
    removeMediaUrl(post.videoPosterUrl),
    removeMediaUrl(post.captionsUrl),
  ]);
  return res.status(204).end();
});

module.exports = router;