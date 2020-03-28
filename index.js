const express = require('express');
const path = require('path');
const Pool = require('pg-pool');
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

//project session
app.use(session({
  secret: 'much secret',
  resave: false,
  saveUninitialized: true
}));

//project routes
//main pages
app.get('/school', project.loadBooks);
app.get('/commentary', (req, res) => project.loadCommentary(req, res, req.query.book, req.query.chapter, req.query.verse));

//ajax calls
app.get('/chapters', (req, res) => project.loadChapters(res, req.query.book));
app.get('/verses', (req, res) => project.loadVerses(res, req.query.book, req.query.chapter));

//login handling
app.get('/login', (req, res) => res.render('pages/login'))
app.post('/validateLogin', project.validateLogin);

//for members only
var authorize = function(req, res, next) {
  if (req.session.username) {
    next();
  }
  else {
    res.redirect('/login');
  }
}

app.use(authorize);
app.get('/addComment', project.loadBooksForComment);
app.get('/addVerse', (req, res) => res.render('pages/addVerse'));
app.post('/insertComment', project.insertComment);
app.post('/insertVerse', project.insertVerse);

app.get('/editVerse', project.loadVerseDetails);
app.post('/updateVerse', project.updateVerse);
app.get('/editComment', project.loadCommentDetails);
// app.get('/deleteComment', project.deleteComment);

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/school');
})

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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
