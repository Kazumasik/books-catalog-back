const book = require("../models/book");

exports.postBook = (req, res, next) => {
  const imageUrl = req.file.path;
  const title = req.body.title;
  const description = req.body.description;

  const book = new Book({
    title: title,
    description: description,
    imageUrl: imageUrl,
  });
  book.save()
};
