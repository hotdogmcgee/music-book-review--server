const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Books Endpoints", function() {
  let db;

  const { testUsers, testBooks, testAuthors, testReviews, testBooksAuthors } = helpers.makeBooksFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET /api/books", () => {
    context("Given no books in db", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/books")
          .expect(200, []);
      });
    });

    context("Given books DO exist in db", () => {
      beforeEach("insert books", () =>
        helpers.seedBooksTables(db, testUsers, testBooks, testAuthors, testReviews, testBooksAuthors)
      );

      //error with user.date_modified and bk.year_published
      it("responds with 200 and all the books", () => {
        const expectedBooks = testBooks.map(book =>
          helpers.makeExpectedBook(book, testUsers, testAuthors, testReviews, testBooksAuthors)
        );

        return supertest(app)
          .get("/api/books")
          .expect(200, expectedBooks);
      });
    });

    
    context("Given an XSS attack book", () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousBook, expectedBook } = helpers.makeMaliciousBook(
        testUser
      );
      beforeEach("insert malicious book", () => {
        return helpers.seedMaliciousBook(db, testUser, maliciousBook)

      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get("/api/books")
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedBook.title);
            expect(res.body[0].description).to.eql(expectedBook.description);
          });
      });
    });
  });

  describe("GET /api/books/:book_id", () => {
    context("Given NO books in db", () => {
      beforeEach(() => {
        helpers.seedUsers(db, testUsers);
      });

      //add auth
      it("responds with 404", () => {
        const bookId = 12343243;
        return supertest(app)
          .get(`/api/books/${bookId}`)
          .expect(404, { error: { message: "Book does not exist" } });
      });
    });

    context("Given books DO EXIST in db", () => {
      beforeEach("insert books", () =>
        helpers.seedBooksTables(db, testUsers, testBooks)
      );

      it("responds with 200 and the specified book", () => {
        const bookId = 1;
        const expectedBook = helpers.makeExpectedBook(
          testBooks[bookId - 1],
          testUsers

        );

        //add auth
        return supertest(app)
          .get(`/api/books/${bookId}`)
          .expect(200, expectedBook);
      });
    });
  });

  describe("DELETE /api/books/:book_id", () => {
    context("Given books DO exist in db", () => {
      beforeEach("insert books", () =>
        helpers.seedBooksTables(db, testUsers, testBooks)
      );

      it("responds with 204 and removes the book", () => {
        const idToRemove = 2;
        const expectedBooks = testBooks.map(book =>
          helpers.makeExpectedBook(book, testUsers)
        );
        const oneLessBook = expectedBooks.filter(book => book.id !== idToRemove);
        return supertest(app)
          .delete(`/api/books/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get("/api/books")
              .expect(oneLessBook)
          );
      });
    });

    context("Given books DO NOT exist in db", () => {
      it("responds with 404", () => {
        const bookId = 12321321;
        return supertest(app)
          .delete(`/api/books/${bookId}`)
          .expect(404, { error: { message: "Book does not exist" } });
      });
    });
  });

  describe(`PATCH /api/books/:book_id`, () => {
    context("given books DO exist in db", () => {
      beforeEach("insert books", () =>
      helpers.seedBooksTables(db, testUsers, testBooks, testAuthors, testReviews, testBooksAuthors)
      );

      it("responds with 204 and updates the book", () => {
        const idToUpdate = 2;
        const updateBook = {
          title: "updated title",
          description: "updated info",
          isbn: "new isbn"
        };
        const bookData = {
          ...testBooks[idToUpdate - 1],
          ...updateBook
        };

        const expectedBook = helpers.makeExpectedBook(bookData, testUsers, testAuthors, testReviews, testBooksAuthors);

        return supertest(app)
          .patch(`/api/books/${idToUpdate}`)
          .send(updateBook)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/books/${idToUpdate}`)
              .expect(expectedBook)
          );
      });

      it("repsonds with 400 when no required fields supplied", () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/books/${idToUpdate}`)
          .send({ irrelevantField: "should not work" })
          .expect(400, {
            error: {
              message: "Request body must contain either 'title', 'description', 'isbn', 'year_published', or 'instrument'"
            }
          });
      });

      it("responds with 204 when updating only a subset of fields", () => {
        const idToUpdate = 2;
        const updateBook = {
          title: "brand new title"
        };

        const bookData = {
          ...testBooks[idToUpdate - 1],
          ...updateBook
        };

        const expectedBook = helpers.makeExpectedBook(bookData, testUsers, testAuthors, testReviews, testBooksAuthors);

        return supertest(app)
          .patch(`/api/books/${idToUpdate}`)
          .send({ ...updateBook, fieldToIgnore: "should not be in response" })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/books/${idToUpdate}`)
              .expect(expectedBook)
          );
      });
    });

    context("given books DO NOT exist in db", () => {
      it("responds with 404", () => {
        const bookId = 123213123;
        return supertest(app)
          .patch(`/api/books/${bookId}`)
          .expect(404, { error: { message: "Book does not exist" } });
      });
    });
  });
});
