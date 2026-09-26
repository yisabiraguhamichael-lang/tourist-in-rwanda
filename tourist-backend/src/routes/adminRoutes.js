const express = require("express");
const { getStats, getAllUsers } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;