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
      .notEmpty()
      .withMessage("Product details is required"),
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
router.delete("/products/:id", authMiddleware, productController.deleteProduct);

//upload product image
//POST /upload
router.post("/upload", authMiddleware, productController.uploadProductImages);

//get saved product images
//GET /product-images/:id
router.get(
  "/product-images/:id",
  authMiddleware,
  productController.getSavedImages
);

//delete saved product images
//DELETE /products/images/destroy/:productId/:imgToDelete
router.delete(
  "/products/images/destroy/:productId/:imgToDelete",
  authMiddleware,
  productController.deleteSavedProductImages
);

//save products
//POST /saved-products/:id
router.post(
  "/saved-products/:id",
  authMiddleware,
  productController.savedProducts
);

// get save products
// GET /saved-products
router.get(
  "/saved-products",
  authMiddleware,
  productController.getSavedProducts
);

// delete save products
// DELETE /saved-products
router.delete(
  "/unsaved-products/:id",
  authMiddleware,
  productController.deleteSavedProducts
);

module.exports = router;
