const express = require("express");
const {
  getSlotsForItem, createSlot, bulkCreateSlots, updateSlot, deleteSlot,
} = require("../controllers/slotController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/item/:itemId", getSlotsForItem);
router.post("/", protect, adminOnly, createSlot);
router.post("/bulk", protect, adminOnly, bulkCreateSlots);
router.put("/:id", protect, adminOnly, updateSlot);
router.delete("/:id", protect, adminOnly, deleteSlot);

module.exports = router;