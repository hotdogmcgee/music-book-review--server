const xss = require("xss");
const Treeize = require('treeize')

const ReviewsService = {
  getAllReviews(db) {
    return db
      .from("reviews AS rv")
      .join("books AS bk", "bk.id", "rv.book_id")
      .select(
        "rv.id",
        "rv.book_id",
        "rv.user_id",
        "rv.review_text",
        "rv.rating",
        "rv.date_created",
        ...userFields
      )
      .leftJoin("users AS usr", "bk.user_id", "usr.id")
      .groupBy("bk.id", "usr.id")
  },

  getById(db, id) {
    return ReviewsService.getAllReviews(db)
    .where('rv.id', id)
    .first()
  },

  insertReview(db, newReview) {

      return db
        .insert(newReview)
        .into('reviews')
        .returning('*')
        .then(([rv]) => rv)
        .then(rv => 
            ReviewsService.getById(db, rv.id))
  },

  deleteReview(knex, id) {
    return knex
    .from('reviews')
    .where({ id })
    .delete()
  },

  serializeReviews(rvs) {
      return rvs.map(this.serializeReview)
  },

  //get rid of treeize if not using user data
  serializeReview(rv) {

    const reviewTree = new Treeize()

    const reviewData = reviewTree.grow([rv]).getData()[0]
      return {
        id: reviewData.id,
        user: reviewData.user || {},
        book_id: reviewData.book_id,
        rating: reviewData.rating,
        review_text: xss(reviewData.review_text),
        date_created: reviewData.date_created
      }


  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name",
  "usr.email AS user:email",
  "usr.date_created AS user:date_created",
  "usr.date_modified AS user:date_modified"
];

module.exports = ReviewsService
