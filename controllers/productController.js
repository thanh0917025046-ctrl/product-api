const Product = require("../models/Product");

// GET - Lấy tất cả Product
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET - Lấy Product theo pid
exports.getProductById = async (req, res) => {
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
};

// POST - Thêm Product
exports.createProduct = async (req, res) => {
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
};

// PUT - Cập nhật Product
exports.updateProduct = async (req, res) => {
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
};

// DELETE - Xóa Product
exports.deleteProduct = async (req, res) => {
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
};