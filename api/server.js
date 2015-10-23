"use strict";

var express = require('express');
var app = express();

app.get('/api/demographics', require('./controllers/demographics-controller.js'));
app.get('/api/heat-data', require('./controllers/heat-data-controller.js'));


var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Business Landing server listening on port %s', port)
});
