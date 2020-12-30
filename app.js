var express = require('express');
var app = express();
var router = require('./routes/index');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(3000);