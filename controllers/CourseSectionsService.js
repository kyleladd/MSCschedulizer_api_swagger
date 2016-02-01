'use strict';
var mysql      = require('mysql');
var mysqlnesting      = require('node-mysql-nesting');
var mysql_config = require('../mysql_config.js');

var mysqlConnection = mysql_config.connectToDatabase();

exports.courseSectionsGet = function(departmentId,callback) {
	var sql = 'SELECT * FROM course_sections '
    + 'LEFT JOIN courses ON course_sections.course_id = courses.id '
    + 'LEFT JOIN departments ON departments.id = courses.department_id '
    + 'LEFT JOIN course_terms ON course_sections.courseterm_id = course_terms.id '
    + 'LEFT JOIN meetings ON course_sections.id = meetings.coursesection_id '
    + 'LEFT JOIN term_weeks ON course_sections.courseterm_id = term_weeks.term_id '
    + 'WHERE courses.department_id='+departmentId +' '
    + 'ORDER BY courses.courseNumber ASC, course_sections.courseCRN ASC';

    //Key relations require the column names to be the same, primary and foreign key
    var nestingOptions = [
        { tableName : 'course_sections', pkey: 'id', fkeys:[{table:'courses',col:'course_id'},{table:'course_terms',col:'courseterm_id'}]},
        { tableName : 'courses', pkey: 'id', fkeys:[{table:'departments',col:'department_id'}]},
        { tableName : 'departments', pkey: 'id'},
        { tableName : 'course_terms', pkey: 'id'},
        { tableName : 'meetings', pkey: 'id', fkeys:[{table:'course_sections',col:'coursesection_id'}]},
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
            callback(null,nestedRows);
        }
	});
}