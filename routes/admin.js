const { Router } = require("express");

const router = Router();
const adminController = require("../controllers/admin");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/isAdmin");

//get all products
//GET /admin/products
router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  adminController.getAllProducts
);

// get all productsForBar
// GET /admin/products-by-categories
router.get(
  "/products-by-categories",
  authMiddleware,
  adminMiddleware,
  adminController.getProductsForBar
);

//approve product
// POST /admin/product-approve/:id
router.post(
  "/product-approve/:id",
  authMiddleware,
  adminMiddleware,
  adminController.approveProduct
);

//reject product
// POST /admin/product-reject/:id
router.post(
  "/product-reject/:id",
  authMiddleware,
  adminMiddleware,
  adminController.rejectProduct
);

//rollback product
// POST /admin/product-rollback/:id
router.post(
  "/product-rollback/:id",
  authMiddleware,
  adminMiddleware,
  adminController.rollbackProduct
);

//get user list
// GET admin/users
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  adminController.getAllUsers
);

//ban user
// POST /admin/user-ban/:id
router.post(
  "/user-ban/:id",
  authMiddleware,
  adminMiddleware,
  adminController.banUser
);

//ban user
// POST /admin/user-ban/:id
router.post(
  "/user-unban/:id",
  authMiddleware,
  adminMiddleware,
  adminController.unBanUser
);

module.exports = router;
