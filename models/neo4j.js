var neo4j = require('neo4j-driver');
var driver = neo4j.driver(
    'bolt://localhost:7687', 
    neo4j.auth.basic('neo4j', '123'),
    { disableLosslessIntegers: true }
);

exports.neo4jQuery = function(cypher, params, callback){
    var session = driver.session();
    session
    .run(cypher, params)
    .then(function(result){
        var resultReturn = [];
        result.records.forEach(function(record){
            var obj = {};
            var keys = record.keys.map(function(key){
                return key.substr(2);
            });
            var fields = record._fields;
            keys.forEach(function(key, i){
                obj[key] = fields[i];
            });
            resultReturn.push(obj);
        });
        //console.log(resultReturn);
        callback(resultReturn);
    })
    .catch(function(error){
        console.log(error);
        callback(false);
    })
    .then(function(){
        session.close();
    });
}