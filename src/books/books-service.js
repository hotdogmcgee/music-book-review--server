const xss = require("xss");
const Treeize = require("treeize");

//put reviews in res obj or separate?
//figure out data later
const BooksService = {
  getAllBooks(db) {
    return (
      // db.raw('a.first_name, a.last_name, b.id FROM books b LEFT JOIN books_authors ba ON b.id = ba.book_id LEFT JOIN authors a ON ba.author_id = a.id;'),
      // db.raw(`
      // SELECT b.id, b.title, b.information, b.isbn, b.instrument, b.year_published, b.date_created,
      // STRING_AGG ( distinct a.first_name || ' ' || a.last_name, ',') author_names,
      // AVG(rv.rating) avg_rating,
      // count(distinct rv) as num_reviews
      // FROM books b
      // LEFT JOIN books_authors ba
      // ON b.id = ba.book_id
      // LEFT JOIN authors a
      // ON ba.author_id = a.id
      // LEFT JOIN reviews rv
      // ON b.id = rv.book_id
      // GROUP BY b.id;

      // `)
      db
        .from("books AS bk")
        .select(
          "bk.id",
          "bk.title",
          "bk.information",
          "bk.isbn",
          "bk.instrument",
          "bk.year_published",
          "bk.date_created",
          ...userFields,
          db.raw("count(DISTINCT rv) AS num_reviews"),
          db.raw(`AVG(rv.rating) avg_rating`),
          db.raw(
            `STRING_AGG ( distinct a.first_name || ' ' || a.last_name, ',') author_names`
          )
          
        )
        .leftJoin("books_authors AS ba", "bk.id", "ba.book_id")
        .leftJoin("authors AS a", "ba.author_id", "a.id")
        .leftJoin("reviews AS rv", "bk.id", "rv.book_id")
        .leftJoin("users AS usr", "bk.user_id", "usr.id")
        .groupBy("bk.id", "usr.id")
    );
  },

  getById(db, id) {
    return BooksService.getAllBooks(db)
      .where("bk.id", id)
      .first();
  },

  insertBook(db, newBook) {
    return db
      .insert(newBook)
      .into("books")
      .returning("*")
      .then(([bk]) => bk)
      .then(bk => BooksService.getById(db, bk.id));
    // .then(rows => {
    //   return rows[0]
    // })
  },

  //add full user info
  getReviewsForBook(db, book_id) {
    return db
      .from("reviews AS rv")
      .select(
        "rv.id",
        "rv.book_id",
        "rv.user_id",
        "rv.review_text",
        "rv.rating",
        "rv.date_created",
        ...userFields
      )
      .leftJoin("users AS usr", "rv.user_id", "usr.id")
      .where("rv.book_id", book_id);
    // .groupBy("rv.id", "rv.user_id");
  },

  //why can't I grab a.id?
  getAuthorsForBook(db, book_id) {
    return db
      .from("books AS bk")
      .select("bk.id", "ba.author_id", "a.first_name", "a.last_name")
      .leftJoin("books_authors AS ba", "bk.id", "ba.book_id")
      .leftJoin("authors AS a", "ba.author_id", "a.id")
      .where("ba.book_id", book_id);
  },

  //do I need to delete comments from here?
  deleteBook(knex, id) {
    return knex
      .from("books")
      .where({ id })
      .delete();
  },

  updateBook(knex, id, newBookFields) {
    return knex
      .from("books")
      .where({ id })
      .update(newBookFields);
  },

  serializeBooks(books) {

    return books.map(this.serializeBook);
  },

  serializeBook(book) {
    const bookTree = new Treeize();
    const bookData = bookTree.grow([book]).getData()[0];

    authorsArr = book.author_names.split(',')

    const finalAuthors = authorsArr.map(author => {
      const arr = author.split(' ')
      return {
        first_name: arr[0],
        last_name: arr[1]
      }
    })
    


    return {
      id: bookData.id,
      title: xss(bookData.title),
      information: xss(bookData.information),
      instrument: xss(bookData.instrument),
      isbn: xss(bookData.isbn),
      year_published: bookData.year_published,
      date_created: bookData.date_created,
      num_reviews: Number(bookData.num_reviews) || 0,
      avg_rating: Number(bookData.avg_rating) || null,
      user: bookData.user || {},
      user_id: bookData.user.id,
        authors: finalAuthors || [],
    };
  },

  //add in full user fields
  serializeBookReview(rv) {
    const reviewTree = new Treeize();

    const reviewData = reviewTree.grow([rv]).getData()[0];
    return {
      id: reviewData.id,
      user_id: reviewData.user_id,
      user: reviewData.user || {},
      book_id: reviewData.book_id,
      rating: reviewData.rating,
      review_text: reviewData.review_text,
      date_created: reviewData.date_created
    };
  },

  serializeAuthor(author) {
    return {
      book_id: author.id,
      first_name: author.first_name,
      last_name: author.last_name
    };
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

// function makeAuthorsArr(authors) {
//     let obj = {}
//     authors.map(author => {
//         return {
//             id: author.id,
//             first_name: author.first_name,
//             last_name: author.last_name
//         }
//     })

//     const finalArr = authors
//     console.log(finalArr);

//     return finalArr
// }
//   const authorsArr = makeAuthorsArr()

module.exports = BooksService;
