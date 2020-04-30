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
      description: "for guitar beginners, a great resource!",
      instrument: "guitar",
      isbn: "isbn1",
      year_published: 2000,
      publisher: null,
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      title: "The Art of Violin",
      description:
        "literally every violin player has used this for 10,000 years",
      isbn: "isbn2",
      instrument: "violin",
      year_published: 882,
      publisher: null,
      user_id: users[1].id,

      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      title: "guitar book",
      description: "who cares about this description",
      isbn: "isbn3",
      instrument: "guitar",
      year_published: 1990,
      publisher: "Guitar Mania",
      user_id: users[2].id,

      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      title: "Music for Millions",
      description: "a great piano book for beginners",
      isbn: "isbn4",
      instrument: "piano",
      publisher: "The House of Piano",
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

function makeAuthorsArray() {
  return [
    {
      id: 1,
      first_name: "James",
      last_name: "Joyce"
    },
    {
      id: 2,
      first_name: "Bastian",
      last_name: "Cool"
    },
    {
      id: 3,
      first_name: "Eric",
      last_name: "TheRed"
    },
    {
      id: 4,
      first_name: "Sandra",
      last_name: "Queen"
    },
    {
      id: 5,
      first_name: "bobby",
      last_name: "guitarplayer"
    }
  ];
}

function makeBooksAuthorsArray(books, authors) {

  return [
    {
      id: 1,
      book_id: books[0].id,
      author_id: authors[0].id
    },
    {
      id: 2,
      book_id: books[0].id,
      author_id: authors[2].id
    },
    {
      id: 3,
      book_id: books[1].id,
      author_id: authors[1].id
    },
    {
      id: 4,
      book_id: books[2].id,
      author_id: authors[1].id
    },
    {
      id: 5,
      book_id: books[2].id,
      author_id: authors[3].id
    },
    {
      id: 6,
      book_id: books[3].id,
      author_id: authors[1].id
    }
  ];
}

function makeExpectedBook(book, users, authors, reviews, booksAuthors) {
  const user = users.find(user => user.id === book.user_id);
  const reviewsForBook = reviews
    ? reviews.filter(review => review.book_id === book.id)
    : [];

  const reviewRatings = reviewsForBook.map(review => {
    return review.rating;
  });
  const numReviews = reviewRatings.length;
  const avgRating = numReviews ? reviewRatings.reduce((a, b) => a + b, 0) / numReviews : null

  const authorsArr = booksAuthors ? booksAuthors.filter(ba => ba.book_id === book.id): null

  const withNames = authorsArr ? authorsArr.map(ba => {
    return  {first_name: authors[ba.author_id - 1].first_name, last_name: authors[ba.author_id - 1].last_name };
  }) : null;

  return {
    id: book.id,
    user_id: user.id,
    title: book.title,
    description: book.description,
    instrument: book.instrument,
    isbn: book.isbn,
    year_published: book.year_published,
    date_created: book.date_created,
    num_reviews: numReviews,
    avg_rating: avgRating,
    publisher: book.publisher,
    authors: withNames || [],
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

function makeExpectedReview(review, users) {

  const user = users.find(user => user.id === review.user_id);

  return {
    id: review.id,
    book_id: review.book_id,
    user: {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      full_name: user.full_name,
      date_created: user.date_created
    },
    review_text: review.review_text,
    rating: review.rating,
    date_created: review.date_created
  }
}

// function makeExpectedReview(review) {
//   // const user = users.find(user => user.id === review.user_id);

//   return {
//     id: review.id,
//     book_id: review.book_id,
//     user_id: review.user_id,
//     review_text: review.review_text,
//     rating: review.rating,
//     date_created: review.date_created
//   };
// }

function makeMaliciousBook(user) {
  const maliciousBook = {
    id: 911,
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    instrument: "viola",
    isbn: "isbnisbn",
    year_published: 2000,
    user_id: user.id
  };
  const expectedBook = {
    ...makeExpectedBook(maliciousBook, [user]),
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
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
    review_text:
      'Naughty naughty REVIEW very naughty <script>alert("xss");</script>',
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
  const testAuthors = makeAuthorsArray();
  const testBooksAuthors = makeBooksAuthorsArray(testBooks, testAuthors);

  return { testUsers, testBooks, testReviews, testAuthors, testBooksAuthors };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
          books,
          users,
          reviews,
          authors,
          books_authors
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

function seedBooksTables(db, users, books, authors, reviews, books_authors) {
  return db
    .into("users")
    .insert(users)
    .then(() => db.into("books").insert(books))
    .then(() => db.into("authors").insert(authors))
    .then(() => makeReviewsArray.length && db.into("reviews").insert(reviews))
    .then(() => db.into("books_authors").insert(books_authors)
    );
}

function seedMaliciousBook(db, user, book) {
  return db
    .into("users")
    .insert([user])
    .then(() => db.into("books").insert([book]));
}

function seedMaliciousReview(db, users, book, review) {
  return db
    .into("users")
    .insert(users)
    .then(() => db.into("books").insert([book]))
    .then(() => db.into("reviews").insert([review]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id, date_created: user.date_created }, secret, {
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
  makeAuthorsArray,
  makeBooksAuthorsArray,
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
