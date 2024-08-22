require("dotenv").config();
const express = require("express");
const app = express();

const { Sequelize, Model, DataTypes, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      default: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

Blog.sync();

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  const blog = Blog.build(req.body);
  await blog.save();
  res.json(blog);
});

app.delete("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (blog === 1) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const main = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//     const blogs = await sequelize.query("SELECT * FROM blogs", {
//       type: QueryTypes.SELECT,
//     });
//     // console.log(blogs);
//     blogs.forEach((blog) => {
//       console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
//     });
//     sequelize.close();
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// main();
