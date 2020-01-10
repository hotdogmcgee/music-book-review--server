const path = require("path");
const express = require("express");
// const xss = require('xss')
const ReviewsService = require("./reviews-service");

const reviewsRouter = express.Router();
const jsonBodyParser = express.json();

reviewsRouter.route("/").get((req, res, next) => {
  const { user_id, sort } = req.query;

  if (sort) {
    if (!["rating", "book_id"].includes(sort)) {
      return res.status(400).send("Sort must be rating or book_id");
    }
  }

  ReviewsService.getAllReviews(req.app.get("db"))
    .then(reviews => {
      let results = reviews;
      if (user_id) {
        results = reviews.filter(rv => rv.user_id == user_id);
      }

      if (sort) {
        results.sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }

      res.json(ReviewsService.serializeReviews(results));
    })
    .catch(next);
});

//PUT AUTH IN post()
reviewsRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const { user_id, book_id, rating, review_text } = req.body;
  const newReview = { user_id, book_id, rating, review_text };

  for (const [key, value] of Object.entries(newReview))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });

  //put this in once auth is wired up, then delete user_id from newReview above
  // newReview.user_id = req.user_id

  ReviewsService.insertReview(req.app.get('db'), newReview)
  .then(review => {
      res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${review.id}`))
      .json(ReviewsService.serializeReview(review))

  })
  .catch(next)

});

//put auth in
reviewsRouter
    .route('/:review_id')
    .all(checkReviewExists)
    .get((req, res) => {
        res.json(ReviewsService.serializeReview(res.review))
    })
    .delete((req, res, next) => {
        ReviewsService.deleteReview(req.app.get('db'), req.params.review_id)
        .then(() => {
            res.status(200).json(`Review with id ${req.params.review_id} deleted.`)
        })
        .catch(next)
    })


async function checkReviewExists(req, res, next) {
    try {
      const review = await ReviewsService.getById(
        req.app.get("db"),
        req.params.review_id
      );
  
      if (!review)
        return res.status(404).json({
          error: { message: `Review does not exist` }
        });
  
      res.review = review;
      next();
    } catch (error) {
      next(error);
    }
  }

module.exports = reviewsRouter;
