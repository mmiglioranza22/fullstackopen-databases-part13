const router = require("express").Router();

const { Blog, User } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"],
    },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const user = await User.findByPk(req.userId);
  // userId is set via the relationships established in db.js between models
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (req.blog.userId === req.userId) {
    next();
  } else {
    return res
      .status(403)
      .json({ error: "Forbidden, you are not the owner of the blog" });
  }
};

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog.userId !== req.userId) {
    res.send(403).json("Forbidden");
  }
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
