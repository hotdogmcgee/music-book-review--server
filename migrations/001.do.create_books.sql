CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    information TEXT,
    instrument TEXT NOT NULL,
    year_published NUMERIC
);