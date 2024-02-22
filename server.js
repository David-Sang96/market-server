const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
//global middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// routes
app.use(authRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
    app.listen(8000, () => {
      console.log("server is running on port 8000");
    });
  })
  .catch((err) => console.log(err));
