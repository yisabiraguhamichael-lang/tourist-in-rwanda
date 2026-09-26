const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const slotRoutes = require("./routes/slotRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security & basics
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Rate limiting (100 req / 15 min per IP)
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
}));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🌍 Tourist in Rwanda API", status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;