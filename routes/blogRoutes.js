const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const cacheMiddleware = require("../middlewares/cache").cacheMiddleware;
const clearCache = require("../middlewares/cache").clearCache;
const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get(
    "/api/blogs",
    requireLogin,
    cacheMiddleware(3600),
    async (req, res) => {
      const blogs = await Blog.find({ _user: req.user.id });
      console.log("blogs fetched");
      res.send(blogs);
    }
  );

  app.post("/api/blogs", requireLogin, clearCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
      console.log("blog saved");
    } catch (err) {
      res.send(400, err);
    }
  });
};
