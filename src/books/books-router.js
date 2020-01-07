const path = require("path");
const express = require("express");
const BooksService = require("./books-service");

const booksRouter = express.Router();
const jsonBodyParser = express.json();

booksRouter.route("/").get((req, res, next) => {
  BooksService.getAllBooks(req.app.get("db"))
    .then(books => {
      res.json(BooksService.serializeBooks(books));
    })
    .catch(next);
});

booksRouter.route('/:book_id')
.all(checkBookExists)
.get((req, res) => {
  res.json(BooksService.serializeBook(res.book))
})

//need book reviews route

booksRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const {
    title,
    information,
    instrument,
    isbn,
    year_published,
    user_id,
    // author
  } = req.body;
  const newBook = {
    title,
    information,
    instrument,
    isbn,
    year_published,
    user_id,
    // author
  };

  for (const [key, value] of Object.entries(newBook)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing ${key} in request body` }
      });
    }
  }

  BooksService.insertBook(req.app.get("db"), newBook)
    .then(book => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl + `/${book.id}`))
        .json(BooksService.serializeBook(book));
    })
    .catch(next);
});

async function checkBookExists(req, res, next) {
  try {
    const book = await BooksService.getById(
      req.app.get('db'),
      req.params.book_id
    )

    if (!book)
      return res.status(404).json({
        error: `Book doesn't exist`
      })

    res.book = book
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = booksRouter;
