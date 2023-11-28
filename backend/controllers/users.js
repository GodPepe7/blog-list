const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username || !password) {
    return response.status(400).json({
      error: "Username or Password missing",
    });
  }

  if (username?.length < 3 || password?.length < 3) {
    return response.status(400).json({
      error: "Username and Password needs to be atleast 3 characters long",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  if (savedUser) {
    response.status(201).json(savedUser);
  } else {
    response.status(400).end();
  }
});

module.exports = usersRouter;
