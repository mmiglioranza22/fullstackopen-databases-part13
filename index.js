require("dotenv").config();
const express = require("express");
const app = express();

const { Sequelize, Model, DataTypes, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

Note.sync(); // CREATE TABLE IF NOT EXISTS...

app.get("/api/notes", async (req, res) => {
  // const notes = await sequelize.query("SELECT * FROM notes", {
  // 	type: QueryTypes.SELECT,
  // });
  const notes = await Note.findAll();
  console.log(notes.map((n) => n.toJSON()));
  res.json(notes);
});

app.get("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    note.important = req.body.important;
    await note.save();
    res.json(note);
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
//     const notes = await sequelize.query("SELECT * FROM notes", {
//       type: QueryTypes.SELECT,
//     });
//     console.log(notes);
//     sequelize.close();
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// main();
