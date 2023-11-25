const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const bloglistRouter = require("./controllers/blog");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", bloglistRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
