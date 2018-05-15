// init sqlite db
var fs = require('fs');
const util = require('util');
var dbFile = './.data/sqlite.db';
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var router = express.Router();

function dbExists(){return fs.existsSync(dbFile)}
if(dbExists()){
    //console.log('db file exists at the start');
    setDBFile();
}
else{
  setDBFileAndCreate();
}

function setDBFile(){
  global.db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
      console.error(err.message);
    }
    else{
      console.log('Connected to the local sqlite database.');
      //setUpTables();
    }
  });
}
function setDBFileAndCreate(){
  global.db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
      console.error("Error initializing db file "+err.message);
    }
    else{
      console.log('Connected to the local sqlite database.');
      setUpTables();
    }
  });
}

//clearDB();
//setDBFile();
//setUpTables(); 

function clearDB(){
  if(dbExists()){
   fs.unlink(dbFile, (err) => {
      if (err) throw err;
      console.log(dbFile + ' was deleted');
      setDBFileAndCreate();
    }); 
  }
}

function setUpTables(){
// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
global.db.serialize(function(){
  if (dbExists()) {
    console.log('DB exists before tables');
  }
    global.db.run('CREATE TABLE Users ('+
                  'user_id integer PRIMARY KEY,'+
                  'FirstName text NOT NULL,'+
                  'LastName text NOT NULL,'+
                  'MobilePhone text NOT NULL,'+
                  'LastUpdated text NOT NULL'+
                 ')', function(err) {
          if (err) {
            return console.error('Error creating table Users ' + err.message);
          }
      
          else{
            console.log('New table Users created!');
          }
    });
});
}

router.route('/')
    .all(function (request, response) {
        console.log('delete request'+request);
        clearDB();
        response.json("table reset and setup was successful");
    });

module.exports = router;