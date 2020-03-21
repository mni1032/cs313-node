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
    details = {book: book, chapter: chapter, verse: verse}
    res.render("pages/commentary", details)
}

module.exports = {loadBooks: loadBooks, loadChapters: loadChapters, loadVerses: loadVerses, loadCommentary: loadCommentary}