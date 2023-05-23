const Genre = require("../models/genre");

exports.createGenre = (req, res, next) => {
  // const imageUrl = req.file.path;
  const name = req.body.name;

  const genre = new Genre({
    name: name,
  });
  genre.save().then((result) => {
    res.send(result);
  });
};

exports.getAllGenres = (req, res, next) => {
  Genre.find()
    .then((genres) => {
      res.status(200).send(genres);
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = "Server error";
      }
      next(error);
    });
};
