const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const genreController = require("../controllers/genre");

const router = express.Router();

router.get('/all', genreController.getAllGenres);

router.post('/create', isAuth, isAdmin, genreController.createGenre);

module.exports = router;