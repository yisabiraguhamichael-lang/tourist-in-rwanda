const express = require("express");
const {
  getItems, getItem, createItem, updateItem, deleteItem,
} = require("../controllers/itemController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", protect, adminOnly, createItem);
router.put("/:id", protect, adminOnly, updateItem);
router.delete("/:id", protect, adminOnly, deleteItem);

module.exports = router;