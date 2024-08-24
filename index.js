const express = require("express");
const jwt = require("jsonwebtoken");

require("express-async-errors"); // eliminates need for try catch blocks in each controller
const app = express();

const { PORT, SECRET } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");

app.use(express.json());

// checks for preexisting token, sets it if exists or allows only user and login controllers (that enable creating/accessing a token)
const checkExistingToken = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
    next();
  } else {
    next();
  }
};

const validateUserToken = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: "token missing" });
  }
  const decodedToken = jwt.verify(req.token, SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  } else {
    req.userId = decodedToken.id;
    next();
  }
};

app.use(checkExistingToken);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/blogs", validateUserToken, blogsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
