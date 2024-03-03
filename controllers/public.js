const Product = require("../models/product");

exports.getCategories = async (req, res) => {
  try {
    const productDocs = await Product.find();
    return res.status(200).json({
      isSuccess: true,
      message: "Products list is ready to view",
      productDocs,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const productDocs = await Product.find({ status: "approve" })
      .populate("seller", "name")
      .sort({
        createdAt: -1,
      });
    return res.status(200).json({
      isSuccess: true,
      message: "Products list is ready to view",
      productDocs,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
