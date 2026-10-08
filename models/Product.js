const mongoose = require("mongoose");

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

module.exports = mongoose.model("Product", productSchema);