const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product_id: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    isRead: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
