const blog = require("../models/blog");
const Blog = require("../models/blog");
const bloglistRouter = require("express").Router();

bloglistRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

bloglistRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).json({
      error: "Title or URL missing",
    });
  }
  const blog = new Blog(request.body);
  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (exception) {
    next(exception);
  }
});

bloglistRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    await blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

bloglistRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const id = request.params.id;
  try {
    const updatedPerson = await blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedPerson) {
      response.json(updatedPerson);
    } else {
      response.status(400).json({ error: `No blog with id: ${id}` });
    }
  } catch (exception) {
    next(exception);
  }
});

module.exports = bloglistRouter;
