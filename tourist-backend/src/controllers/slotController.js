const { TimeSlot, Item } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/slots/item/:itemId?date=YYYY-MM-DD
exports.getSlotsForItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { date } = req.query;

  const where = { itemId, status: "open" };
  if (date) where.date = date;

  const slots = await TimeSlot.findAll({ where, order: [["date", "ASC"], ["startTime", "ASC"]] });

  // Attach availability
  const result = slots.map((s) => ({
    ...s.toJSON(),
    available: s.capacity - s.bookedCount,
    isFull: s.bookedCount >= s.capacity,
  }));

  res.json(result);
});

// POST /api/slots (admin)
exports.createSlot = asyncHandler(async (req, res) => {
  const slot = await TimeSlot.create(req.body);
  res.status(201).json(slot);
});

// POST /api/slots/bulk (admin) — create many for a date range
exports.bulkCreateSlots = asyncHandler(async (req, res) => {
  const { itemId, dates, times, capacity } = req.body;
  const rows = [];
  for (const date of dates) {
    for (const startTime of times) {
      rows.push({ itemId, date, startTime, capacity: capacity || 20 });
    }
  }
  const created = await TimeSlot.bulkCreate(rows, { ignoreDuplicates: true });
  res.status(201).json({ created: created.length });
});

// PUT /api/slots/:id (admin)
exports.updateSlot = asyncHandler(async (req, res) => {
  const slot = await TimeSlot.findByPk(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });
  await slot.update(req.body);
  res.json(slot);
});

// DELETE /api/slots/:id (admin)
exports.deleteSlot = asyncHandler(async (req, res) => {
  const slot = await TimeSlot.findByPk(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });
  await slot.destroy();
  res.json({ message: "Slot deleted" });
});