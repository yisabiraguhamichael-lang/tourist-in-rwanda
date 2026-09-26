const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Item = sequelize.define("Item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: {
    type: DataTypes.ENUM("attraction", "guide", "package"),
    allowNull: false,
  },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  priceAdult: { type: DataTypes.FLOAT, defaultValue: 0 },
  priceChild: { type: DataTypes.FLOAT, defaultValue: 0 },
  duration: { type: DataTypes.STRING },
  highlights: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviewsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
}, { timestamps: true });

module.exports = Item;