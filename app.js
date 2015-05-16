var express = require('express');
var app = express();
var routes = require('./routes');
var morgan = require('morgan');

app.use('/', routes);
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening on http://%s:%s', host, port);
});
