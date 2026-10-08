const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

// Cho phép đọc JSON
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Product routes
app.use("/api/products", productRoutes);

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Product API version 2"
  });
});

// Health Check
app.get("/health", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({
      status: "healthy"
    });
  }

  return res.status(503).json({
    status: "unhealthy"
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});