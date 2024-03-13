const Product = require("../models/product");
const User = require("../models/user");

// products
exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  try {
    const productDocs = await Product.find()
      .populate("seller", "name") //get data from another Model and its key ("seller name") will get the seller doc
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(10);

    const totalProductCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalProductCount / perPage);
    const pendingProducts = await Product.find({ status: "pending" });

    return res.status(200).json({
      isSuccess: true,
      message: "Products list is ready to view",
      productDocs,
      totalPages,
      currentPage: page,
      totalProductCount,
      pendingProducts,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getProductsForBar = async (req, res) => {
  try {
    const productDocs = await Product.find();
    return res.status(200).json({
      isSuccess: true,
      productDocs,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

// const updateProductStatus = async (req, res, status) => {
//   const { id } = req.params;
//   try {
//     const productDoc = await Product.findById(id);
//     if (!productDoc) {
//       throw new Error("Product not found.");
//     }

//     productDoc.status = status;
//     await productDoc.save();
//     return res.status(200).json({
//       isSuccess: true,
//       message: `Product is ${
//         status === "approve"
//           ? "approved"
//           : status === "reject"
//           ? "rejected"
//           : "roll back"
//       }.`,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       isSuccess: false,
//       message: error.message,
//     });
//   }
// };

exports.approveProduct = async (req, res) => {
  // await updateProductStatus(req, res, "approve");
  const { id } = req.params;
  try {
    const productDoc = await Product.findById(id);
    if (!productDoc) {
      throw new Error("Product not found.");
    }

    productDoc.status = "approve";
    await productDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: "Product is approved",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.rejectProduct = async (req, res) => {
  // await updateProductStatus(req, res, "reject");
  const { id } = req.params;
  try {
    const productDoc = await Product.findById(id);

    if (!productDoc) {
      throw new Error("Product not found.");
    }

    productDoc.status = "reject";
    await productDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: "Product is rejected",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.rollbackProduct = async (req, res) => {
  // await updateProductStatus(req, res, "pending");
  const { id } = req.params;
  try {
    const productDoc = await Product.findById(id);
    if (!productDoc) {
      throw new Error("Product not found.");
    }

    productDoc.status = "pending";
    await productDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: "Product is roll back",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
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

// const updateUserStatus = async (req, res, status) => {
//   const { id } = req.params;
//   try {
//     const userDoc = await User.findById(id);
//     if (!userDoc) {
//       throw new Error("No user found.");
//     }

//     userDoc.status = status;
//     await userDoc.save();
//     return res.status(200).json({
//       isSuccess: true,
//       message: `User is ${status === "banned" ? "banned" : "unbanned"}.`,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       isSuccess: false,
//       message: error.message,
//     });
//   }
// };

exports.banUser = async (req, res) => {
  // await updateUserStatus(req, res, "banned");
  const { id } = req.params;
  try {
    const userDoc = await User.findById(id);
    if (!userDoc) {
      throw new Error("No user found.");
    }

    userDoc.status = "banned";
    await userDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: "User is banned",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.unBanUser = async (req, res) => {
  // await updateUserStatus(req, res, "active");

  const { id } = req.params;
  try {
    const userDoc = await User.findById(id);

    if (!userDoc) {
      throw new Error("No user found.");
    }

    userDoc.status = "active";
    await userDoc.save();
    return res.status(200).json({
      isSuccess: true,
      message: "User is unBanned",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
