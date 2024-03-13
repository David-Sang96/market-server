const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const bidModel = mongoose.model("Bid", BidSchema);

module.exports = bidModel;
