const User = require("../models/user");

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      res.status(200).send({
        id: user._id,
        nickname: user.nickname,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 404;
        error.message = "User with this id does not exist.";
      }
      next(error);
    });
};
exports.getCurrent = (req, res, next) => {
  User.findById(req.userId, "_id nickname email")
    .then((user) => {
      res.send({
        id: user._id,
        nickname: user.nickname,
        email: user.email,
      });
    })
    .catch((err) => {
      next(err);
    });
};
