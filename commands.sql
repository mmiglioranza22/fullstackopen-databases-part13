CREATE TABLE blogs (
    id SERIAL PRIMARY KEY, author text,
    url text NOT NULL, title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('first author', 'someurl.com', 'dale no');
insert into blogs (author, url, title) values ('second author', 'someurl.comxxx', 'dale booooo');

