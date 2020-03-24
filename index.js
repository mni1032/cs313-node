const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const session = require('express-session');

var project = require('./project.js');
var postCalc = require('./postCalc.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

//project routes
app.get('/school', project.loadBooks);
app.get('/commentary', (req, res) => project.loadCommentary(res, req.query.book, req.query.chapter, req.query.verse));
app.get('/addComment', project.loadBooksForComment);
app.get('/addVerse', (req, res) => res.render('pages/addVerse'));

app.get('/chapters', (req, res) => project.loadChapters(res, req.query.book));
app.get('/verses', (req, res) => project.loadVerses(res, req.query.book, req.query.chapter));
app.post('/insertComment', project.insertComment);
app.post('/insertVerse', project.insertVerse);

//postal rate calculator routes
app.get('/postCalcForm', function(req, res) {
  res.sendFile('postCalcForm.html', {root: __dirname + '/public'});
});
app.get('/postCalcRate', postCalc.calcRate);

/* Team 12 */
var logRequest = function (req, res, next) {
  console.log("Received a request for: " + req.url);
  next();
}
app.use(logRequest);


var verifyLogin = function (req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.writeHead(401, {"Content-Type": "application/json"});
    res.write(JSON.stringify({status: 401, success: false}));
    res.end();
  }  
}
app.use(session({
  secret: 'much secret',
  resave: false,
  saveUninitialized: true
}));

function connectToDb() {
  const connectionString = "postgres://mohnqqmhlyxftp:3656ef63652e5d369a0bcc7391b883a8deeee9a2e9bb32a63174683c6b08f626@ec2-23-22-156-110.compute-1.amazonaws.com:5432/d5ps07nkfvc3dm?ssl=true";
  const pool = new Pool({connectionString: connectionString});
  return pool;
}

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var id = null;
  var pool = connectToDb();
  var params = [username, password];
  var sql = 'SELECT id FROM member WHERE username = $1 AND password = $2';
  pool.query(sql, params, function(err, result) {
    if (err) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write("ERROR IN QUERY");
        res.end();
    }

    id = result.rows[0].id;
    var json = {success: false};
    if (id != null) {
      json.success = true; 
      req.session.username = username;
      req.session.password = password;
    }
    res.json(json);
  });  
});

app.post('/logout', function(req, res) {
  var json = {success: false};
  if (req.session.username) {
    req.session.destroy();
    json.success = true; 
  }
  res.json(json);

});

app.use(verifyLogin);
app.get('/getServerTime', function(req, res) {
  var time = new Date();
  var result = {success: true, time: time};
  res.json(result);
});

/* End Team 12 */

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
