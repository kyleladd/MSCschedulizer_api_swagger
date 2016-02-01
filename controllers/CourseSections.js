'use strict';

var url = require('url');
var async = require('async');

var CourseSections = require('./CourseSectionsService');


module.exports.courseSectionsGet = function courseSectionsGet (req, res, next) {
	var departmentId = req.swagger.params['department_id'].value;
	async.series([
		function(callback){
			CourseSections.courseSectionsGet(departmentId,callback);
		}],
		function(err, result){
		  if(typeof result !== 'undefined') {
		    res.setHeader('Access-Control-Allow-Origin', '*');
		    res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify(result[0] || {}, null, 2));
		  }
		  else{
		  	res.end();
		  }  
	});
};
