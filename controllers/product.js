const { validationResult } = require("express-validator");
const Product = require("../models/product");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: "dy5fq6uc7",
  api_key: "748255649822317",
  api_secret: process.env.CLOUD_API,
});

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
      message: "Product is updated.",
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

    if (!productDoc) {
      return res.status(404).json({
        isSuccess: true,
        message: "Product not found.",
      });
    }

    if (req.userId.toString() !== productDoc.seller.toString()) {
      throw new Error("Authorization Failed.");
    }

    if (productDoc.images && Array.isArray(productDoc.images)) {
      const deletePromise = productDoc.images.map((imgUrl) => {
        const publicId = imgUrl.substring(
          imgUrl.lastIndexOf("/") + 1,
          imgUrl.lastIndexOf(".")
        );
        return new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, (err, result) => {
            if (err) {
              reject(new Error("Cloud image deleting failed"));
            } else {
              resolve(result);
            }
          });
        });
      });
      await Promise.all(deletePromise);
    }

    await Product.findByIdAndDelete(id);

    return res.status(202).json({
      isSuccess: true,
      message: "Product deleted.",
      productDoc,
    });
  } catch (error) {
    return res.status(422).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.uploadProductImages = async (req, res) => {
  const productImageFiles = req.files;
  const productId = req.body.product_id;
  let secureUrlArray = [];
  try {
    productImageFiles.forEach((img) => {
      cloudinary.uploader.upload(img.path, async (err, result) => {
        if (!err) {
          const url = result.secure_url;
          secureUrlArray.push(url);
          if (productImageFiles.length === secureUrlArray.length) {
            await Product.findByIdAndUpdate(productId, {
              $push: { images: secureUrlArray },
            });
            return res.status(200).json({
              isSuccess: true,
              message: "Product images saved.",
              secureUrlArray,
            });
          }
        } else {
          throw new Error("Cloud upload failed.");
        }
      });
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getSavedImages = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await Product.findById(id).select("images");
    if (!productDoc) {
      throw new Error("Product not found.");
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Product images are fetched.",
      data: productDoc,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteSavedProductImages = async (req, res) => {
  try {
    const productId = req.params.productId;
    const decodedImgUrlToDelete = decodeURIComponent(req.params.imgToDelete);
    await Product.findByIdAndUpdate(productId, {
      $pull: { images: decodedImgUrlToDelete },
    });
    const publicId = decodedImgUrlToDelete.substring(
      decodedImgUrlToDelete.lastIndexOf("/") + 1,
      decodedImgUrlToDelete.lastIndexOf(".")
    );
    await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({
      isSuccess: true,
      message: "Image deleted.",
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
