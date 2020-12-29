var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send('GET');
});

router.post('/', function(req, res){
    res.send('POST');
});

module.exports = router;