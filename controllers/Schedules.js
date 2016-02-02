'use strict';

var url = require('url');
var async = require('async');
var util = require('util');

var Schedules = require('./SchedulesService');


module.exports.scheduleGet = function scheduleGet (req, res, next) {
	async.series([
		function(callback){
			var courses = req.swagger.params['courses'].originalValue;
			// console.log(req.swagger.params['courses']);
			// ?courses[]=1&courses[]=2&courses[]=3
			// ?courses=1&courses=2&courses=3
			// .value does not allow a list
			Schedules.scheduleGet(courses,callback);
		}],
		function(err, result){
		  if(typeof result !== 'undefined') {
		    res.setHeader('Access-Control-Allow-Origin', '*');
		    res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify(result[0]));
		  }
		  else{
		  	res.end();
		  }
	});
};
