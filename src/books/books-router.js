const express = require("express");
const BooksService = require("./books-service");
// const logger = require("../logger");
// const path = require("path");

const booksRouter = express.Router();

booksRouter.route("/").get((req, res, next) => {
  BooksService.getAllBooks(req.app.get("db"))
    .then(books => {
      res.json(BooksService.serializeBooks(books));
    })
    .catch(next);
});

booksRouter
  .route("/:book_id")
  .all(checkBookExists)
  .get((req, res) => {
    res.json(BooksService.serializeBook(res.book));
  })
  .delete((req, res, next) => {
    BooksService.deleteBook(req.app.get("db"), req.params.book_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

booksRouter
  .route("/:book_id/reviews")
  .all(checkBookExists)
  .get((req, res, next) => {
    BooksService.getReviewsForBook(req.app.get("db"), req.params.book_id)
      .then(reviews => {
        res.json(reviews.map(BooksService.serializeBookReview));
      })
      .catch(next);
  });

booksRouter
  .route("/:book_id/authors")
  .all(checkBookExists)
  .get((req, res, next) => {
    BooksService.getAuthorsForBook(req.app.get("db"), req.params.book_id)
      .then(authors => {
        res.json(authors.map(BooksService.serializeAuthor));
      })
      .catch(next);
  });

//POST route to be added in later

async function checkBookExists(req, res, next) {
  try {
    const book = await BooksService.getById(
      req.app.get("db"),
      req.params.book_id
    );

    if (!book)
      return res.status(404).json({
        error: { message: `Book does not exist` }
      });

    res.book = book;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = booksRouter;
