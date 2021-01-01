var express = require('express');
var app = express();
var router = require('./routes/index');
var bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use('/', router);

app.listen(3000);