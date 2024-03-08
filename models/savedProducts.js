const mongoose = require("mongoose");

const savedProduct = new mongoose.Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const savedProductModel = mongoose.model("SavedProduct", savedProduct);

module.exports = savedProductModel;
