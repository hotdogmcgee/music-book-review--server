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
('Philip', 'Groeber'),
('David', 'Hoge'),
('Leo', 'Welch'),
('Rey', 'Sanchez'),
('Randall', 'Faber'),
('Nancy', 'Faber'),
('Robert', 'Gillespie'),
('Michael', 'Allen'),
('Pamela', 'Tellejohn-Hayes'),
('Rick', 'Mooney'),
('Cassia', 'Harvey');

INSERT INTO books (title, isbn, description, instrument, year_published, publisher, user_id)
VALUES
('FJH Young Beginner Guitar Method: Lesson Book 1', '978-1569391655', 'Includes a pre-reading section that allows the student to play songs by reading fret numbers only. Natural notes in first position on strings one, two, and three are presented, along with basic rhythms. Dynamics are also introduced to develop musicianship at an early level. The book is equally adaptable to pick style or classical technique. Includes optional teacher duets with chord names. Rhythmic accuracy is stressed throughout the method.', 'guitar', 2002, 'The FJH Music Company Inc.', 1),
('Piano Adventures: Theory Level 2B', '978-1616770853', 'The thorough reinvention of the 2B Theory Book offers eight superb new pages for in-depth study of chords, harmonization, and rhythm. New improvisation activities offer creative exploration of scales in C major, G major and F major.', 'piano', 1997, 'Faber Piano Adventures', 2),
('Finger Exercises for Violin, Book One', '978-1932823837', 'Finger Exercises for the Violin, Book One presents a series of exercises that train the first or second-year violinist''s left hand in strength and agility in first position. With sections that focus on "high second finger", "low second finger", and "high third finger", these studies are a great way to build muscle memory and work on intonation. Each exercise focuses on a pattern that can be used to help your fingers feel less awkward in first position.
If you want faster fingers on the violin, playing one or two of these Finger Exercises is a great way to build your technique and improve your finger speed. The book is useful for basic daily training that can work along with a method or repertoire. While not intended for a complete beginner, the exercises can be played by advanced-beginning students who know first position notes on all four strings. These exercises have distilled pure technique into short studies that can help improve your first-position playing in just a few minutes a day.', 'violin', 2012, 'C.Harvey Publications', 2),
('guitar book', 'isbn3', 'who cares about this description', 'guitar', 1990, null, 2),

('The Clarinet', 'isbn5', 'totally a real book', 'clarinet', 2010, 'Clarinet Land', 1),
('Essential Elements for Strings: Cello Book 1', '978-0634038198', 'Essential Elements for Strings offers beginning students sound pedagogy and engaging music, all carefully paced to successfully start young players on their musical journey. EE features both familiar songs and specially designed exercises, created and arranged for the classroom in a unison-learning environment, as well as instrument-specific exercises to focus each student on the unique characteristics of their own instrument. EE provides both teachers and students with a wealth of materials to develop total musicianship, even at the beginning stages. Essential Elements now includes Essential Elements Interactive (EEi), the ultimate online music education resource. EEi introduces the first-ever, easy set of technology tools for online teaching, learning, assessment, and communication... ideal for teaching today"s beginning band and string students, both in the classroom and at home.', 'cello', 2002, 'Hal Leonard', 1),
('Position Pieces for Cello', '978-0874877625', 'Position Pieces for Cello is designed to give students a logical and fun way to learn their way around the fingerboard. Each hand position is introduced with exercises called "Target Practice," "Geography Quiz," and "Names and Numbers." Following these exercises are tuneful cello duets which have been specifically composed to require students to play in that hand position. In this way, students gain a thorough knowledge of how to find the hand positions, and once there, which notes are possible to play. Using these pieces (with names like "I Was a Teenage Monster," "The Irish Tenor," and "I"ve Got the Blues, Baby"), position study on the cello has never been so much fun!', 'cello', 1997, 'Alfred', 2);

INSERT INTO reviews (book_id, user_id, review_text, rating)
VALUES
(1, 1, 'wow so great', 5),
(1, 2, 'i did not like this', 2),
(2, 1, 'how do you play this instrument????', 1),
(2, 1, 'oh wait i see', 5),
(3, 2, 'My fingers are bleeding!', 4),
(2, 2, 'i love the piano so much. Thank you, Faber Family!', 5),
(5, 2, 'wow the clarinet is for losers!', 2),
(5, 1, 'ugh reeds are the worst', 2);

INSERT INTO books_authors (book_id, author_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(3, 11),
(6, 7),
(6, 8),
(6, 9),
(7, 10);


COMMIT;