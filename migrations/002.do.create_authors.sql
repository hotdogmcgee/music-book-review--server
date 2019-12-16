CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
);

ALTER TABLE books
    ADD COLUMN
        author_id INTEGER REFERENCES authors(id)
        ON DELETE SET NULL;
