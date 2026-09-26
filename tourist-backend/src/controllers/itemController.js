const { Op } = require("sequelize");
const { Item, TimeSlot } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/items?category=&search=&maxPrice=&sort=
exports.getItems = asyncHandler(async (req, res) => {
  const { category, search, maxPrice, sort } = req.query;
  const where = { status: "active" };

  if (category && category !== "all") where.category = category;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (maxPrice) where.priceAdult = { [Op.lte]: Number(maxPrice) };

  let order = [["createdAt", "DESC"]];
  if (sort === "price-asc") order = [["priceAdult", "ASC"]];
  if (sort === "price-desc") order = [["priceAdult", "DESC"]];
  if (sort === "rating") order = [["rating", "DESC"]];

  const items = await Item.findAll({ where, order });
  res.json(items);
});

// GET /api/items/:id
exports.getItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// POST /api/items (admin)
exports.createItem = asyncHandler(async (req, res) => {
  const item = await Item.create(req.body);
  res.status(201).json(item);
});

// PUT /api/items/:id (admin)
exports.updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  await item.update(req.body);
  res.json(item);
});

// DELETE /api/items/:id (admin)
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  await item.destroy();
  res.json({ message: "Item deleted" });
});