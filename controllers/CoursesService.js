'use strict';
var mysql      = require('mysql');
var mysqlnesting      = require('node-mysql-nesting');
var mysql_config = require('../mysql_config.js');

var mysqlConnection = mysql_config.connectToDatabase();

exports.coursesGet = function(id, departmentId,callback) {
	var sql = 'SELECT * FROM courses LEFT JOIN departments ON departments.id = courses.department_id';
    if(!isNaN(id)){
        sql = 'SELECT * FROM courses LEFT JOIN departments ON departments.id = courses.department_id WHERE courses.id='+id;
    }
    else if(!isNaN(departmentId)){
        sql = 'SELECT * FROM courses LEFT JOIN departments ON departments.id = courses.department_id WHERE departments.id='+departmentId+' ORDER BY courseNumber ASC';
    }
    //Key relations require the column names to be the same, primary and foreign key
    var nestingOptions = [
        { tableName : 'courses', pkey: 'id', fkeys:[{table:'departments',col:'department_id'}]},
        { tableName : 'departments', pkey: 'id'},
    ];
	
    mysqlConnection.query({sql: sql, nestTables: true}, function (err, rows) {
        // error handling
        if (err){
            console.log('Internal error: ', err);
            return "Mysql query execution error!";
        }

        else {
            var nestedRows = mysqlnesting.convertToNested(rows, nestingOptions);
            callback(null,nestedRows);
        }
	});
}
