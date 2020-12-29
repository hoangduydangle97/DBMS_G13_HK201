var express = require('express');
var app = express();
var router = require('./routes/index');

app.use('/', router);

app.listen(3000);