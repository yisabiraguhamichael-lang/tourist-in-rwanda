const express = require("express");
const {
  getReviewsForItem, createReview, deleteReview,
} = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/item/:itemId", getReviewsForItem);
router.post("/", protect, createReview);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;