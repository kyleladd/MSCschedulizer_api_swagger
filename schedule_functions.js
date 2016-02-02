var Combinatorics = require('js-combinatorics');

var doDaysOverlap = function(meeting1,meeting2){
    if(meeting1.monday==1&&meeting2.monday==1){
        return true;
    }
    else if(meeting1.tuesday==1&&meeting2.tuesday==1){
        return true;
    }
    else if(meeting1.wednesday==1&&meeting2.wednesday==1){
        return true;
    }
    else if(meeting1.thursday==1&&meeting2.thursday==1){
        return true;
    }
    else if(meeting1.friday==1&&meeting2.friday==1){
        return true;
    }
    return false;
};

var doTimesOverlap = function(timeblock1,timeblock2){
    if(timeblock1.startTime != 0 && timeblock1.endTime != 0 &&timeblock2.startTime != 0 &&timeblock2.endTime != 0){
        if((timeblock1.startTime <= timeblock2.startTime && timeblock1.endTime > timeblock2.startTime)||((timeblock2.startTime <= timeblock1.startTime && timeblock2.endTime > timeblock1.startTime))){
            return true;
        }
    }
    return false;
};

var doWeeksOverlap = function(weeks1,weeks2){
    // for (var w = weeks1.length-1; w >= 0; w--) {
    //     if(weeks1[w] in weeks2){
    //         return true;
    //     }
    // }
    return false;
};

var doMeetingsOverlap = function(section1meetings,section2meetings){
    //for each meeting in section1
    if(typeof section1meetings !== 'undefined' && typeof section2meetings !== 'undefined'){
        for (var i = section1meetings.length-1; i >= 0; i--) {
            var s1meeting = section1meetings[i];
            //for each meeting in section2
            for (var m = section2meetings.length-1; m >= 0; m--) {
                var s2meeting = section2meetings[m];
                if(doTimesOverlap({startTime:s1meeting.startTime,endTime:s1meeting.endTime},{startTime:s2meeting.startTime,endTime:s2meeting.endTime})){
                    if(doDaysOverlap(s1meeting,s2meeting)){
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

var doSectionsOverlap = function(section1,section2){
    if(doMeetingsOverlap(section1.meetings,section2.meetings)){
        var weeks1 = [];
        var weeks2 = [];
        for (var w = section1.course_terms.term_weeks.length-1; w >= 0; w--) {
            weeks1.push(section1.course_terms.term_weeks[w].week);
        }
        for (var w = section2.course_terms.term_weeks.length-1; w >= 0; w--) {
            weeks2.push(section2.course_terms.term_weeks[w].week);
        }
        if(doWeeksOverlap(weeks1,weeks2)){
        // if(doWeeksOverlap(section1.course_terms.term_weeks,section2.course_terms.term_weeks)){
            return true;
        }
    }
    return false;
};

var convertTermWeeksToList = function(term_weeks){
    var weeks = [];
    // console.log(course_section.course_terms);
    for (var w = term_weeks.length-1; w >= 0; w--) {
        // console.log(course_section.course_terms.term_weeks);
        weeks.push(term_weeks[w].week);
    }
    // console.log("return");
    // console.log(weeks);
    return weeks;
};

var groupSections = function(course_sections){
    var grouped_sections = {};
    for (var i in course_sections) {
      var course_section = course_sections[i];
      var identifier = course_section['identifier'];
      if(identifier == ""){
        identifier = "empty";
      }
      if (!(identifier in grouped_sections)){
        grouped_sections[identifier] = [];
      }
      grouped_sections[identifier].push(course_section);
    }
    return grouped_sections;
};

var getSectionCombinations = function(course_sections){
    var grouped_sections = groupSections(course_sections);
    var values = [];
    Object.keys(grouped_sections).forEach(function(key) {
      var val = grouped_sections[key];
      values.push(val);
    });
    var cp = Combinatorics.cartesianProduct.apply(null,values)
    cp = cp.toArray();
    //Might remove this and just go with filtering in another function (get schedule combinations)-to prevent from going through this twice
    //For each combination
    for (var i = cp.length-1; i >= 0; i--) {
        var combination = cp[i];
        for (var s = combination.length-1; s >= 1; s--) {
            var section1 = combination[s];
            for (var t = s-1; t >= 0; t--) {
                var section2 = combination[t];
                if(doSectionsOverlap(section1,section2)){
                    //If they do overlap, remove combination and break
                    cp.splice(i, 1);
                    //break out of section loop
                }
            }
        }
    }
    return cp;
};
var getScheduleCombinations = function(section_combinations){
    var cp = Combinatorics.cartesianProduct.apply(null,section_combinations)
    cp = cp.toArray();
    //filter based on overlapping
    // returns list of schedules containing 
    //  a list of classes containing
    //   a list of sections
    // http://localhost:8014/v1/schedule/?courses[]=121&courses[]=127
    
    //for each schedule
    for (var h = cp.length-1; h >= 0; h--) {
        //for each class in the schedule
        classloop:
        for (var c = cp[h].length-1; c >= 1; c--) {
            var course = cp[h][c];
            //for each section in the class
            for (var s = course.length-1; s >= 0; s--) {
                var section1 = course[s];
                // Compare against all other class sections within schedule
                // don't need to compare against current class' sections because that was already done
                for (var oc = c-1; oc >= 0; oc--) {
                    var acourse = cp[h][oc];
                    for (var os = acourse.length-1; os >= 0; os--) {
                        var section2 = acourse[os];
                        if(doSectionsOverlap(section1,section2)){
                            //If they do overlap, remove combination and break
                            cp.splice(h, 1);
                            //Break out of course loop
                            break classloop;
                        }
                    }
                }
            }
        }
    }

    return cp;
};





module.exports = {
	doDaysOverlap:doDaysOverlap,
	doTimesOverlap:doTimesOverlap,
	doWeeksOverlap:doWeeksOverlap,
    convertTermWeeksToList:convertTermWeeksToList,
	doMeetingsOverlap:doMeetingsOverlap,
	doSectionsOverlap:doSectionsOverlap,
	groupSections:groupSections,
	getSectionCombinations:getSectionCombinations,
	getScheduleCombinations:getScheduleCombinations
};