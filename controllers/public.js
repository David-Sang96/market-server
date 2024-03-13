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
  const page = parseInt(req.query.page) || 1;
  const perPageProducts = 4;

  try {
    const productDocs = await Product.find({ status: "approve" })
      .populate("seller", "name")
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * perPageProducts)
      .limit(perPageProducts);

    const totalProductsCount = await Product.find({
      status: "approve",
    }).countDocuments();
    const totalPages = Math.ceil(totalProductsCount / perPageProducts);

    return res.status(200).json({
      isSuccess: true,
      message: "Product lists are ready to view",
      productDocs,
      totalPages,
      currentPage: page,
      totalProductsCount,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getProductsByFilters = async (req, res) => {
  try {
    const { searchKey, category } = req.query;
    const query = {};
    //$regex handle case sensitive of searchKey
    //$options handle to give all products that matches with a single letter
    if (searchKey) {
      query.name = { $regex: searchKey, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    const productDocs = await Product.find(query);
    if (!productDocs || productDocs.length === 0) {
      throw new Error("Product not found.");
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Products  are ready to view.",
      productDocs,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await Product.findById(id).populate(
      "seller",
      "name email"
    );
    if (!productDoc) {
      throw new Error("Product not found.");
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Product has be sent.",
      productDoc,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
