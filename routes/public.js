const { Router } = require("express");
const router = Router();
const publicController = require("../controllers/public");

//get all categories
// GET /categories
router.get("/categories", publicController.getCategories);

//get all categories
// GET /products
router.get("/products", publicController.getProducts);

module.exports = router;
