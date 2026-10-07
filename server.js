const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

/* =========================
   Product Schema
========================= */

const productSchema = new mongoose.Schema(
  {
    pid: {
      type: Number,
      required: true,
      unique: true
    },
    pname: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    versionKey: false
  }
);

const Product = mongoose.model("Product", productSchema);

/* =========================
   GET - Lấy tất cả Product
========================= */

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

/* =========================
   GET - Lấy Product theo pid
========================= */

app.get("/api/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: Number(req.params.pid)
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

/* =========================
   POST - Thêm Product
========================= */

app.post("/api/products", async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;

    const product = new Product({
      pid,
      pname,
      price,
      quantity
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

/* =========================
   PUT - Cập nhật Product
========================= */

app.put("/api/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        pid: Number(req.params.pid)
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

/* =========================
   DELETE - Xóa Product
========================= */

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: Number(req.params.pid)
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

/* =========================
   Test API
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Product API version 2"
  });
});

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState;

  if (mongoState === 1) {
    return res.status(200).json({
      status: "UP",
      mongodb: "CONNECTED"
    });
  }

  return res.status(503).json({
    status: "DOWN",
    mongodb: "DISCONNECTED"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
