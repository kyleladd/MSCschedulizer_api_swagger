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
},
exports.Get = function(courses,callback){
    var sql = 'SELECT * FROM courses '
    + 'LEFT JOIN course_sections ON course_sections.course_id = courses.id '
    + 'LEFT JOIN departments ON departments.id = courses.department_id '
    + 'LEFT JOIN course_terms ON course_sections.courseterm_id = course_terms.id '
    + 'LEFT JOIN meetings ON course_sections.id = meetings.coursesection_id '
    + 'LEFT JOIN required_identifiers ON course_sections.id = required_identifiers.section_id '
    + 'LEFT JOIN term_weeks ON course_sections.courseterm_id = term_weeks.term_id ';
    if(typeof courses != 'undefined'){
        if(courses.length != 0){
            sql += 'WHERE courses.id IN (' + courses.join(',') + ')';
        }
    }
    //Key relations require the column names to be the same, primary and foreign key
    var nestingOptions = [
        { tableName : 'courses', pkey: 'id', fkeys:[{table:'departments',col:'department_id'}]},
        { tableName : 'course_sections', pkey: 'id', fkeys:[{table:'courses',col:'course_id'},{table:'course_terms',col:'courseterm_id'}]},
        { tableName : 'departments', pkey: 'id'},
        { tableName : 'course_terms', pkey: 'id'},
        { tableName : 'meetings', pkey: 'id', fkeys:[{table:'course_sections',col:'coursesection_id'}]},
        { tableName : 'required_identifiers', pkey: 'id', fkeys:[{table:'course_sections',col:'section_id'}]},
        { tableName : 'term_weeks', pkey: 'id', fkeys:[{table:'course_terms',col:'term_id'}]}
    ];
    
    mysqlConnection.query({sql: sql, nestTables: true}, function (err, rows) {
        // error handling
        if (err){
            console.log('Internal error: ', err);
            return "Mysql query execution error!";
        }

        else {
            var nestedRows = mysqlnesting.convertToNested(rows, nestingOptions);
            for (var h = nestedRows.length-1; h >= 0; h--) {
                for (var s = nestedRows[h].course_sections.length-1; s >= 0; s--) {
                    // console.log(nestedRows[h].course_sections[s]);
                    nestedRows[h].course_sections[s].course_terms.term_weeks = [];
                }
            }
            callback(null,nestedRows);
        }
    });
}
