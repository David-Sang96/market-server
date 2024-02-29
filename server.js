const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const adminRoutes = require("./routes/admin");

const storageConfig = multer.diskStorage({
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});
const fileFilterConfig = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

const app = express();
//global middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use(
  multer({ storage: storageConfig, fileFilter: fileFilterConfig }).array(
    "product_images"
  )
);

// routes
app.use(authRoutes);
app.use(productRoutes);
app.use("/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
    app.listen(8000, () => {
      console.log("server is running on port 8000");
    });
  })
  .catch((err) => console.log(err));
