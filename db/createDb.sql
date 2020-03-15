CREATE TABLE member 
( id          SERIAL       NOT NULL PRIMARY KEY
, first_name  VARCHAR(50)  NOT NULL
, last_name   VARCHAR(50)  NOT NULL
, username    VARCHAR(50)  NOT NULL 
, password    VARCHAR(50)  NOT NULL
);

CREATE TABLE verse
( id          SERIAL       NOT NULL PRIMARY KEY
, book        VARCHAR(50)  NOT NULL
, chapter     INT          NOT NULL
, verse       INT          NOT NULL
, text        TEXT         NOT NULL
);

CREATE TABLE source_type
( id           SERIAL      NOT NULL PRIMARY KEY
, source_type  VARCHAR(20) NOT NULL
);

CREATE TABLE citation
( id             SERIAL       NOT NULL PRIMARY KEY
, author_first   VARCHAR(50)  NOT NULL
, author_last    VARCHAR(50)  NOT NULL
, title          TEXT         NOT NULL
, other          VARCHAR(100) NOT NULL
, source_type_id INT          NOT NULL REFERENCES source_type(id)
);

CREATE TABLE comment
( id          SERIAL       NOT NULL PRIMARY KEY
, author_id   INT          NOT NULL REFERENCES member(id)
, create_date DATE         NOT NULL
, verse_id    INT          NOT NULL REFERENCES verse(id)
, citation_id INT          NOT NULL REFERENCES citation(id)
, text        TEXT         NOT NULL
);