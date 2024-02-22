const { Router } = require("express");
const router = Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");

//create new user
//POST -> /register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required!")
      .isLength({ min: 3 })
      .withMessage("Name must have at least 3 characters"),
    body("email").trim().isEmail().withMessage("E-mail is not valid!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 5 })
      .withMessage("Password must have at least 5 characters!"),
  ],
  authController.register
);

//create new user
//POST -> /login
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("E-mail is not valid!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 5 })
      .withMessage("Password must have at least 5 characters!"),
  ],
  authController.login
);

module.exports = router;
