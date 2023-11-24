require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bloglistRouter = require("./controllers/blog");
const mongoose = require("mongoose");

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", bloglistRouter);

module.exports = app;
