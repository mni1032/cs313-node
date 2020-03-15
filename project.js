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
    
        var books = " select id='book' ";
        var i;
        for (i = 0; i < result.rows.length; i++) {
            books = books + " option value=" + result.rows[i].book + " " + result.rows[i].book + " /option ";
        }
        books += " /select ";
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(books);
        res.end();        
        // var params = {books: books};
        // res.render('/pages/school', params);

    
    });     
}

module.exports = {loadBooks: loadBooks}