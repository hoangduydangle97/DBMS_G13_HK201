var express = require('express');
var router = express.Router();
var sqlite3 = require('../models/sqlite3');

router.get('/', function(req, res){
    var dbName = 'chinook';
    var sql = 'SELECT * FROM albums;';
    sqlite3.sqlite3Query(dbName, sql, [], function(rows){
        res.render('index', {
            rows: rows
        });
    });
});

router.post('/', function(req, res){
    res.send('POST');
});

module.exports = router;