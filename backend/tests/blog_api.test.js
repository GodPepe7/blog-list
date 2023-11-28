const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("there are two blogs in json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(2);
});

test("blogs have id property", async () => {
  const blogs = await helper.blogsInDb();

  blogs.forEach((blog) => expect(blog.id).toBeDefined());
});

test("the first blog's title is gigachad", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].title).toBe("gigachad");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "ecma7",
    url: "await.com",
    like: 1000,
    id: "123sdfa213",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();

  const titles = blogs.map((blog) => blog.title);

  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain("async/await simplifies making async calls");
});

test("if no likes property provided it will default to 0", async () => {
  const newBlog = {
    title: "no one likes this blog",
    author: "loser",
    url: "sad.com",
    id: "123sdfa213",
  };

  await api.post("/api/blogs").send(newBlog);

  const blogs = await helper.blogsInDb();
  const targetBlog = blogs[blogs.length - 1];

  expect(targetBlog.likes).toBe(0);
});

test("if title or url are mising, respond with code 400", async () => {
  const newBlog = {
    author: "loser",
    likes: 1,
    id: "123sdfa213",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("delete by id", async () => {
  const blogs = await helper.blogsInDb();
  const targetId = blogs[0].id;

  await api.delete(`/api/blogs/${targetId}`);

  const updatedBlogs = await helper.blogsInDb();
  const ids = updatedBlogs.map((blog) => blog.id);

  expect(ids).not.toContain(targetId);
});

test("update by id", async () => {
  const blogs = await helper.blogsInDb();
  const targetId = blogs[0].id;
  const blog = {
    title: "not gigachad anymore",
    author: "him",
    url: "based.com",
    like: 10001,
  };

  await api.put(`/api/blogs/${targetId}`).send(blog);

  const updatedBlog = (await helper.blogsInDb()).find(
    (blog) => blog.id === targetId
  );

  expect(updatedBlog.title).toBe("not gigachad anymore");
});

afterAll(async () => {
  await mongoose.connection.close();
});
