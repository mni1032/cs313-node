const db = require('./db.js');

function loadBooks(req, res) {
    var pool = db.connectToDb();
    var sql = "SELECT DISTINCT book FROM verse;";

    pool.query(sql, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        res.render("Success!")
    
    });     
}

module.exports = {loadBooks: loadBooks}