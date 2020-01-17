BEGIN;

TRUNCATE 
    books,
    authors,
    users,
    reviews, 
    books_authors
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, email, password)
VALUES 
('Kevin', 'Kevin Robinson', 'kevinrobinsondeveloper@gmail.com', 'default'),
('Bob', 'Bob Roberts', 'bobob@bob.com', 'bob');

INSERT INTO authors (first_name, last_name) 
VALUES
('Ray', 'Guitar'),
('Suzie', 'Violin'),
('Bastian', 'Cool'),
('Clarinet', 'King'),
('Johnny', 'Guitar');

INSERT INTO books (title, isbn, information, instrument, year_published, user_id)
VALUES
('FJH 1', 'isbn1', 'for guitar beginners, a great resource!', 'guitar', 2000, 1),
('The Art of Violin', 'isbn2', 'literally every violin player has used this for 10,000 years', 'violin', 882, 1),
('guitar book', 'isbn3', 'who cares about this description', 'guitar', 1990, 2),
('Music for Millions', 'isbn4', 'a great piano book for beginners', 'piano', 1950, 2),
('The Clarinet', 'isbn5', 'totally a real book', 'clarinet', 2010, 1);

INSERT INTO reviews (book_id, user_id, review_text, rating)
VALUES
(1, 1, 'wow so great', 5),
(1, 2, 'i did not like this', 2),
(2, 1, 'how do you play this instrument????', 1),
(2, 1, 'oh wait i see', 5),
(4, 2, 'i love the piano so much, thank you Bastian!', 5),
(5, 2, 'wow the clarinet is for losers!', 2),
(5, 1, 'ugh reeds are the worst', 2);

INSERT INTO books_authors (book_id, author_id)
VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 1),
(4, 3),
(5, 4);

COMMIT;