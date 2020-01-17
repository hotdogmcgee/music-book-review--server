CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    isbn TEXT,
    description TEXT,
    instrument TEXT NOT NULL,
    year_published INTEGER,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);