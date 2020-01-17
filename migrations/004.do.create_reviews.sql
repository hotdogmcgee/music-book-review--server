CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,

    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL,
        date_created TIMESTAMP DEFAULT now() NOT NULL

);

-- ALTER TABLE books 
--     ADD COLUMN
--         avg_rating NUMBER AVG(rating, b.title) FROM reviews LEFT JOIN books b ON b.id = reviews.book_id
--         ON DELETE SET NULL;
