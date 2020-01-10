const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Reviews Endpoints", () => {
  let db;

  const { testUsers, testBooks, testReviews } = helpers.makeBooksFixtures();

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
        helpers.seedBooksTables(db, testUsers, testBooks, testReviews)
      );

      it("responds with 200 and all the reviews", () => {
        const expectedReviews = testReviews.map(review =>
          helpers.makeExpectedReview(testBooks, review)
        );

        return supertest(app)
          .get("/api/reviews")
          .expect(200, expectedReviews);
      });
    });

    context("Given an XSS attack review", () => {
      const testUsers = helpers.makeUsersArray();
      const testUser = testUsers[1];
      const testBook = helpers.makeBooksArray(testUsers)[1];

      const { maliciousReview, expectedReview } = helpers.makeMaliciousReview(
        testUser,
        testBook
      );

      beforeEach("insert malicious review", () => {
        return helpers.seedMaliciousReview(
          db,
          testUser,
          testBook,
          maliciousReview
        );
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get("/api/reviews")
          .expect(200)
          .expect(res => {
            expect(res.body[0].review_text).to.eql(expectedReview.review_text);
          });
      });
    });
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
        rating: 5
      };

      //add auth
      return supertest(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.user_id).to.eql(testUser.id);
          expect(res.body.book_id).to.eql(testBook.id);
          expect(res.body.review_text).to.eql(newReview.review_text);
          expect(res.body.rating).to.eql(newReview.rating);
        });

      //add in further test for db
    });
  });
});
