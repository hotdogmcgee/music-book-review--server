# About

An API designed for the Music Book Review app. Built using Node.js and Postgresql, deployed on Heroku. The API performs basic CRUD operations with protected endpoints via login.

## API endpoint

https://music-book-review.herokuapp.com/

## Live Link to Client

https://music-book-review-client.vercel.app/

## Installing

This requires Node.js v6.0+ to run.
Install the dependencies and devDependencies and start the server.

```
npm install
```

## Running the tests

To run front-end or back-end tests, simply run `npm test` in the terminal.

## Seed the Database

### Deployment
`heroku pg:psql -f ./seeds/seed.musicbooks_tables.sql `

## Schema

### users

```js
{
    user_name: String,
    full_name: String,
    password: String,
    email: String,
    date_created: Date
}
```

### books

```js
{
    title: String,
    isbn: String,
    description: String,
    instrument: String,
    year_published: Number,
    publisher: String,
    date_created: Date
    user_id: Number
}
```

### reviews

```js
{
    book_id: Number,
    user_id: Number,
    review_text: String,
    rating: Number,
    date_created: Date
}
```

### authors

```js
{
    first_name: String,
    last_name: String
}
```

### books_authors

```js
{
    book_id: Number,
    author_id: Number
}
```

## API Overview

```text
/api
.
├── /auth
│   └── POST
│       └──/login
├── /users
│   └── GET /
│   └── GET /:id
│   └── POST
│       └── /
├── /books
│   └── GET
│       ├── /
│       ├── /:book_id
│       ├── /:book_id/reviews
│       └── /:book_id/authors
│   └── PATCH
│       └── /:book_id/
│   └── DELETE
│       └── /:book_id/
├── /reviews
│   └── GET
│       ├── /
│       └── /:submission_id
│   └── POST
│       └── /

```

### POST `/api/auth/login`

```js
// req.body
{
  username: String,
  password: String
}

// res.body
{
  payload: { user_id, date_created },
  authToken: String
}
```

### GET `/api/users?sort:{STRING}`

```js
// req.query
{
  ?
}

// res.body
[
  {
    id: Number,
    user_name: String,
    full_name: String,
    password: String,
    email: String,
    date_created: Date
  }
]
```

### POST `/api/users/`

```js
// req.body
{
  email: String,
  full_name: String,
  user_name: String,
  password: String
}

// res.body
{
  id: Number,
  full_name: String,
  user_name: String,
  email: String,
  date_created: Date
}
```

### GET `/api/books`

```js
[
  {
    id: Number,
    title: String,
    description: String,
    instrument: String,
    isbn: String,
    year_published: Number,
    publisher: String,
    date_created: Date,
    num_reviews: Number,
    avg_rating: Number,
    user_id: Number,
    user: {
      id,
      user_name,
      full_name,
      email,
      date_created
    },
    authors: [{ first_name: String, last_name: String }]
  }
];
```

### GET `/api/books/:book_id`

```js

//req.params
{
    book_id: book_id
}
  {
    id: Number,
    title: String,
    description: String,
    instrument: String,
    isbn: String,
    year_published: Number,
    publisher: String,
    date_created: Date,
    num_reviews: Number,
    avg_rating: Number,
    user_id: Number,
    user: {
      id,
      user_name,
      full_name,
      email,
      date_created
    },
    authors: [{ first_name: String, last_name: String }]
  }
```

### GET `/api/books/:book_id/reviews`

```js
//req.params
{
  book_id: book_id;
}

//res.body
[
  {
    id: Number,
    book_id: Number,
    rating: Number,
    review_text: String,
    date_created: Date,
    user_id: Number,
    user: {
      id,
      user_name,
      full_name,
      email,
      date_created
    }
  }
];
```

### GET `/api/books/:book_id/authors`

```js
//req.params
{
  book_id: book_id;
}

//res.body
[
  {
    first_name: String,
    last_name: String
  }
];
```

### PATCH `/api/books/:book_id`

```js

//req.params
{
    book_id: book_id
}

//req.body
{
  title: String,
  description: String,
  isbn: String,
  year_published: String
}
//res.status
  {
    204
  }
```

### DELETE `/api/books/:book_id`

```js

//req.params
{
    book_id: book_id
}

//res.status
  {
    204
  }
```

### GET `/api/reviews`

```js
[
  {
    id: Number,
    book_id: Number,
    rating: Number,
    review_text: String,
    date_created: Date,
    user_id: Number,
    user: {
      id,
      user_name,
      full_name,
      email,
      date_created
    }
  }
];
```

### GET `/api/reviews/:review_id?sort={String}`

```js

//req.query
{
    ?
}
//req.params
{
  review_id: review_id;
}

//res.body
[
  {
    id: Number,
    book_id: Number,
    rating: Number,
    review_text: String,
    date_created: Date,
    user: {
      id,
      user_name,
      full_name,
      email,
      date_created
    }
  }
];
```

### POST `/api/reviews`

```js

//req.body
{
    user_id: Number,
    book_id: Number,
    rating: Number,
    review_text: Number
}

//res.body

      {
    id: Number,
    book_id: Number,
    rating: Number,
    review_text: String,
    date_created: Date,
    user: {
      id,
      user_name,
      full_name,
      email,
      date_created
    }
  }
```
