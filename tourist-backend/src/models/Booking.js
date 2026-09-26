const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING, unique: true, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  slotId: { type: DataTypes.INTEGER, allowNull: false },
  visitDate: { type: DataTypes.DATEONLY, allowNull: false },
  visitTime: { type: DataTypes.STRING, allowNull: false },
  adults: { type: DataTypes.INTEGER, defaultValue: 1 },
  children: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "confirmed",
  },
  customerName: { type: DataTypes.STRING },
  customerEmail: { type: DataTypes.STRING },
  customerPhone: { type: DataTypes.STRING },
  customerCountry: { type: DataTypes.STRING },
}, { timestamps: true });

module.exports = Booking;