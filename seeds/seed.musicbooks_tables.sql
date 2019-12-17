BEGIN;

TRUNCATE 
    books,
    authors,
    users,
    reviews
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
('Clarinet', 'King');

INSERT INTO books (title, information, instrument, year_published, author_id, user_id)
VALUES
('FJH 1', 'for guitar beginners, a great resource!', 'guitar', 2000, 1 , 1),
('The Art of Violin', 'literally every violin player has used this for 10,000 years', 'violin', 882, 2, 1),
('guitar book', 'who cares about this description', 'guitar', 1990, 1, 2),
('Music for Millions', 'a great piano book for beginners', 'piano', 1950, 3, 2),
('The Clarinet', 'totally a real book', 'clarinet', 2010, 4, 1);

INSERT INTO reviews (book_id, user_id, review_text, rating)
VALUES
(1, 1, 'wow so great', 5),
(1, 2, 'i did not like this', 2),
(2, 1, 'how do you play this instrument????', 1),
(2, 1, 'oh wait i see', 5),
(3, 2, 'i love the piano so much, thank you Bastian!', 5),
(4, 2, 'wow the clarinet is for losers!', 2),
(4, 1, 'ugh reeds are the worst', 2);

COMMIT;