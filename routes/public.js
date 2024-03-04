const { Router } = require("express");
const router = Router();
const publicController = require("../controllers/public");

//get all categories
// GET /api/categories
router.get("/categories", publicController.getCategories);

//get all categories
// GET /api/products
router.get("/products", publicController.getProducts);

//get products by filters
// GET /api/products/filters
router.get("/products/filters", publicController.getProductsByFilters);

//get products by id
// GET /api/products/:id
router.get("/product/:id", publicController.getProductById);

module.exports = router;
