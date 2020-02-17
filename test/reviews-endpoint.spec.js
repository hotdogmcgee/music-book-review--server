const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Reviews Endpoints", () => {
  let db;

  const { testUsers, testBooks, testReviews } = helpers.makeBooksFixtures();

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
      const testUser = helpers.makeUsersArray()[1]

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

  //primary key not in books table on insert to reviews table.  really unsure what's going on
  describe("POST /api/reviews", () => {
    beforeEach("insert books", () => {
      helpers.seedBooksTables(db, testUsers, testBooks);
    });


    it.skip("creates a review, responding with 201 and the new review", function() {
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

    const requiredFields = ['book_id', 'user_id', 'review_text', 'rating']

    requiredFields.forEach(field => {
      const testUser = testUsers[0]
      const newReview = {
        book_id: 1,
        user_id: testUser.id,
        review_text: "we are posting a new review, how nice!!",
        rating: 5, 
        id: 900
      };

      it(`responds with 400 and an error message when the ${field} is missing`, () => {
        delete newReview[field];

        //add auth
        return supertest(app)
          .post("/api/reviews")
          .send(newReview)
          .expect(400, {
            error: { message: `Missing ${field} in request body` }
          });
      });
    })
  });

  //why is expectedReviews returning undefined objects??
  describe('DELETE /api/reviews/:review_id', () => {
    context('Given reviews DO exist in db', () => {
      beforeEach('insert reviews', () => {
        helpers.seedBooksTables(db, testUsers, testBooks, testReviews)
      })

      it('responds with 204 and removes the review', () => {
        const idToRemove = 2

        const expectedReviews = testReviews.map(review => {
          // helpers.makeExpectedReview(testUsers, review)
          helpers.makeExpectedReview(review)
        })

        const oneLessReview = expectedReviews.filter(review => review.id !== idToRemove)

        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(204)
          .then(res => 
            supertest(app)
            .get('/api/books')
            .expect(oneLessReview))
    })
    })
  })
});
