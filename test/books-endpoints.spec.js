const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

//why is my date_modified not being passed correctly when creating books?

describe.only("Books Endpoints", function() {
  let db;

  const { testUsers, testBooks } = helpers.makeBooksFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
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
        helpers.seedBooksTables(db, testUsers, testBooks)
      );

      //error with user.date_modified and bk.year_published
      it("responds with 200 and all the books", () => {
        const expectedBooks = testBooks.map(book =>
          helpers.makeExpectedBook(testUsers, book)
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
        return helpers.seedMaliciousBook(db, testUser, maliciousBook);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get("/api/books")
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedBook.title);
            expect(res.body[0].information).to.eql(expectedBook.information);
          });
      });
    });
  });

  describe.skip("POST /api/books", () => {
    beforeEach("insert books", () => {
      helpers.seedBooksTables(db, testUsers, testBooks);
    });

    it("creates a book, responding with 201 and the new book", function() {
      this.retries(3);

      const testUser = testUsers[0];
      const newBook = {
        information: "look at this info!",
        title: "post test book",
        instrument: "viola",
        isbn: "test isbn",
        year_published: 1990,
        user_id: testUser.id,
        id: 900
      };

      //make auth
      return supertest(app)
        .post("/api/books")
        .send(newBook)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.user_id).to.eql(testUser.id);
          expect(res.body.information).to.eql(newBook.information);
          expect(res.body.title).to.eql(newBook.title);
          expect(res.body.instrument).to.eql(newBook.instrument);
          expect(res.body.isbn).to.eql(newBook.isbn);
          expect(res.body.year_published).to.eql(newBook.year_published);
        });
      // .expect(res =>
      //     db
      //     .from('books')
      //     .select('*')
      //     .where({ id: res.body.id })
      //     .first()
      //     .then(row => {
      //         expect(row.user_id).to.eql(testUser.id)
      //         expect(row.title).to.eql(newBook.title)
      //         expect(row.information).to.eql(newBook.information)
      //         expect(row.instrument).to.eql(newBook.instrument)
      //         expect(row.isbn).to.eql(newBook.isbn)
      //         expect(row.year_published).to.eql(newBook.year_published)
      //         const expectedDate = new Date().toLocaleString("en", {
      //             timeZone: "UTC"
      //           });
      //           const actualDate = new Date(row.date_created).toLocaleString();
      //           expect(actualDate).to.eql(expectedDate);
      //     })
      //     )
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
          helpers.makeExpectedBook(testUsers, book)
        );
        const oneLess = expectedBooks.filter(book => book.id !== idToRemove);
        return supertest(app)
          .delete(`/api/books/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get("/api/books")
              .expect(oneLess)
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
        helpers.seedBooksTables(db, testUsers, testBooks)
      );

      it("responds with 204 and updates the book", () => {
        const idToUpdate = 2;
        const updateBook = {
          title: "updated title",
          information: "updated info",
          isbn: "new isbn"
        };
        const expectedBook = {
          ...testBooks[idToUpdate - 1],
          ...updateBook
        };
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

      it('repsonds with 400 when no required fields supplied', () => {
        const idToUpdate = 2
        return supertest(app)
        .patch(`/api/books/${idToUpdate}`)
        .send({irrelevanField: 'should not work'})
        .expect(400, {
          error: {
            message: `Request body must contain either 'title', 'information', 'isbn', 'year published', or 'instrument'`
          }
        })
      })

      it('responds with 204 when updating only a subset of fields', () => {
        const idToUpdate = 2
        const updateBook = {
          title: 'brand new title'
        }

        const expectedBook = {
          ...testBooks[idToUpdate - 1],
          ...updateBook
        }

        return supertest(app)
          .patch(`/api/books/${idToUpdate}`)
          .send({...updateBook, fieldToIgnore: 'should not be in response'})
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/books/${idToUpdate}`)
              .expect(expectedBook)
          );
        
      })
    });

    context('given books DO NOT exist in db', () => {
      it('responds with 404', () => {
        const bookId = 123213123
        return supertest(app)
        .patch(`/api/books/${bookId}`)
        .expect(404, {error: { message: 'Book does not exist'}})
      })
    })
  });
});
