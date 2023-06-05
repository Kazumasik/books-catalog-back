const Category = require("../models/category");

exports.createCategory = (req, res, next) => {
  // const imageUrl = req.file.path;
  const name = req.body.name;

  const category = new Category({
    name,
  });
  category.save().then((result) => {
    res.send(result);
  });
};

exports.getAllCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = "Server error";
      }
      next(error);
    });
};
