const xss = require("xss");

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
        "rv.date_created"
      );
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

  serializeReview(rv) {
      return {
        id: rv.id,
        user_id: rv.user_id,
        book_id: rv.book_id,
        rating: rv.rating,
        review_text: rv.review_text,
        date_created: rv.date_created
      }
  }
};

module.exports = ReviewsService
