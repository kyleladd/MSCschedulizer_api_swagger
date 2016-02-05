'use strict';
var mysql      = require('mysql');
var mysqlnesting      = require('node-mysql-nesting');
var mysql_config = require('../mysql_config.js');
var genericfunctions = require('node_generic_functions');
var schedule = require('../schedule_functions.js');
var util = require('util');

var mysqlConnection = mysql_config.connectToDatabase();

exports.scheduleGet = function(courses, callback) {
    var sectionCombinations = [];
    var courseslist = [];
    var outputCombinations = [];
    if(typeof courses != 'undefined'){
        // Any more than 20 courses selected is ridiculous
        if(courses.length > 20){
            courses = [];
        }
    }
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
            for (var i in nestedRows) {
              var course = nestedRows[i];
              var aSectionCombination = schedule.getSectionCombinations(course.course_sections);
              sectionCombinations.push(aSectionCombination);
              courseslist.push({id:course.id,name:course.name,courseNumber:course.courseNumber,department:course.departments});
            }
            var scheduleCombinations = schedule.getScheduleCombinations(sectionCombinations);
            // For each schedule
            for (var h = scheduleCombinations.length-1; h >= 0; h--) {
                outputCombinations[h] = [];
                //for each class in the schedule
                for (var c = scheduleCombinations[h].length-1; c >= 0; c--) {
                    var coursekey = genericfunctions.searchListDictionaries(courseslist,{id:scheduleCombinations[h][c][0].course_id});
                    // Deep copy around ByRef
                    outputCombinations[h][c] = JSON.parse(JSON.stringify(coursekey));
                    outputCombinations[h][c].course_sections = JSON.parse(JSON.stringify(scheduleCombinations[h][c]));
                }
            }
            callback(null,outputCombinations);
        }
	});
}