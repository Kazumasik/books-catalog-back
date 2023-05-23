const User = require('../models/user');

const isAdmin = (req, res, next) => {
  User.findById(req.userId).then((user)=>{
    console.log(user)
    if (user.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ error: "You dont have admin permissions." });
    }
  })
};

module.exports = isAdmin;