--insert admin
INSERT INTO member
( id
, first_name
, last_name
, username
, password
) VALUES
( 
, ''
, ''
, ''
, ''
);

--insert verse
INSERT INTO verse
( id
, book
, chapter
, verse
, text
) VALUES
( 
, ''
, 
,
, ''
);

--insert citation
INSERT INTO citation
( id
, citation
) VALUES
( 
, ''    
);

--insert comment
INSERT INTO comment
( id
, author_id
, create_date
, verse_id
, citation_id
, text
) VALUES
( 
, (SELECT id FROM admininstrator WHERE username = '')
, (SELECT CURRENT_DATE)
, (SELECT id FROM verse WHERE book = '' AND chapter =  AND verse = )
, (SELECT id FROM citation WHERE citation = '')    
, ''
);
