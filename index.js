const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

var project = require('./project.js');
var postCalc = require('./postCalc.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

//project routes
app.get('/school', project.loadBooks);
app.get('/commentary', (req, res) => project.loadCommentary(res, req.query.book, req.query.chapter, req.query.verse));
app.get('/addComment', res.render('pages/addComment'));
app.get('/addVerse', res.render('pages/addVerse'));

app.get('/chapters', (req, res) => project.loadChapters(res, req.query.book));
app.get('/verses', (req, res) => project.loadVerses(res, req.query.book, req.query.chapter));

//postal rate calculator routes
app.get('/postCalcForm', function(req, res) {
  res.sendFile('postCalcForm.html', {root: __dirname + '/public'});
});
app.get('/postCalcRate', postCalc.calcRate);


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
