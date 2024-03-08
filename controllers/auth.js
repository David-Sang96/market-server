const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    //check if user-email already existed
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      throw new Error("User is already existed");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      isSuccess: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(409).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    //is email existed
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      throw new Error("E-mail does not exist");
    }
    //is password match
    const isPasswordMatch = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    // account status  check
    if (userDoc.status === "banned") {
      throw new Error("This account was banned.");
    }

    const createJwtToken = jwt.sign(
      { userId: userDoc._id },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({
      isSuccess: true,
      message: "logged in successfully",
      token: createJwtToken,
    });
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

// to check authenticated user and allow access
exports.checkCurrentUser = async (req, res) => {
  try {
    const userDoc = await User.findById(req.userId).select("name email role");
    if (!userDoc) {
      throw new Error("Unauthorized User");
    }
    return res.status(200).json({
      isSuccess: true,
      message: "User is authorized",
      userDoc,
    });
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
