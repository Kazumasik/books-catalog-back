const express = require("express");
const { body } = require("express-validator");

const bookController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post('/create',  bookController.postBook);

module.exports = router;
