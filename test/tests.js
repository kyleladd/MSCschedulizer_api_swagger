// var exec = require('child_process').exec;
var request = require('supertest');
var server;
var mysql_config = require('../mysql_config.js');
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
describe('loading express', function () {
  // before(function() {
  //   // runs before all tests in this block
  //   exec("node ../mscschedulizer_scraper/main.js --db true", function(error, stdout, stderr) {
  //     // command output is in stdout
  //   });
  // });
  beforeEach(function () {
    delete require.cache[require.resolve('../index')];
    mysql_config.mySQLConfiguration = sinon.stub().returns(mysql_config.mySQLConfiguration(true));
    server = require('../index');
  });
  afterEach(function () {
    server.close(function () { console.log('Server closed!'); });
  });
  it('responds to /departments', function testSlash(done) {
  request(server)
    .get('/v1/departments')
    .set('Accept', 'application/json')
    .expect(200, done);
    // .expect(200,[], done);
  });
  it('responds to /courses', function testSlash(done) {
  request(server)
    .get('/v1/courses')
    .set('Accept', 'application/json')
    .expect(200, done);
  });
  it('500 to /schedule', function testSlash(done) {
  request(server)
    .get('/v1/schedule')
    .set('Accept', 'application/json')
    .expect(400, done);
  });
  it('responds to /schedule/ with courses and brackets', function testSlash(done) {
  request(server)
    .get('/v1/schedule/?courses[]=1&courses[]=2&courses[]=3')
    .set('Accept', 'application/json')
    .expect(200, done);
  });
  it('responds to /schedule/ with courses and without brackets', function testSlash(done) {
  request(server)
    .get('/v1/schedule/?courses=1&courses=2&courses=3')
    .set('Accept', 'application/json')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .set('Accept', 'application/json')
      .expect(404, done);
  });
});