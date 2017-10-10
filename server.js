// # SimpleServer
// A simple chat bot server

var http = require('http');
var express = require('express');
var router = express();

var app = express();

var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});


app.get('/webhook', function(req, res) {
  console.log("Hello bot");
  if (req.query['hub.verify_token'] === 'hello_facebook') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token1');
});

app.post('/webhook', function (req, res) {
  console.log("Hello bot123");
  var data = req.body;
	console.log(data);
});
  
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAB2b23tGngBAMVNUn22tBZBWZA7lhHUFH6l8PTgjLXGFjYWZCwEUPSe93hvQRcknA8rBsYOKfmuhwVUrxkEdZABwLxRb7SMA0PbuBKi5ZCBhKbbxg70g0JeKZC3PpEcvf1xaQOKWYaTlhRWZCIWSD37S86cvNsVFINVc1Khay7KcXsRY36JeqR" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
app.set('port', process.env.PORT || 3002);

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});