const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

var postCalc = require('./postCalc.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));
app.get('/postCalcForm', function(req, res) {
  res.sendFile('postCalcForm.html', {root: __dirname + '/public'});
});
app.get('/postCalcRate', postCalc.calcRate);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
