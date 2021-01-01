var express = require('express');
var router = express.Router();
var sqlite3 = require('../models/sqlite3');
var dbName = 'school';

router.get('/sqlite/school/student', function(req, res){
    var sql = 'SELECT t1.*, t2.name_class FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class;';
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(students){
        res.render('index', {
            students: students
        });
    });
});

router.post('/sqlite/ajax/class', function(req, res){
    sql = 'SELECT * FROM class;';
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(classes){
        res.render('create_student', {
            classes: classes
        });
    });
});

router.post('/sqlite/ajax/update-btn', function(req, res){
    var sql = "SELECT t1.*, t2.name_class FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class WHERE id_student = '" + req.body.id + "';";
    sqlite3.sqlite3QueryRow(dbName, sql, [], function(student){
        sql = 'SELECT * FROM class;';
        sqlite3.sqlite3QueryRows(dbName, sql, [], function(classes){
            res.render('update_student', {
                student: student,
                classes: classes
            });
        });
    });
});

router.post('/sqlite/ajax/cancel-btn', function(req, res){
    var sql = "SELECT t1.*, t2.name_class FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class WHERE id_student = '" + req.body.id + "';";
    sqlite3.sqlite3QueryRow(dbName, sql, [], function(row){
        res.render('added_student', {
            row: row
        });
    });
});

router.post('/sqlite/ajax/search', function(req, res){
    var text = req.body.text;
    var whereClause = '';
    if(text != ''){
        if(isNaN(Number(text))){
            whereClause = " WHERE (name_student LIKE '%" + text + "%') " 
            + "OR (name_class LIKE '%" + text + "%')";
        }
        else{
            text = Number(text);
            if(Number.isInteger(text)){
                whereClause = " WHERE (id_student LIKE '%" + text + "%') " 
                + "OR (age_student LIKE '%" + text + "%')";
            }
        }
    }
    var sql = "SELECT t1.id_student, t1.name_student, t1.age_student, t2.name_class" + 
    " FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class" + 
    whereClause + ";";
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(students){
        res.render('search_student', {
            students: students
        });
    });
});

router.post('/sqlite/student/add', function(req, res){
    var values = [
        req.body.id,
        req.body.name,
        req.body.age,
        req.body.class
    ];
    var table = [
            'id_student',
            'name_student',
            'age_student',
            'id_class_student',
            'student'
    ];
    sqlite3.sqlite3Create(dbName, table, values, function(){
        var sql = "SELECT name_class FROM class WHERE id_class = '" + values[3] + "';";
        sqlite3.sqlite3QueryRow(dbName, sql, [], function(result){
            var row = {
                id_student: values[0],
                name_student: values[1],
                age_student: values[2],
                name_class: result.name_class
            };
            res.render('added_student', {
                row: row
            });
        });
    });
});

router.post('/sqlite/student/update', function(req, res){
    var values = [
        req.body.new_id,
        req.body.name,
        req.body.age,
        req.body.class,
        req.body.old_id
    ];
    var table = [
            'id_student',
            'name_student',
            'age_student',
            'id_class_student',
            'student'
    ];
    sqlite3.sqlite3Update(dbName, table, values, function(){
        var sql = "SELECT name_class FROM class WHERE id_class = '" + values[3] + "';";
        sqlite3.sqlite3QueryRow(dbName, sql, [], function(result){
            var row = {
                id_student: values[0],
                name_student: values[1],
                age_student: values[2],
                name_class: result.name_class
            };
            res.render('added_student', {
                row: row
            });
        });
    });
});

router.post('/sqlite/student/delete', function(req, res){
    var value = req.body.id;

    var table = [
            req.body.field,
            'student'
    ];
    sqlite3.sqlite3Delete(dbName, table, value, function(){
        jsonObject = {
            'code' : 200,
            'data' : null
        };
        res.json(jsonObject);
    });
});

module.exports = router;