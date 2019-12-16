CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL

);