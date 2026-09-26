const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, country } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, phone, country });

  const token = signToken(user.id);
  res.status(201).json({
    token,
    user: {
      id: user.id, name: user.name, email: user.email,
      role: user.role, country: user.country,
    },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user.id);
  res.json({
    token,
    user: {
      id: user.id, name: user.name, email: user.email,
      role: user.role, country: user.country,
    },
  });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});