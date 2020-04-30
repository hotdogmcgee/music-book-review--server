const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Reviews Endpoints", () => {
  let db;

  const {
    testUsers,
    testBooks,
    testAuthors,
    testReviews,
    testBooksAuthors
  } = helpers.makeBooksFixtures();

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

  describe("GET /api/reviews", () => {
    context("Given no reviews in db", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/reviews")
          .expect(200, []);
      });
    });

    context("Given reviews DO EXIST in db", () => {
      beforeEach("insert reviews", () =>
      helpers.seedBooksTables(
        db,
        testUsers,
        testBooks,
        testAuthors,
        testReviews,
        testBooksAuthors
      )
      );

      it("responds with 200 and all the reviews", () => {

        const expectedReviews = testReviews.map(review =>
          helpers.makeExpectedReview(review, testUsers)
        );

        return supertest(app)
          .get("/api/reviews")
          .expect(200, expectedReviews);
      });
    });

  //   context("Given an XSS attack review", () => {
  //     const testUser = testUsers[1]

  //     const testBook = testBooks[1]

  //     const { maliciousReview, expectedReview } = helpers.makeMaliciousReview(
  //       testUser,
  //       testBook
  //     );

  //     beforeEach("insert malicious review", () => {
  //       return helpers.seedMaliciousReview(
  //         db,
  //         testUser,
  //         testBook,
  //         maliciousReview
  //       );
  //     });

  //     it("removes XSS attack content", () => {
  //       return supertest(app)
  //         .get("/api/reviews")
  //         .expect(200)
  //         .expect(res => {
  //           expect(res.body[0].review_text).to.eql(expectedReview.review_text);
  //         });
  //     });
  //   });
  });

  describe("POST /api/reviews", () => {
    beforeEach("insert books", () => {
      helpers.seedBooksTables(db, testUsers, testBooks);
    });

    it("creates a review, responding with 201 and the new review", function() {
      this.retries(3);

      const testUser = testUsers[0];
      const testBook = testBooks[0];

      const newReview = {
        book_id: testBook.id,
        user_id: testUser.id,
        review_text: "we are posting a new review, how nice!!",
        rating: 5,
        id: 900
      };

      return supertest(app)
        .post("/api/reviews")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newReview)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.user.id).to.eql(testUser.id);
          expect(res.body.book_id).to.eql(testBook.id);
          expect(res.body.review_text).to.eql(newReview.review_text);
          expect(res.body.rating).to.eql(newReview.rating);
        })
        .expect(res =>
          db
            .from("reviews")
            .select("*")
            .where({ id: res.body.id })
            .then(row => {
              expect(row[0].user_id).to.eql(testUser.id);
              expect(row[0].book_id).to.eql(testBook.id);
              expect(row[0].rating).to.eql(newReview.rating);
              expect(row[0].review_text).to.eql(newReview.review_text);
            })
        );
    });

    const requiredFields = ["book_id", "user_id", "review_text", "rating"];

    requiredFields.forEach(field => {
      const testBook = testBooks[0];
      const testUser = testUsers[0];
      const newReview = {
        book_id: testBook.id,
        user_id: testUser.id,
        review_text: "we are posting a new review, how nice!!",
        rating: 5,
        id: 900
      };

      it.skip(`responds with 400 and an error message when the ${field} is missing`, () => {
        delete newReview[field];

        //why are some tests passing auth while others are not?
        return supertest(app)
          .post("/api/reviews")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(newReview)
          .expect(400, {
            error: { message: `Missing ${field} in request body` }
          });
      });
    });
  });

  // why is expectedReviews returning undefined objects??
  describe("DELETE /api/reviews/:review_id", () => {
    context("Given reviews DO exist in db", () => {
      beforeEach("insert reviews", () => {
        helpers.seedBooksTables(
          db,
          testUsers,
          testBooks,
          testAuthors,
          testReviews,
          testBooksAuthors
        );
      });

      it.skip("responds with 204 and removes the review", () => {
        const idToRemove = 2;

        let expectedReviews = testReviews.map(review => {
          helpers.makeExpectedReview(review, testUsers);
        });

        const oneLessReview = expectedReviews.filter(
          review => review.id !== idToRemove
        );


        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get("/api/books")
              .expect(oneLessReview)
          );
      });
    });
  });
});
