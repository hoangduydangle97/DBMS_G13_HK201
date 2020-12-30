var sqlite3 = require('sqlite3').verbose();
var db = undefined;

function sqlite3Connect(dbName){
    db = new sqlite3.Database('./databases/'+ dbName +'.db', function(err){
        if (err){
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });
}

function sqlite3Disconnect(){
    db.close(function(err){
        if (err) {
            console.error(err.message);
        }
        console.log('Disconnected to the database.');
    });
}

exports.sqlite3Query = function(dbName, sql, params, callback){
    sqlite3Connect(dbName);
    db.all(sql, params, function(err, rows){
        if (err) {
            console.error(err.message);
        }
        else{
            sqlite3Disconnect();
            callback(rows);
        } 
    });
}