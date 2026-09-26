const express = require("express");
const {
  createBooking, getMyBookings, getBooking, cancelBooking, getAllBookings,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.get("/:id", protect, getBooking);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;