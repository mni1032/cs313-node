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
app.use(session({???}));
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  console.log(username);
  console.log(password);
});

app.post('/logout', function(req, res) {
  if (req.session) {
    
  }

});
app.get('/getServerTime');

/* End Team 12 */

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
