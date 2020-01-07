const xss = require("xss");
const Treeize = require("treeize");

const BooksService = {
  getAllBooks(db) {
    return (
      db
        .from("books AS bk")
        .select(
          "bk.id",
          "bk.title",
          "bk.information",
          "bk.isbn",
          "bk.instrument",
          "bk.year_published",
          // 'authors.first_name',
          // 'authors.last_name',
          ...userFields
        //   ...authorsArr
        )
        // .leftJoin(
        //     'authors AS auth',
        //     'bk.author_id',
        //     'auth.id'

        // )
        // .leftJoin("books_authors", "bk.id", '=', "books_authors.book_id")
        // .leftJoin('authors', 'authors.id', '=', 'books_authors.author_id')
        // .leftJoin(
        //     'reviews AS rv',
        //     'rv.book_id',
        //     'bk.id'
        // )
        .leftJoin("users AS usr", "bk.user_id", "usr.id")
    );
  },

  getById(db, id) {
    return BooksService.getAllBooks(db)
    .where('bk.id', id)
    .first()
  },

  insertBook(knex, newBook) {
    return knex
    .insert(newBook)
    .into('books')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },

  serializeBooks(books) {

    return books.map(this.serializeBook);
  },

  serializeBook(book) {
    const bookTree = new Treeize();

    const bookData = bookTree.grow([book]).getData()[0];



    return {
      id: bookData.id,
      title: xss(bookData.title),
      information: xss(bookData.information),
      instrument: xss(bookData.instrument),
      isbn: xss(bookData.isbn),
      year_published: bookData.year_published,
      user: bookData.user || {},
    //   authors: bookData.authors || [],
      name: bookData.books_authors
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
