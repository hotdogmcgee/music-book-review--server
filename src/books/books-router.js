const path = require("path");
const express = require("express");
const BooksService = require("./books-service");
const logger = require("../logger");

const booksRouter = express.Router();
const jsonBodyParser = express.json();

booksRouter.route("/").get((req, res, next) => {
  BooksService.getAllBooks(req.app.get("db"))
    .then(books => {
      res.json(BooksService.serializeBooks(books, req));
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
  })

  //use logger for changes
  .patch(jsonBodyParser, (req, res, next) => {
    const {
      title,
      description,
      instrument,
      isbn,
      year_published
      // user_id
      // author
    } = req.body;
    const bookToUpdate = {
      title,
      description,
      instrument,
      isbn,
      year_published
      // user_id
      // author
    };

    const numberOfValues = Object.values(bookToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'description', 'isbn', 'year published', or 'instrument'`
        }
      });
    }

    BooksService.updateBook(req.app.get("db"), req.params.book_id, bookToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

//need book reviews route
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

//change user_id to req.user_id
booksRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const {
    title,
    description,
    instrument,
    isbn,
    year_published,

    user_id
    // author
  } = req.body;
  const newBook = {
    title,
    description,
    instrument,
    isbn,
    year_published,

    user_id
    // author
  };

  for (const [key, value] of Object.entries(newBook)) {
    if (value == null) {
      logger.error(`${key} is required.`);
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
  logger.info(`Book with title ${title} created by user_id ${user_id}.`);
});

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
