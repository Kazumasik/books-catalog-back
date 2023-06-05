const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const categoryController = require("../controllers/category");

const router = express.Router();

router.get('/all', categoryController.getAllCategories);

router.post('/create', isAuth, isAdmin, categoryController.createCategory);

module.exports = router;