const { Op, fn, col, literal } = require("sequelize");
const { Booking, Item, User, TimeSlot } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/stats
exports.getStats = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.count();
  const confirmedBookings = await Booking.count({ where: { status: "confirmed" } });
  const cancelledBookings = await Booking.count({ where: { status: "cancelled" } });
  const totalUsers = await User.count({ where: { role: "tourist" } });
  const totalItems = await Item.count();

  const revenueRow = await Booking.findOne({
    attributes: [[fn("SUM", col("totalPrice")), "total"]],
    where: { status: "confirmed" },
    raw: true,
  });

  const revenue = Number(revenueRow?.total || 0);

  const recent = await Booking.findAll({
    include: [{ model: Item, attributes: ["title", "image"] }],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  res.json({
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    totalUsers,
    totalItems,
    revenue,
    recent,
  });
});

// GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
  res.json(users);
});