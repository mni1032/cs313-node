const Pool = require('pg-pool');
const bcrypt = require('bcrypt');

function connectToDb() {
    const connectionString = "postgres://mohnqqmhlyxftp:3656ef63652e5d369a0bcc7391b883a8deeee9a2e9bb32a63174683c6b08f626@ec2-23-22-156-110.compute-1.amazonaws.com:5432/d5ps07nkfvc3dm?ssl=true";
    const pool = new Pool({connectionString: connectionString});
    return pool;
}

function loadBooks(req, res) {
    var pool = connectToDb();
    var sql = "SELECT DISTINCT book FROM verse;";

    pool.query(sql, function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
    
        var books = "";
        var i;
        for (i = 0; i < result.rows.length; i++) {
            books = books + `<option value='${result.rows[i].book}'>${result.rows[i].book}</option>`;
        }      
        var params = {books: books};
        res.render('pages/school', params);

    
    });     
}

function loadChapters(res, bookURI) {
    var book = decodeURIComponent(bookURI);
    var pool = connectToDb();
    var sql = "SELECT DISTINCT chapter FROM verse WHERE book = $1;";
    pool.query(sql, [book], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
    
        var chapters = "";
        var i;
        for (i = 0; i < result.rows.length; i++) {
            chapters = chapters + `<option value='${result.rows[i].chapter}'>${result.rows[i].chapter}</option>`;
        }     

        chapterJson = {chapters: chapters};
        var json = JSON.stringify(chapterJson)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(json);
        res.end();
    });     
}

function loadVerses(res, bookURI, chapter) {
    var book = decodeURIComponent(bookURI);
    var pool = connectToDb();
    var sql = "SELECT DISTINCT verse FROM verse WHERE book = $1 AND chapter = $2;";
    pool.query(sql, [book, Number(chapter)], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
    
        var verses = "";
        var i;
        for (i = 0; i < result.rows.length; i++) {
            verses = verses + `<option value='${result.rows[i].verse}'>${result.rows[i].verse}</option>`;
        }     

        verseJson = {verses: verses};
        var json = JSON.stringify(verseJson)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(json);
        res.end();
    });     
}

function loadCommentary(req, res, book, chapter, verse) {
    var id;
    var text;
    var verse;
    var commentary = "";

    var book = book.replace('+', ' ');
    var pool = connectToDb();
    var sql = "SELECT id, text FROM verse WHERE book = $1 AND chapter = $2 AND verse = $3;";
    pool.query(sql, [book, Number(chapter), Number(verse)], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }

        id = result.rows[0].id;
        text = result.rows[0].text;
        verse = `${book} ${chapter}:${verse}`;     
        
        var sql = "SELECT co.id, m.username, TO_CHAR(co.create_date, 'Month DD, YYYY') AS date, ci.title, ci.other, co.text, s.source_type FROM comment co INNER JOIN member m ON co.author_id = m.id INNER JOIN citation ci ON co.citation_id = ci.id INNER JOIN source_type s ON ci.source_type_id = s.id WHERE verse_id = $1;";
        pool.query(sql, [Number(id)], function(err, result) {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("ERROR IN QUERY");
                res.end();
            }
    
            var i;
            for (i = 0; i < result.rows.length; i++) {
                commentary += `<p>${result.rows[i].text} (${result.rows[i].title}, ${result.rows[i].other})</p><p>Posted by ${result.rows[i].username} on ${result.rows[i].date}</p>`;
                if (req.session.username == result.rows[i].username) {
                    commentary += `<form action='/editComment' method='GET'><input id='id' name='id' type='hidden' value=${result.rows[i].id}><input id='editComment' name='editComment' type='submit' value='Edit comment'></form><form action='/deleteComment' method='POST'><input id='id' name='id' type='hidden' value=${id}><input id='deleteComment' name='deleteComment' type='submit' value='Delete comment'></form>`;
                }
            }     
            details = {id: id, verse: verse, text: text, commentary: commentary}
            if (req.session.username) {
                details.edit = true;
            }
            res.render("pages/commentary", details)
        });   
    });     
}

function loadBooksForComment(req, res) {
    var pool = connectToDb();
    var sql = "SELECT DISTINCT book FROM verse;";

    pool.query(sql, function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
    
        var books = "";
        var i;
        for (i = 0; i < result.rows.length; i++) {
            books = books + `<option value='${result.rows[i].book}'>${result.rows[i].book}</option>`;
        }      
        var params = {books: books};
        res.render('pages/addComment', params);
    });
}

function insertComment(req, res) {
    var pool = connectToDb();
    var sql = "INSERT INTO citation (author_first, author_last, title, other, source_type_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;";
    pool.query(sql, [req.body.author_first, req.body.author_last, req.body.title, req.body.other, req.body.type], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
        var citation_id = result.rows[0].id;

        sql = "SELECT id FROM verse WHERE book = $1 AND chapter = $2 AND verse = $3";
        pool.query(sql, [req.body.book, Number(req.body.chapter), Number(req.body.verse)], function(err, result) {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("ERROR IN QUERY");
                res.end();
            }
            var verse_id = result.rows[0].id;
            sql = "INSERT INTO comment (author_id, create_date, verse_id, citation_id, text) VALUES (1, NOW(), $1, $2, $3);"
            pool.query(sql, [verse_id, citation_id, req.body.text], function(err, result) {
                if (err) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write("ERROR IN QUERY");
                    res.end();
                }
                return res.redirect('/addComment')
            });    
        });
    });
}

function insertVerse(req, res) {
    var pool = connectToDb();
    var sql = "INSERT INTO verse (book, chapter, verse, text) VALUES ($1, $2, $3, $4);";

    pool.query(sql, [req.body.book, Number(req.body.chapter), Number(req.body.verse), req.body.text], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
        else {
            return res.redirect('/addVerse')
        }
    });
}

function validateLogin(req, res) {
    var username = req.body.username;
    var password = req.body.password;
  
    var pool = connectToDb();
    var sql = 'SELECT password FROM member WHERE username = $1';
    pool.query(sql, [username], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
    
        var hash = result.rows[0].password
    
        bcrypt.compare(password, hash, function(err, result) {
            if (result) {
                req.session.username = username;
            }
            return res.redirect('/school');
        });
    });
}

function loadVerseDetails(req, res) {
    var pool = connectToDb();
    var sql = "SELECT book, chapter, verse, text FROM verse WHERE id = $1;";

    pool.query(sql, [Number(req.query.verseId)], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
        else {
            var params = {id: req.query.verseId, book: result.rows[0].book, chapter: result.rows[0].chapter, verse: result.rows[0].verse, text: result.rows[0].text};
            res.render('pages/editVerse', params);
        }
    });
}

function updateVerse(req, res) {
    var pool = connectToDb();
    var sql = "UPDATE verse SET book = $1, chapter = $2, verse = $3, text = $4 WHERE id = $5;"

    pool.query(sql, [req.body.book, Number(req.body.chapter), Number(req.body.verse), req.body.text, Number(req.body.id)], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
        var url = '/commentary?book=' + req.body.book + '&chapter=' + req.body.chapter + '&verse=' + req.body.verse;
        return res.redirect(url);
    });
}

function loadCommentDetails(req, res) {
    var pool = connectToDb();
    var sql = "SELECT co.text, ci.author_first, ci.author_last, ci.title, ci.other FROM comment co INNER JOIN citation ci ON co.citation_id = ci.id WHERE co.id = $1;";

    pool.query(sql, [Number(req.query.id)], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
        else {
            var params = {id: req.query.id, title: result.rows[0].title, author_first: result.rows[0].author_first, author_last: result.rows[0].author_last, other: result.rows[0].other, text: result.rows[0].text};
            res.render('pages/editComment', params);
        }
    });
}

function updateComment(req, res) {
    var pool = connectToDb();
    var sql = "UPDATE citation SET author_first = $1, author_last = $2, title = $3, other = $4 WHERE id = (SELECT citation_id FROM comment WHERE id = $5);"

    pool.query(sql, [req.body.author_first, req.body.author_last, req.body.title, req.body.other, Number(req.body.id)], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }
        sql = "UPDATE comment SET text = $1 WHERE id = $2;";
        pool.query(sql, [req.body.text, Number(req.body.id)], function(err, result) {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("ERROR IN QUERY");
                res.end();
            }
            return res.redirect('/school');
        })
    });
}

function deleteComment(req, res) {
    var pool = connectToDb();
    var sql = "DELETE FROM comment WHERE id = $1 RETURNING citation_id;"

    pool.query(sql, [req.body.id], function(err, result) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("ERROR IN QUERY");
            res.end();
        }

        sql = "DELET FROM citation WHERE id = $1;";
        pool.query(sql, [result.rows[0].citation_id], function(err, result) {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("ERROR IN QUERY");
                res.end();
            }
            return res.redirect('/school');
        });
    });
}

module.exports = {loadBooks: loadBooks, loadChapters: loadChapters, loadVerses: loadVerses, loadCommentary: loadCommentary, loadBooksForComment: loadBooksForComment, insertComment: insertComment, insertVerse: insertVerse, validateLogin: validateLogin, loadVerseDetails: loadVerseDetails, updateVerse: updateVerse, loadCommentDetails: loadCommentDetails, updateComment: updateComment, deleteComment: deleteComment}