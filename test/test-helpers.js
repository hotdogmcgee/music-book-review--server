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
      // date_modified: null
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "Test user 3",
      email: "maybe@maybe.com",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z",
      // date_modified: null
    },
    {
      id: 4,
      user_name: "test-user-4",
      full_name: "Test user 4",
      email: "steve@evets.com",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z",
      // date_modified: null
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

function makeExpectedBook(users, book) {
    const user = users.find(user => user.id === book.user_id)

    return {
        id: book.id,
        title: book.title,
        information: book.information,
        instrument: book.instrument,
        isbn: book.isbn,
        year_published: book.year_published,
        user: {
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            full_name: user.full_name,
            date_created: user.date_created,
            date_modified: user.date_modified || null
          },
    }
}

function makeMaliciousBook(user) {
    const maliciousBook = {
      id: 911,
      date_created: new Date().toISOString(),
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      information: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      instrument: 'viola',
      isbn: 'isbnisbn',
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

function makeBooksFixtures() {
    const testUsers = makeUsersArray();
    const testBooks = makeBooksArray(testUsers)

    return { testUsers, testBooks}
}

function cleanTables(db) {
    return db.raw(
      `TRUNCATE
          books,
          users
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
        db.raw(`SELECT setval('users_id_seq', ?)`, [
          users[users.length - 1].id
        ])
      );
  }

  function seedBooksTables(db, users, books, reviews=[]) {
    return db
      .into("users")
      .insert(users)
      .then(() => db.into("books").insert(books)
      )
    //   .then(() =>
    //     makeSubmissionsArray.length && db.into('submissions').insert(submissions)
    //   )
  }

  function seedMaliciousBook(db, user, book) {
    return db
      .into("users")
      .insert([user])
      .then(() => db.into("books").insert([book]));
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
    makeBooksFixtures,
    makeExpectedBook,
    makeMaliciousBook,
    // makeExpectedSubmission,
  
    cleanTables,
    seedBooksTables,
    seedUsers,
    seedMaliciousBook
  };