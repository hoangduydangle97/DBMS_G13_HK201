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
        if (err) {
            console.error(err.message);
        }
        else{
            sqlite3Disconnect();
            callback(rows);
        } 
    });
}

exports.sqlite3QueryRow = function(dbName, sql, params, callback){
    sqlite3Connect(dbName);
    db.each(sql, params, function(err, row){
        if (err) {
            console.error(err.message);
        }
        else{
            sqlite3Disconnect();
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
        if (err) {
            console.error(err.message);
        }
        else{
            sqlite3Disconnect();
            callback();
        } 
    });
}

exports.sqlite3Update = function(dbName, table, values, callback){
    sqlite3Connect(dbName);
    var tbName = table.pop();
    var fields = table.map(function(field){
        return field + ' = ?';
    }).join(', ');
    var sql = 'UPDATE ' + tbName + ' SET ' + fields + ' WHERE id_student = ?;';
    db.run(sql, values, function(err){
        if (err) {
            console.error(err.message);
        }
        else{
            sqlite3Disconnect();
            callback();
        } 
    });
}

exports.sqlite3Delete = function(dbName, table, value, callback){
    sqlite3Connect(dbName);
    var tbName = table.pop();
    var field = table.pop();
    var sql = 'DELETE FROM ' + tbName + ' WHERE ' + field + ' = ' + value + ';';
    db.run(sql, [], function(err){
        if (err) {
            console.error(err.message);
        }
        else{
            sqlite3Disconnect();
            callback();
        } 
    });
}