const { Review, Item, User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/reviews/item/:itemId
exports.getReviewsForItem = asyncHandler(async (req, res) => {
  const reviews = await Review.findAll({
    where: { itemId: req.params.itemId },
    include: [{ model: User, attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(reviews);
});

// POST /api/reviews (protected)
exports.createReview = asyncHandler(async (req, res) => {
  const { itemId, rating, comment } = req.body;

  const review = await Review.create({
    userId: req.user.id,
    itemId,
    rating,
    comment,
  });

  // Recalculate item rating
  const all = await Review.findAll({ where: { itemId } });
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;

  await Item.update(
    { rating: Number(avg.toFixed(1)), reviewsCount: all.length },
    { where: { id: itemId } }
  );

  res.status(201).json(review);
});

// DELETE /api/reviews/:id (admin)
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  await review.destroy();
  res.json({ message: "Review deleted" });
});