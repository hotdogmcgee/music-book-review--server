CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    isbn TEXT,
    information TEXT,
    instrument TEXT NOT NULL,
    year_published INTEGER
);