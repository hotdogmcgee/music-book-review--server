const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const xss = require("xss");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: "Test user 1",
      email: "koob@books.com",
      password: "passworasdsadd",
      date_modified: null,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: "Test user 2",
      email: "notwoody@notwood.com",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "Test user 3",
      email: "maybe@maybe.com",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    },
    {
      id: 4,
      user_name: "test-user-4",
      full_name: "Test user 4",
      email: "steve@evets.com",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null
    }
  ];
}

function makeBooksArray(users) {
  return [
    {
      id: 1,
      title: "FJH 1",
      information: "for guitar beginners, a great resource!",
      instrument: "guitar",
      isbn: "isbn1",
      year_published: 2000,
      user_id: users[0].id,

      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      title: "The Art of Violin",
      information:
        "literally every violin player has used this for 10,000 years",
      isbn: "isbn2",
      instrument: "violin",
      year_published: 882,
      user_id: users[1].id,

      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      title: "guitar book",
      information: "who cares about this description",
      isbn: "isbn3",
      instrument: "guitar",
      year_published: 1990,
      user_id: users[2].id,

      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      title: "Music for Millions",
      information: "a great piano book for beginners",
      isbn: "isbn4",
      instrument: "piano",
      year_published: 1950,
      user_id: users[3].id,

      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

function makeReviewsArray(users, books) {
  return [
    {
      id: 1,
      book_id: books[0].id,
      user_id: users[0].id,
      review_text: "wow so great",
      rating: 5,
      date_created: "2020-01-07T17:21:38.734Z"
    },
    {
      id: 2,
      book_id: books[0].id,
      user_id: users[0].id,
      review_text: "i did not like this",
      rating: 2,
      date_created: "2020-01-07T17:21:38.734Z"
    },
    {
      id: 3,
      book_id: books[1].id,
      user_id: users[1].id,
      review_text: "how do you play this instrument????",
      rating: 1,
      date_created: "2020-01-07T17:21:38.734Z"
    },
    {
      id: 4,
      book_id: books[2].id,
      user_id: users[2].id,
      review_text: "oh wait i see",
      rating: 5,
      date_created: "2020-01-07T17:21:38.734Z"
    },
    {
      id: 5,
      book_id: books[2].id,
      user_id: users[1].id,
      review_text: "i love the piano so much, thank you Bastian!",
      rating: 5,
      date_created: "2020-01-07T17:21:38.734Z"
    }
  ];
}

function makeExpectedBook(users, book) {
  const user = users.find(user => user.id === book.user_id);


  return {
    id: book.id,
    // user_id: book.user_id,
    user_id: user.id,
    title: book.title,
    information: book.information,
    instrument: book.instrument,
    isbn: book.isbn,
    year_published: book.year_published,
    date_created: book.date_created,
    user: {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      full_name: user.full_name,
      date_created: user.date_created
      // date_modified: user.date_modified || null
    }
  };
}

// function makeExpectedReview(users, review) {
//   const book = books.find(book => book.id === review.book_id)

//   return {
//     id: review.id,
//     book_id: review.book_id,
//     user_id: review.user_id,
//     review_text: review.review_text,
//     rating: review.rating,
//     date_created: review.date_created
//   }
// }

function makeExpectedReview(review) {
  // const user = users.find(user => user.id === review.user_id);

  return {
    id: review.id,
    book_id: review.book_id,
    user_id: review.user_id,
    review_text: review.review_text,
    rating: review.rating,
    date_created: review.date_created
  };
}

function makeMaliciousBook(user) {
  const maliciousBook = {
    id: 911,
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    information: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    instrument: "viola",
    isbn: "isbnisbn",
    year_published: 2000,
    user_id: user.id
  };
  const expectedBook = {
    ...makeExpectedBook([user], maliciousBook),
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    information: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousBook,
    expectedBook
  };
}

function makeMaliciousReview(user, book) {
  const maliciousReview = {
    id: 911,
    book_id: book.id,
    user_id: user.id,
    rating: 4,
    review_text: 'Naughty naughty REVIEW very naughty <script>alert("xss");</script>',
    date_created: new Date().toISOString()
  };

  const expectedReview = {
    ...makeExpectedReview([user], maliciousReview),
    review_text:
      'Naughty naughty REVIEW very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  };


  return {
    maliciousReview,
    expectedReview
  };
}

function makeBooksFixtures() {
  const testUsers = makeUsersArray();
  const testBooks = makeBooksArray(testUsers);
  const testReviews = makeReviewsArray(testUsers, testBooks);

  return { testUsers, testBooks, testReviews };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
          books,
          users,
          reviews
          RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedBooksTables(db, users, books, reviews) {
  return db
    .into("users")
    .insert(users)
    .then(() => db.into("books").insert(books))
    .then(() => makeReviewsArray.length && db.into("reviews").insert(reviews))
}

function seedMaliciousBook(db, user, book) {
  return db
    .into("users")
    .insert([user])
    .then(() => db.into("books").insert([book]));
}

function seedMaliciousReview(db, user, book, review) {
  return db
    .into("users")
    .insert([user])
    .then(() => db.into("books").insert([book]))
    .then(() => db.into("reviews").insert([review]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });

  return `Bearer ${token}`;
}

module.exports = {
  makeAuthHeader,
  makeUsersArray,
  makeBooksArray,
  makeReviewsArray,
  makeBooksFixtures,
  makeExpectedBook,
  makeExpectedReview,
  makeMaliciousBook,
  makeMaliciousReview,

  cleanTables,
  seedBooksTables,
  seedUsers,
  seedMaliciousBook,
  seedMaliciousReview
};
