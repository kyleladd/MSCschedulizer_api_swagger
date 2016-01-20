'use strict';

var url = require('url');
var async = require('async');

var Departments = require('./DepartmentsService');


module.exports.departmentsGet = function departmentsGet (req, res, next) {
	async.series([
		function(callback){
			Departments.departmentsGet(callback);
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
