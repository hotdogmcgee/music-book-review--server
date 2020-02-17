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
('Kevin', 'Kevin Robinson', 'kevinrobinsondeveloper@gmail.com', '$2a$12$Qze4u93zuEZ.jZ.vNsExe.RtlgCc28oDhEvvVKjOcfjaoGwdkEEC6'),
('Bob', 'Bob Roberts', 'bobob@bob.com', '$2a$12$bWxe4hIrEzEzn2NDs7Kai.r4qzPGQOjQ00nsTeS66gGJvk43aIzW2');

INSERT INTO authors (first_name, last_name) 
VALUES
('Ray', 'Guitar'),
('Suzie', 'Violin'),
('Bastian', 'Cool'),
('Clarinet', 'King'),
('Johnny', 'Guitar'),
('Robert', 'Gillespie'),
('Michael', 'Allen'),
('Pamela', 'Tellejohn-Hayes'),
('Rick', 'Mooney');

INSERT INTO books (title, isbn, description, instrument, year_published, publisher, user_id)
VALUES
('FJH 1', 'isbn1', 'for guitar beginners, a great resource!', 'guitar', 2000, null, 1),

('The Art of Violin', 'isbn2', 'literally every violin player has used this for 10,000 years', 'violin', 882, null, 1),
('guitar book', 'isbn3', 'who cares about this description', 'guitar', 1990, null, 2),
('Music for Millions', 'isbn4', 'a great piano book for beginners', 'piano', 1950, 'Tyrell Corp', 2),
('The Clarinet', 'isbn5', 'totally a real book', 'clarinet', 2010, 'Clarinet Land', 1),
('Essential Elements for Strings: Cello Book 1', '978-0634038198', 'Essential Elements for Strings offers beginning students sound pedagogy and engaging music, all carefully paced to successfully start young players on their musical journey. EE features both familiar songs and specially designed exercises, created and arranged for the classroom in a unison-learning environment, as well as instrument-specific exercises to focus each student on the unique characteristics of their own instrument. EE provides both teachers and students with a wealth of materials to develop total musicianship, even at the beginning stages. Essential Elements now includes Essential Elements Interactive (EEi), the ultimate online music education resource. EEi introduces the first-ever, easy set of technology tools for online teaching, learning, assessment, and communication... ideal for teaching today"s beginning band and string students, both in the classroom and at home.', 'cello', 2002, 'Hal Leonard', 1),
('Position Pieces for Cello', '978-0874877625', 'Position Pieces for Cello is designed to give students a logical and fun way to learn their way around the fingerboard. Each hand position is introduced with exercises called "Target Practice," "Geography Quiz," and "Names and Numbers." Following these exercises are tuneful cello duets which have been specifically composed to require students to play in that hand position. In this way, students gain a thorough knowledge of how to find the hand positions, and once there, which notes are possible to play. Using these pieces (with names like "I Was a Teenage Monster," "The Irish Tenor," and "I"ve Got the Blues, Baby"), position study on the cello has never been so much fun!', 'cello', 1997, 'Alfred', 2);

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
(5, 4),
(6, 6),
(6, 7),
(6, 8),
(7, 9);

COMMIT;