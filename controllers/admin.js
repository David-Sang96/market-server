const Product = require("../models/product");
const User = require("../models/user");

// products
exports.getAllProducts = async (req, res) => {
  try {
    const productDocs = await Product.find()
      .populate("seller", "name") //get data from another Model and its key ("seller name") will get the seller doc
      .sort({ createdAt: -1 });
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

const updateProductStatus = async (req, res, status) => {
  const { id } = req.params;
  try {
    const productDoc = await Product.findById(id);
    if (!productDoc) {
      throw new Error("Product not found.");
    }

    productDoc.status = status;
    await productDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: `Product is ${
        status === "approve"
          ? "approved"
          : status === "reject"
          ? "rejected"
          : "roll back"
      }.`,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.approveProduct = async (req, res) => {
  await updateProductStatus(req, res, "approve");
};

exports.rejectProduct = async (req, res) => {
  await updateProductStatus(req, res, "reject");
};

exports.rollbackProduct = async (req, res) => {
  await updateProductStatus(req, res, "pending");
};

// users
exports.getAllUsers = async (req, res) => {
  try {
    const userDocs = await User.find()
      .select("name email role createdAt status")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      isSuccess: true,
      userDocs,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

const updateUserStatus = async (req, res, status) => {
  const { id } = req.params;
  try {
    const userDoc = await User.findById(id);
    if (!userDoc) {
      throw new Error("Product not found.");
    }

    userDoc.status = status;
    await userDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: `User is ${status === "ban" ? "banned" : "unbanned"}.`,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.banUser = async (req, res) => {
  await updateUserStatus(req, res, "ban");
};
exports.unBanUser = async (req, res) => {
  await updateUserStatus(req, res, "active");
};
