const { Router } = require("express");
const router = Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const productController = require("../controllers/product");

//add product
// POST /create
router.post(
  "/create-product",
  authMiddleware,
  [
    body("product_name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required"),
    body("product_description")
      .trim()
      .notEmpty()
      .withMessage("Product description is required"),
    body("product_price")
      .trim()
      .notEmpty()
      .withMessage("Product price is required"),
    body("product_category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required"),
    body("product_used_for")
      .trim()
      .notEmpty()
      .withMessage("Product usedFor is required"),
    body("product_details")
      .isArray()
      .withMessage("Product details must be array"),
  ],
  productController.addNewProduct
);

// get all products
// GET /products
router.get("/products", authMiddleware, productController.getAllProducts);

//get old product
//GET /products/:id
router.get("/products/:id", authMiddleware, productController.getOldProduct);

//update product
//PUT /update-product/:id
router.put(
  "/update-product",
  authMiddleware,
  [
    body("product_name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required"),
    body("product_description")
      .trim()
      .notEmpty()
      .withMessage("Product description is required"),
    body("product_price")
      .trim()
      .notEmpty()
      .withMessage("Product price is required"),
    body("product_category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required"),
    body("product_used_for")
      .trim()
      .notEmpty()
      .withMessage("Product usedFor is required"),
    body("product_details")
      .isArray()
      .withMessage("Product details must be array"),
  ],
  productController.updateProduct
);

//delete product
//DELETE /product/:id
router.delete("/product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
