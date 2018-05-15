var express = require('express');
var router = express.Router();
const util = require('util');

router.route('/') 
    .get(function (request, response) {
        console.log('get all users request');
        var query = 'SELECT * FROM Users';
        global.db.all(query, function(err, rows) {
          if (err) {
            console.error('Error with query ' + err.message);
            response.status(400).json({Error: err.message});
          }
          else{
            if(rows.length > 0){
               response.json(rows); 
              }
              else
              {
                response.status(400).json({Error: 'No users found'});
              }
          }
        });
    }).post(function(request, response){
    //new user posting
    console.log(util.inspect(request.body, false, null));
    
    //first check that the correct body was sent with FirstName/LastName/MobilePhone of new user
    if(request.body.FirstName != null && request.body.LastName != null && request.body.MobilePhone != null){
      var query = 'INSERT INTO Users (FirstName,LastName,MobilePhone, LastUpdated)' +
                      'VALUES (?, ?, ?, datetime("now")) ';
                  
                  global.db.run(query,[request.body.FirstName, request.body.LastName, request.body.MobilePhone], function(err) {
                    if (err) {
                      console.error('Error inserting user ' +err.message);
                      response.status(400).json({Error: err.message});
                    }
                    else{
                      console.log(`Created User! ${request.body.FirstName} ${request.body.LastName} Row(s) updated: ${this.changes}`);

                      //201 status means "Created"
                      response.status(201).json({Result:"Succesfully created new user"});
                    }
                   });
    }else{
   //improper body sent
      response.status(400).json({Error: "your request "+util.inspect(request.body, false, null)+" was not set up properly, see example of what's required. (note: it needs to be POST'ed as x-www-form-urlencoded data)", 
       RequiredBody:{
        "FirstName": "Laxwell",
        "LastName": "Balti",
        "MobilePhone":"+14109296293"
      }});
    }
  }).put(function(request, response){
    //update an existing user
    console.log(util.inspect(request.body, false, null));
    
    //first check that the correct body was sent with user_id/FirstName/LastName/MobilePhone of new user
    if(request.body.user_id != null && request.body.FirstName != null && request.body.LastName != null && request.body.MobilePhone != null){
      var userID = request.body.user_id;
      checkUserExists(userID, function(user){
        if(user === false){
          response.status(400).json({Error: "user "+userID+" not found"});
        }
        else
        {
      
            var query = 'UPDATE Users Set FirstName = ?, LastName = ?, MobilePhone = ?,  LastUpdated = datetime("now") WHERE user_id = ?';
            //console.log(query,cityID);
            global.db.run(query,[request.body.FirstName, request.body.LastName, request.body.MobilePhone, userID], function(err) {
              if (err) {
                console.error('Error updating user ' +err.message);
                response.status(400).json({Error: err.message});
              }
              else{
                console.log(`Updated User! ${request.body.FirstName} ${request.body.LastName} Row(s) updated: ${this.changes}`);

                //202 status means "accepted"
                response.status(202).json({Result:"Succesfully updated user"});
              }
             });
        }
      });
    }
    else{
   //improper body sent
      response.status(400).json({Error: "your request "+util.inspect(request.body, false, null)+" was not set up properly, see example of what's required. (note: it needs to be POST'ed as x-www-form-urlencoded data)", 
       RequiredBody:{
        "user_id": "1",
        "FirstName": "Laxwell",
        "LastName": "Balti",
        "MobilePhone":"+14109296293"
      }});
    }
  }).delete(function(request, response){
    //delete an existing user
    console.log(util.inspect(request.body, false, null));
    
    //first check that the correct body was sent with user_id/FirstName/LastName/MobilePhone of new user
    if(request.body.user_id != null){
      var userID = request.body.user_id;
      checkUserExists(userID, function(user){
        if(user === false){
          response.status(400).json({Error: "user "+userID+" not found"});
        }
        else
        {
      
            var query = 'DELETE FROM Users WHERE user_id = ?';
            //console.log(query,cityID);
            global.db.run(query,[userID], function(err) {
              if (err) {
                console.error('Error deleting user ' +err.message);
                response.status(400).json({Error: err.message});
              }
              else{
                console.log(`Deleted User! Row(s) updated: ${this.changes}`);

                //202 status means "accepted"
                response.status(202).json({Result:"Succesfully deleted user"});
              }
             });
        }
      });
    }
    else{
   //improper body sent
      response.status(400).json({Error: "your request "+util.inspect(request.body, false, null)+" was not set up properly, see example of what's required. (note: it needs to be POST'ed as x-www-form-urlencoded data)", 
       RequiredBody:{
        "user_id": "1",
        "FirstName": "Laxwell",
        "LastName": "Balti",
        "MobilePhone":"+14109296293"
      }});
    }
  });

function checkUserExists(userID, callBack){
  var query ='SELECT * FROM Users WHERE user_id = ?';
  var returnVal;
  global.db.get(query, [userID], function(err, row) {
    if (err) {
      console.error('Error with query ' + err.message);
      callBack(false);
    }
    else{
      if(row != null){
        //console.log("user found");
        callBack(row);
      }
      else
      {
        console.log("user "+userID+" not found");
        callBack(false);
      }
    }
  });
}
module.exports = router;