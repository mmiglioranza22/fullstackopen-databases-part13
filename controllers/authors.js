const router = require("express").Router();

const { Blog } = require("../models");
const { sequelize } = require("../util/db");

//stackoverflow.com/questions/56538035/finding-sum-and-grouping-in-sequelize
https: router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "articles"], // basically each id counts as a separate blog/article
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
