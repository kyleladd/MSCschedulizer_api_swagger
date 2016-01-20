var genericfunctions = require('node_generic_functions');
var mysql      = require('mysql');
var mySQLConfiguration = function (isTest) {
    if(genericfunctions.toBoolean(isTest)===true){
        return {
            host:"",
            database:"",
            user: "",
            password: ""
        };
    }
    return {
        host:"",
        database:"",
        user: "",
        password: ""
    };
  };
  
  var connectToDatabase = function(isTest) {
      var mysqlConnection = mysql.createConnection(mySQLConfiguration(isTest)); // Recreate the connection, since
                                                      // the old one cannot be reused.
      mysqlConnection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(connectToDatabase(isTest), 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
                                              // If you're also serving http, display a 503 error.
      mysqlConnection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          connectToDatabase(isTest);                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });
      return mysqlConnection;
    };
module.exports = {
  mySQLConfiguration:mySQLConfiguration,
  connectToDatabase:connectToDatabase
};