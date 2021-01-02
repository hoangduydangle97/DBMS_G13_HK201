var express = require('express');
var router = express.Router();
var sqlite3 = require('../models/sqlite3');
var neo4jDriver = require('../models/neo4j');
var dbName = 'school';

//index Routers
router.get('/', function(req, res){
    res.render('index');
});

//SQLite Routers//
router.get('/sqlite/school/', function(req, res){
    res.render('sqlite');
});

//SQLite Routers - Student
router.get('/sqlite/error', function(req, res){
    res.render('error', {
        page: ['sqlite', 'student']
    });
});

router.get('/sqlite/school/student', function(req, res){
    var sql = 'SELECT t1.*, t2.name_class FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class;';
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(students){
        if(students){
            res.render('student', {
                students: students,
                page: 'sqlite'
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/student/add-btn', function(req, res){
    sql = 'SELECT * FROM class;';
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(classes){
        if(classes){
            res.render('create_student', {
                classes: classes
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/student/update-btn', function(req, res){
    var sql = "SELECT t1.*, t2.name_class FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class WHERE id_student = '" + req.body.id + "';";
    sqlite3.sqlite3QueryRow(dbName, sql, [], function(student){
        if(student){
            sql = 'SELECT * FROM class;';
            sqlite3.sqlite3QueryRows(dbName, sql, [], function(classes){
                if(classes){
                    res.render('update_student', {
                        student: student,
                        classes: classes
                    });
                }
                else{
                    res.send('error');
                }
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/student/cancel-btn', function(req, res){
    var sql = "SELECT t1.*, t2.name_class FROM student t1 LEFT JOIN class t2 ON t1.id_class_student = t2.id_class WHERE id_student = '" + req.body.id + "';";
    sqlite3.sqlite3QueryRow(dbName, sql, [], function(row){
        if(row){
            res.render('added_student', {
                row: row
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/student/search', function(req, res){
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
        if(students){
            res.render('search_student', {
                students: students
            });
        }
        else{
            res.send('error');
        }
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
    sqlite3.sqlite3Create(dbName, table, values, function(resultAdd){
        if(resultAdd){
            var sql = "SELECT name_class FROM class WHERE id_class = '" + values[3] + "';";
            sqlite3.sqlite3QueryRow(dbName, sql, [], function(result){
                if(result){
                    var row = {
                        id_student: values[0],
                        name_student: values[1],
                        age_student: values[2],
                        name_class: result.name_class
                    };
                    res.render('added_student', {
                        row: row
                    });
                }
                else{
                    res.send('error');
                }
            });
        }
        else{
            res.send('error');
        }
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
    sqlite3.sqlite3Update(dbName, table, values, function(resultUpdate){
        if(resultUpdate){
            var sql = "SELECT name_class FROM class WHERE id_class = '" + values[3] + "';";
            sqlite3.sqlite3QueryRow(dbName, sql, [], function(result){
                if(result){
                    var row = {
                        id_student: values[0],
                        name_student: values[1],
                        age_student: values[2],
                        name_class: result.name_class
                    };
                    res.render('added_student', {
                        row: row
                    });
                }
                else{
                    res.send('error');
                }
            });
        }
        else{
            res.send('error');
        }
        
    });
});

router.post('/sqlite/student/delete', function(req, res){
    var value = req.body.id;

    var table = [
        req.body.field,
        'student'
    ];
    sqlite3.sqlite3Delete(dbName, table, value, function(result){
        if(result){
            jsonObject = {
                'code' : 200,
                'data' : null
            };
            res.json(jsonObject);
        }
        else{
            jsonObject = {
                'code' : 500,
                'data' : null
            };
            res.json(jsonObject);
        }
    });
});

//SQLite Routers - Class
router.get('/sqlite/error', function(req, res){
    res.render('error', {
        page: ['sqlite', 'class']
    });
});

router.get('/sqlite/school/class', function(req, res){
    var sql = 'SELECT * FROM class;';
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(classes){
        if(classes){
            res.render('class', {
                classes: classes,
                page: 'sqlite'
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/class/add-btn', function(req, res){
    res.render('create_class');
});

router.post('/sqlite/ajax/class/update-btn', function(req, res){
    var sql = "SELECT * FROM class WHERE id_class = '" + req.body.id + "';";
    sqlite3.sqlite3QueryRow(dbName, sql, [], function(row){
        if(row){
            res.render('update_class', {
                row: row
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/class/cancel-btn', function(req, res){
    var sql = "SELECT * FROM class WHERE id_class = '" + req.body.id + "';";
    sqlite3.sqlite3QueryRow(dbName, sql, [], function(row){
        if(row){
            res.render('added_class', {
                row: row
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/ajax/class/search', function(req, res){
    var text = req.body.text;
    var whereClause = '';
    if(text != ''){
        if(isNaN(Number(text))){
            whereClause = " WHERE name_class LIKE '%" + text + "%'";
        }
        else{
            text = Number(text);
            if(Number.isInteger(text)){
                whereClause = " WHERE id_class LIKE '%" + text + "%'";
            }
        }
    }
    var sql = "SELECT * FROM class" + whereClause + ";";
    sqlite3.sqlite3QueryRows(dbName, sql, [], function(classes){
        if(classes){
            res.render('search_class', {
                classes: classes
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/class/add', function(req, res){
    var values = [
        req.body.id,
        req.body.name
    ];
    var table = [
        'id_class',
        'name_class',
        'class'
    ];
    sqlite3.sqlite3Create(dbName, table, values, function(resultAdd){
        if(resultAdd){
            var row = {
                id_class: values[0],
                name_class: values[1]
            };
            res.render('added_class', {
                row: row
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/class/update', function(req, res){
    var values = [
        req.body.new_id,
        req.body.name,
        req.body.old_id
    ];
    var table = [
        'id_class',
        'name_class',
        'class'
    ];
    sqlite3.sqlite3Update(dbName, table, values, function(resultUpdate){
        if(resultUpdate){
            var row = {
                id_class: values[0],
                name_class: values[1]
            };
            res.render('added_class', {
                row: row
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/sqlite/class/delete', function(req, res){
    var value = req.body.id;
    var table = [
        req.body.field,
        'class'
    ];
    sqlite3.sqlite3Delete(dbName, table, value, function(result){
        if(result){
            jsonObject = {
                'code' : 200,
                'data' : null
            };
            res.json(jsonObject);
        }
        else{
            jsonObject = {
                'code' : 500,
                'data' : null
            };
            res.json(jsonObject);
        }
    });
});

//Neo4j Routers//
router.get('/neo4j/error', function(req, res){
    res.render('error', {
        page: ['neo4j', 'student']
    });
});

//Neo4j Routers - Student
router.get('/neo4j/school/student', function(req, res){
    var cypher = 
    `
    MATCH(s:Student)-[:BELONGS_TO]->(c:Class)
    RETURN s.id_student, s.name_student, s.age_student, c.name_class ORDER BY s.id_student ASC
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {}, function(students){
        if(students){
            res.render('student', {
                students: students,
                page: 'neo4j'
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/neo4j/ajax/student/add-btn', function(req, res){
    var cypher = 
    `
    MATCH(c:Class)
    RETURN c.id_class, c.name_class
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {},  function(classes){
        if(classes){
            res.render('create_student', {
                classes: classes
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/neo4j/ajax/student/update-btn', function(req, res){
    var cypher = 
    `
    MATCH(s:Student{id_student: $id})-[:BELONGS_TO]->(c:Class)
    RETURN s.id_student, s.name_student, s.age_student, c.name_class
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {id: req.body.id}, function(student){
        student = student[0];
        cypher = 
        `
        MATCH(c:Class)
        RETURN c.id_class, c.name_class
        `;
        neo4jDriver.neo4jQuery(cypher, {}, function(classes){
            if(classes){
                res.render('update_student', {
                    student: student,
                    classes: classes
                });
            }
            else{
                res.send('error');
            }
        });
    });
});

router.post('/neo4j/ajax/student/cancel-btn', function(req, res){
    var cypher = 
    `
    MATCH(s:Student{id_student: $id})-[:BELONGS_TO]->(c:Class)
    RETURN s.id_student, s.name_student, s.age_student, c.name_class
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {id: req.body.id}, function(row){
        if(row){
            row = row[0];
            res.render('added_student', {
                row: row
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/neo4j/ajax/student/search', function(req, res){
    var text = req.body.text;
    var whereClause = '';
    if(text != ''){
        if(isNaN(Number(text))){
            text = text.toLowerCase();
            whereClause = 
            `
            WHERE (toLower(s.name_student) CONTAINS '` + text + `')
            OR (toLower(c.name_class) CONTAINS '` + text + `')
            `
        }
        else{
            text = Number(text);
            if(Number.isInteger(text)){
                whereClause = 
                `
                WHERE (toString(s.id_student) CONTAINS '` + text + `') 
                OR (toString(s.age_student) CONTAINS '` + text + `')
                `
                ;
            }
        }
    }
    var cypher = "MATCH(s:Student)-[:BELONGS_TO]->(c:Class)" + whereClause + 
    `RETURN s.id_student, s.name_student, s.age_student, c.name_class 
    ORDER BY s.id_student ASC`;
    neo4jDriver.neo4jQuery(cypher, {}, function(students){
        if(students){
            res.render('search_student', {
                students: students
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/neo4j/student/add', function(req, res){
    var values = [
        req.body.id,
        req.body.name,
        req.body.age,
        req.body.class
    ];
    var cypher = 
    `
    MATCH(c:Class{id_class: '` + values[3] + `'})
    CREATE(s:Student{id_student: '` + values[0] + `', 
    name_student: '` + values[1] + `', age_student: ` + values[2] + `})
    -[:BELONGS_TO]->(c)
    RETURN s.id_student
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {}, function(resultAdd){
        if(resultAdd){
            cypher = 
            `
            MATCH(c:Class{id_class: '` + values[3] + `'})
            RETURN c.name_class
            `
            ;
            neo4jDriver.neo4jQuery(cypher, {}, function(result){
                if(result){
                    result = result[0];
                    var row = {
                        id_student: values[0],
                        name_student: values[1],
                        age_student: values[2],
                        name_class: result.name_class
                    };
                    res.render('added_student', {
                        row: row
                    });
                }
                else{
                    res.send('error');
                }
            });
        }
        else{
            res.send('error');
        }
    });
});

router.post('/neo4j/student/update', function(req, res){
    var values = [
        req.body.new_id,
        req.body.name,
        req.body.age,
        req.body.class,
        req.body.old_id
    ];
    var cypher = 
    `
    MATCH(c:Class{id_class: '` + values[3] + `'})
    MATCH(s:Student{id_student: '` + values[4] + `'})-[r:BELONGS_TO]->(:Class)
    SET s.id_student = '` + values[0] + `', s.name_student = '` + values[1] + `', 
    s.age_student = ` + values[2] + `
    DELETE r
    CREATE(s)-[:BELONGS_TO]->(c)
    RETURN s.id_student
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {}, function(){
        cypher = 
        `
        MATCH(c:Class{id_class: '` + values[3] + `'})
        RETURN c.name_class
        `
        ;
        neo4jDriver.neo4jQuery(cypher, {}, function(result){
            if(result){
                result = result[0];
                var row = {
                    id_student: values[0],
                    name_student: values[1],
                    age_student: values[2],
                    name_class: result.name_class
                };
                res.render('added_student', {
                    row: row
                });
            }
            else{
                res.send('error');
            }
        });
    });
});

router.post('/neo4j/student/delete', function(req, res){
    var value = req.body.id;
    var cypher = 
    `
    MATCH(s:Student{id_student: '` + value + `'})-[:BELONGS_TO]->(c:Class)
    DETACH DELETE s
    RETURN c.id_class
    `
    ;
    neo4jDriver.neo4jQuery(cypher, {}, function(result){
        if(result){
            jsonObject = {
                'code' : 200,
                'data' : null
            };
            res.json(jsonObject);
        }
        else{
            jsonObject = {
                'code' : 500,
                'data' : null
            };
            res.json(jsonObject);
        }
    });
});

module.exports = router;