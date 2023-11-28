const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "gigachad",
    author: "him",
    url: "based.com",
    like: 10001,
  },
  {
    title: "apex legends",
    author: "respawn",
    url: "apexlegends.com",
    like: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog.id;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs;
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
