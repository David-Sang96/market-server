const { Router } = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const bidController = require("../controllers/bit.controller");

const router = Router();

// create new bid
// POST / add-bid
router.post(
  "/add-bid",
  [
    body("comment").trim().notEmpty().withMessage("Bid is required."),
    body("phone").trim().notEmpty().withMessage("phone number is required."),
    body("product_id").trim().notEmpty().withMessage("product id is required."),
    body("seller_id").trim().notEmpty().withMessage("seller id is required."),
    body("buyer_id").trim().notEmpty().withMessage("buyer id is required."),
  ],
  authMiddleware,
  bidController.createBid
);
// get all bids
// GET / bids /:product_id
router.get("/bids/:product_id", bidController.getAllBids);

module.exports = router;
