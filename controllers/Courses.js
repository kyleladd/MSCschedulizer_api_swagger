'use strict';

var url = require('url');
var async = require('async');

var Courses = require('./CoursesService');


module.exports.coursesGet = function coursesGet (req, res, next) {
  var id = req.swagger.params['id'].value;
  var departmentId = req.swagger.params['department_id'].value;
  
  async.series([
    function(callback){
	    Courses.coursesGet(id, departmentId,callback);
    }],
	function(err, result){
	  if(typeof result !== 'undefined') {
        res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(result[0] || {}, null, 2));
	  }
	  else
	    res.end();
	});
};
