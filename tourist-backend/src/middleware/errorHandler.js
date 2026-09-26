const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    status = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = "Duplicate value: " + err.errors.map((e) => e.message).join(", ");
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;