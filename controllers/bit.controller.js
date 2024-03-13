const Bid = require("../models/Bid");
const { validationResult } = require("express-validator");

exports.createBid = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: error.array()[0].msg,
    });
  }
  try {
    const { comment, phone, product_id, seller_id, buyer_id } = req.body;

    if (seller_id === buyer_id) {
      throw new Error("Authorization failed.");
    }

    await Bid.create({
      product_id,
      seller_id,
      buyer_id,
      comment,
      phone_number: phone,
    });
    return res.status(201).json({
      isSuccess: true,
      message: "Comment submitted.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getAllBids = async (req, res) => {
  const { product_id } = req.params;
  try {
    const bidDocs = await Bid.find({ product_id })
      .populate("buyer_id", "name")
      .select("comment phone_number createdAt")
      .sort({ createdAt: -1 });

    if (!bidDocs || bidDocs.length === 0) {
      throw new Error("No commit is submitted yet.");
    }

    return res.status(200).json({
      isSuccess: true,
      bidDocs,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
