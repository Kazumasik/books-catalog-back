const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "books");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/epub+zip") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const uploadBook = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: limits,
}).single("book");

module.exports = uploadBook;