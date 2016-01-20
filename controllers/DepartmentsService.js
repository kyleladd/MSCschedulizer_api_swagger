'use strict';
var mysql      = require('mysql');
var mysqlnesting      = require('node-mysql-nesting');
var mysql_config = require('../mysql_config.js');

var mysqlConnection = mysql_config.connectToDatabase();

exports.departmentsGet = function(callback) {
	var sql = 'SELECT * FROM departments';
    //Key relations require the column names to be the same, primary and foreign key
    // var nestingOptions = [
    //     { tableName : 'departments', pkey: 'id'},
    // ];

    mysqlConnection.query({sql: sql, nestTables: false}, function (err, rows) {
        // error handling
        if (err){
            console.log('Internal error: ', err);
            return "Mysql query execution error!";
        }

        else {
            // var nestedRows = mysqlnesting.convertToNested(rows, nestingOptions);
            callback(null,rows);
        }
	});
}