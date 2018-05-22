// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var accountSid = 'ACd90f0be6668fbcae6bd3d4e4ff9449bf'; // Your Account SID from www.twilio.com/console
//var accountSid = 'ACa37308cbc12fecbd022755ca4d296b02'; // test account

var authToken = process.env.SECRET;   // Your Auth Token from www.twilio.com/console
//var authToken = process.env.SECRET;   // test
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
const util = require('util');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

//routes and route files
var dbSetup = require('./db-setup.js');
var userRequests = require('./user.js');

app.use('/resettables', dbSetup);
app.use('/user', userRequests);



// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  console.log('home page');
  response.sendFile(__dirname + '/views/index.html');
});

// main function, sends messages with Twilio
app.post('/sendmessage', function(request, response) {
  
  //one option would be to require user_ids for the message sending but let's just do numbers
  console.log(util.inspect(request.body, false, null));
  
  if(request.body.MobilePhone != null && request.body.MessageBody != null){
    var phones = request.body.MobilePhone.split(',');
    console.log('attempting to send '+ phones.length+' message(s)');
    phones.forEach(function(MobilePhone){
      //send the actual message
      client.messages.create({
          body: request.body.MessageBody,
          to: MobilePhone,  // Text this number
          from: '+19192136533' // From our Twilio number
      }, function(err, result) {
        if(err != null){
          console.log('error sending message', util.inspect(err, false, null));
          response.json({error:err});
        }
        else{
          console.log('message sent!');
          response.json({messagesid:result.sid});
        }
      });
      
    });
  }
  else
  {
    //improper body sent
      response.status(400).json({Error: "your request "+util.inspect(request.body, false, null)+" was not set up properly, see example of what's required. (note: it needs to be POST'ed as x-www-form-urlencoded data)", 
       RequiredBody:{
        "MobilePhone": "+1410.... Note: this can also be an array []",
        "MessageBody": "Hello world SMS"
      }});
  }
});
// function sendMessage(MobilePhone,body){
//  client.messages.create({
//           body: body,
//           to: MobilePhone,  // Text this number
//           from: '+19192136533' // From a valid Twilio number
//       })
//       .then(function(message){
//         console.log('message sent!');
//         response.json({messagesid:message.sid});
//       }).catch(function(error){
//         console.log('error sending message', util.inspect(error, false, null));
//       }).done(function(shruggie){
//         console.log('i guess we\'re done?');
//       }); 
// }

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
