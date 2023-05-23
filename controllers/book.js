const Book = require("../models/book");
const Comment = require("../models/comment");
const path = require("path");
const fs = require("fs");
exports.getBooks = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const genreIds = req.query.genre; // Получаем значения параметра жанров из запроса

  try {
    let query = Book.find();

    if (genreIds) {
      const genreIdArray = Array.isArray(genreIds) ? genreIds : [genreIds]; // Преобразуем значения жанров в массив, если передано только одно значение
      query = query.where("genres").all(genreIdArray); // Фильтруем книги по указанным жанрам
    }

    const [totalBooksCount, books] = await Promise.all([
      Book.countDocuments(query),
      query
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-comments -ratings")
        .populate("genres")
        .lean(),
    ]);

    const totalPages = Math.ceil(totalBooksCount / limit);

    res.send({
      books,
      totalPages,
      page,
    });
  } catch (error) {
    next(error);
  }
};
exports.postBook = (req, res, next) => {
  console.log(req.file)
  const imageUrl = req.file.path;
  const title = req.body.title;
  const origTitle = req.body.origTitle;
  const description = req.body.description;
  const genres = JSON.parse(req.body.genres);

  const book = new Book({
    title: title,
    origTitle: origTitle,
    description: description,
    genres: genres,
    imageUrl: imageUrl,
  });
  book
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateBook = (req, res, next) => {
  const bookId = req.params.bookId;
  const updateData = {
    title: req.body.title,
    origTitle: req.body.origTitle,
    description: req.body.description,
    genres: JSON.parse(req.body.genres),
  };

  // Check if a new image is uploaded
  if (req.file) {
    const newImageUrl = req.file.path;

    // Find the book and retrieve the old image URL
    Book.findById(bookId)
      .then((book) => {
        if (!book) {
          // Book not found
          throw new Error("Book with this id does not exist");
        }

        const oldImageUrl = book.imageUrl;

        // Update the book with the new image URL
        updateData.imageUrl = newImageUrl;

        // Remove the old image file
        fs.unlinkSync(oldImageUrl);

        // Update the book in the database
        return Book.findByIdAndUpdate(bookId, updateData, { new: true });
      })
      .then((updatedBook) => {
        if (!updatedBook) {
          // Book not found
          throw new Error("Book with this id does not exist");
        }

        res.send(updatedBook);
      })
      .catch((error) => {
        // Handle errors
        next(error);
      });
  } else {
    // No new image uploaded, update the book without modifying the imageUrl
    Book.findByIdAndUpdate(bookId, updateData, { new: true })
      .then((updatedBook) => {
        if (!updatedBook) {
          // Book not found
          throw new Error("Book with this id does not exist");
        }

        res.send(updatedBook);
      })
      .catch((error) => {
        // Handle errors
        next(error);
      });
  }
};
exports.getBookById = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .populate("genres")
    .select("-comments -ratings")
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 404;
        error.message = "Book with this id does not exist.";
      }
      next(error);
    });
};

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.bookId;

  Comment.deleteMany({ book: bookId })
    .then(() => {
      return Book.findByIdAndDelete(bookId);
    })
    .then((deletedBook) => {
      if (!deletedBook) {
        return res
          .status(404)
          .json({ error: "Book with this id does not exist" });
      }
      fs.unlink(deletedBook.imageUrl, (err) => {
        if (err) {
          console.log("Error deleting book image:", err);
        }
      });
      res.send({ message: "Book successfully deleted." });
    })
    .catch((error) => {
      next(error);
    });
};

exports.searchBooksByTitle = (req, res, next) => {
  const searchTerm = req.query.title;
  if (!searchTerm) {
    return res.json([]);
  }
  Book.find({
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { origTitle: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .populate(["genres"])
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      next(error);
    });
};
