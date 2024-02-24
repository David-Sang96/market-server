const { validationResult } = require("express-validator");
const Product = require("../models/product");

exports.addNewProduct = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).json({
      isSuccess: false,
      message: error.array()[0].msg,
    });
  }
  const {
    product_name,
    product_description,
    product_price,
    product_category,
    product_used_for,
    product_details,
  } = req.body;

  try {
    const productDoc = await Product.create({
      name: product_name,
      description: product_description,
      price: product_price,
      category: product_category,
      usedFor: product_used_for,
      details: product_details,
      seller: req.userId,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "Product added to sell list",
      productDoc,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const productDoc = await Product.find({ seller: req.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Product datas have been fetched successfully",
      productDoc,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getOldProduct = async (req, res) => {
  try {
    const productDoc = await Product.findOne({ _id: req.params.id });
    return res.status(200).json({
      isSuccess: true,
      message: "Product datas have been fetched successfully",
      productDoc,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).json({
      isSuccess: false,
      message: error.array()[0].msg,
    });
  }

  try {
    const {
      product_name,
      product_description,
      product_price,
      product_category,
      product_used_for,
      product_details,
      seller_id,
      product_id,
    } = req.body;
    if (req.userId.toString() !== seller_id) {
      throw new Error("Authorization Failed");
    }
    const productDoc = await Product.findOne({ _id: product_id });
    productDoc.name = product_name;
    productDoc.category = product_category;
    productDoc.price = product_price;
    productDoc.description = product_description;
    productDoc.usedFor = product_used_for;
    productDoc.details = product_details;
    productDoc.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Product is updated",
      productDoc,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productDoc = await Product.findOne({ _id: id });
    if (req.userId.toString() !== productDoc.seller.toString()) {
      throw new Error("Authorization Failed");
    }
    await Product.findByIdAndDelete(id);

    return res.status(202).json({
      isSuccess: true,
      message: "Product deleted",
      productDoc,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};