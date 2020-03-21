const Pool = require('pg-pool');

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

function loadCommentary(res, book, chapter, verse) {
    var id;
    var text;
    var verse;
    var commentary = "";

    var book = book.replace('+', ' ');
    console.log(book);
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
        
        var sql = "SELECT m.username, TO_CHAR(co.create_date, 'Month DD, YYYY') AS date, ci.title, co.text FROM comment co INNER JOIN member m ON co.author_id = m.id INNER JOIN citation ci ON co.citation_id = ci.id WHERE verse_id = $1;";
        pool.query(sql, [Number(id)], function(err, result) {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("ERROR IN QUERY");
                res.end();
            }
    
            var i;
            for (i = 0; i < result.rows.length; i++) {
                commentary += `<p>${result.rows[i].text} (${result.rows[i].title})</p><p>Posted by ${result.rows[i].username} on ${result.rows[i].date}</p>`
            }     
            details = {verse: verse, text: text, commentary: commentary}
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

module.exports = {loadBooks: loadBooks, loadChapters: loadChapters, loadVerses: loadVerses, loadCommentary: loadCommentary, loadBooksForComment: loadBooksForComment}