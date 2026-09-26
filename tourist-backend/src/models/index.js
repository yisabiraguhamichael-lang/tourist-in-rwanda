const sequelize = require("../config/database");
const User = require("./User");
const Item = require("./Item");
const TimeSlot = require("./TimeSlot");
const Booking = require("./Booking");
const Review = require("./Review");

// Associations
Item.hasMany(TimeSlot, { foreignKey: "itemId", onDelete: "CASCADE" });
TimeSlot.belongsTo(Item, { foreignKey: "itemId" });

Item.hasMany(Booking, { foreignKey: "itemId" });
Booking.belongsTo(Item, { foreignKey: "itemId" });

TimeSlot.hasMany(Booking, { foreignKey: "slotId" });
Booking.belongsTo(TimeSlot, { foreignKey: "slotId" });

User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

Item.hasMany(Review, { foreignKey: "itemId" });
Review.belongsTo(Item, { foreignKey: "itemId" });

module.exports = { sequelize, User, Item, TimeSlot, Booking, Review };