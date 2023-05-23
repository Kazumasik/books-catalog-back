const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

// const feedRoutes = require('./routes/feed');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const genreRoutes = require("./routes/genre");
const app = express();
app.use(bodyParser.json());


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const limits = {
  fileSize: 1024 * 1024 * 5,
};

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: limits,
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use('/feed', feedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/genre", genreRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://maxim4ik:qSfI1yz2bti9bQ0W@cluster0.nyu4b6m.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then((result) => {
    app.listen(5002);
    console.log("Server started succesfully!");
  })
  .catch((err) => console.log(err));
