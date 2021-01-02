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

exports.sqlite3QueryRows = function(dbName, sql, params, callback){
    sqlite3Connect(dbName);
    db.all(sql, params, function(err, rows){
        sqlite3Disconnect();
        if (err) {
            console.error(err.message);
            callback(false);
        }
        else{
            callback(rows);
        } 
    });
}

exports.sqlite3QueryRow = function(dbName, sql, params, callback){
    sqlite3Connect(dbName);
    db.each(sql, params, function(err, row){
        sqlite3Disconnect();
        if (err) {
            console.error(err.message);
            callback(false);
        }
        else{
            callback(row);
        } 
    });
}

exports.sqlite3Create = function(dbName, table, values, callback){
    sqlite3Connect(dbName);
    var tbName = table.pop();
    var fields = table.map(function(field){
        return field;
    }).join(', ');
    var values = values.map(function(value){
        return "'" + value + "'";
    }).join(', ');
    var sql = 'INSERT INTO ' + tbName + '(' + fields + ') VALUES (' + values + ');';
    db.run(sql, [], function(err){
        sqlite3Disconnect();
        if (err) {
            console.error(err.message);
            callback(false);
        }
        else{
            callback(true);
        } 
    });
}

exports.sqlite3Update = function(dbName, table, values, callback){
    sqlite3Connect(dbName);
    var tbName = table.pop();
    var fields = table.map(function(field){
        return field + ' = ?';
    }).join(', ');
    var sql = 'UPDATE ' + tbName + ' SET ' + fields + ' WHERE ' + table[0] + ' = ?;';
    db.run(sql, values, function(err){
        sqlite3Disconnect();
        if (err) {
            console.error(err.message);
            callback(false);
        }
        else{
            callback(true);
        } 
    });
}

exports.sqlite3Delete = function(dbName, table, value, callback){
    sqlite3Connect(dbName);
    var tbName = table.pop();
    var field = table.pop();
    var sql = 'DELETE FROM ' + tbName + ' WHERE ' + field + ' = ?;';
    db.run(sql, [value], function(err){
        sqlite3Disconnect();
        if (err) {
            console.error(err.message);
            callback(false);
        }
        else{
            callback(true);
        } 
    });
}