const Blog = require("../models/blog");
const User = require("../models/user");
const bloglistRouter = require("express").Router();
const jwt = require("jsonwebtoken");

bloglistRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  return response.json(blogs);
});

bloglistRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).json({
      error: "Title or URL missing",
    });
  }
  const decodedToken = jwt.verify(request?.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({ ...request.body, user: user.id });

  const result = await blog.save();
  user.blogs = user.blogs.concat(blog.id);
  await user.save();
  response.status(201).json(result);
});

bloglistRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;

  await blog.findByIdAndDelete(id);
  return response.status(204).end();
});

bloglistRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const id = request.params.id;

  const updatedPerson = await Blog.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if (updatedPerson) {
    return response.json(updatedPerson);
  } else {
    return response.status(400).json({ error: `No blog with id: ${id}` });
  }
});

module.exports = bloglistRouter;
