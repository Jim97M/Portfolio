const { Router } = require("express");
const { rateLimit } = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { User, Role } = require("../models");

const router = Router();
const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.LOGIN_MAX_ATTEMPTS || 10),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles.map((role) => role.name),
  };
}

router.post("/login", loginLimiter, async (req, res) => {
  const input = loginSchema.safeParse(req.body);
  if (!input.success) {
    return res.status(400).json({ error: "Enter a valid email and password." });
  }

  const user = await User.findOne({
    where: { email: input.data.email.toLowerCase() },
    include: [{ model: Role, as: "roles", attributes: ["name"], through: { attributes: [] } }],
  });

  const validPassword = user && await bcrypt.compare(input.data.password, user.passwordHash);
  if (!validPassword || !user.isActive) {
    return res.status(401).json({ error: "Email or password is incorrect." });
  }

  user.lastLoginAt = new Date();
  await user.save({ fields: ["lastLoginAt"] });

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

  return res.json({ token, user: publicUser(user) });
});

router.get("/me", async (req, res) => {
  const { authenticate } = require("../middleware/auth");
  return authenticate(req, res, () => res.json({ user: publicUser(req.user) }));
});

module.exports = router;