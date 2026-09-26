const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TimeSlot = sequelize.define("TimeSlot", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false }, // "09:00"
  endTime: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER, defaultValue: 20 },
  bookedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: {
    type: DataTypes.ENUM("open", "closed"),
    defaultValue: "open",
  },
}, { timestamps: true });

module.exports = TimeSlot;