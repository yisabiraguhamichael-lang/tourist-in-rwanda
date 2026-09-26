const { sequelize, Booking, TimeSlot, Item } = require("../models");
const asyncHandler = require("../utils/asyncHandler");
const generateRef = require("../utils/generateRef");

// POST /api/bookings  (protected)
exports.createBooking = asyncHandler(async (req, res) => {
  const { itemId, slotId, adults, children, customerName, customerEmail, customerPhone, customerCountry } = req.body;

  const result = await sequelize.transaction(async (t) => {
    // 1. Lock the slot row for update (prevents race conditions)
    const slot = await TimeSlot.findByPk(slotId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!slot) throw Object.assign(new Error("Slot not found"), { statusCode: 404 });
    if (slot.status !== "open") throw Object.assign(new Error("Slot is closed"), { statusCode: 400 });
    if (slot.itemId !== Number(itemId)) throw Object.assign(new Error("Slot does not match item"), { statusCode: 400 });

    // 2. Load item for pricing
    const item = await Item.findByPk(itemId, { transaction: t });
    if (!item) throw Object.assign(new Error("Item not found"), { statusCode: 404 });

    // 3. Check capacity
    const requested = Number(adults) + Number(children);
    const available = slot.capacity - slot.bookedCount;

    if (requested > available) {
      throw Object.assign(
        new Error(`Only ${available} spot(s) left in this slot`),
        { statusCode: 400 }
      );
    }

    // 4. Compute total
    const totalPrice = Number(adults) * item.priceAdult + Number(children) * item.priceChild;

    // 5. Create booking
    const booking = await Booking.create({
      reference: generateRef(),
      userId: req.user.id,
      itemId,
      slotId,
      visitDate: slot.date,
      visitTime: slot.startTime,
      adults,
      children,
      totalPrice,
      status: "confirmed",
      customerName,
      customerEmail,
      customerPhone,
      customerCountry,
    }, { transaction: t });

    // 6. Increment bookedCount atomically
    await slot.update(
      { bookedCount: slot.bookedCount + requested },
      { transaction: t }
    );

    return booking;
  });

  res.status(201).json(result);
});

// GET /api/bookings/my (protected)
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [{ model: Item, attributes: ["id", "title", "image", "location"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(bookings);
});

// GET /api/bookings/:id (protected)
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ model: Item }],
  });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
});

// PUT /api/bookings/:id/cancel (protected)
exports.cancelBooking = asyncHandler(async (req, res) => {
  const result = await sequelize.transaction(async (t) => {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!booking) throw Object.assign(new Error("Booking not found"), { statusCode: 404 });
    if (booking.status === "cancelled") {
      throw Object.assign(new Error("Already cancelled"), { statusCode: 400 });
    }

    // Free the slot
    const slot = await TimeSlot.findByPk(booking.slotId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (slot) {
      const freed = booking.adults + booking.children;
      const newCount = Math.max(0, slot.bookedCount - freed);
      await slot.update({ bookedCount: newCount }, { transaction: t });
    }

    await booking.update({ status: "cancelled" }, { transaction: t });
    return booking;
  });

  res.json(result);
});

// GET /api/bookings (admin)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    include: [
      { model: Item, attributes: ["id", "title", "image"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(bookings);
});