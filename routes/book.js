const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const bookController = require("../controllers/book");
const commentController = require("../controllers/comment");
const ratingController = require('../controllers/rating');

const router = express.Router();

router.get("/search", bookController.searchBooksByTitle);

router.post("/create", isAuth, isAdmin, bookController.postBook);

router.post(
  "/:bookId/comment",
  isAuth,
  [body("content").trim().not().isEmpty()],
  commentController.createComment
);
router.post('/:bookId/rating', isAuth, ratingController.addRating);

router.get("/:bookId/comment", commentController.getComments);

router.delete("/comment/:commentId", isAuth, commentController.deleteComment);

router.put("/comment/:commentId", isAuth, commentController.updateComment);

router.put("/:bookId", isAuth, isAdmin, bookController.updateBook);

router.delete("/:bookId", isAuth, isAdmin, bookController.deleteBook);

router.get("/:bookId", bookController.getBookById);

router.get("/", bookController.getBooks);

module.exports = router;
